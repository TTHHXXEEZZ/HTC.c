"use client";
import React, { useState } from 'react';
import { Upload, MapPin, Building2, Globe, Phone, FileText, ArrowLeft, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addWorkplaceAction, searchGoogleMapsPlacesAction } from '../actions';
import { DEPARTMENTS } from '../../services/departments';
import MapLoader from '../../components/MapLoader';

const WORKPLACE_CATEGORIES = [
  'เทคโนโลยีและซอฟต์แวร์',
  'การเงินและการธนาคาร',
  'ยานยนต์และการซ่อมบำรุง',
  'โรงแรมและการท่องเที่ยว',
  'พลังงานและสาธารณูปโภค',
  'คลังสินค้าและโลจิสติกส์',
  'การผลิตและอุตสาหกรรม',
  'การแพทย์และสาธารณสุข',
  'การศึกษาและวิจัย',
  'ค้าปลีกและบริการ',
  'โฆษณาและสื่อสารมวลชน',
  'เกษตรกรรมและอาหาร',
  'ก่อสร้างและอสังหาริมทรัพย์',
  'อื่น ๆ'
];

export default function RegisterClient({ user }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(WORKPLACE_CATEGORIES[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState(user?.email || '');
  const [lat, setLat] = useState(7.0084);
  const [lng, setLng] = useState(100.4975);
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingLocationInfo, setLoadingLocationInfo] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [searchingMap, setSearchingMap] = useState(false);

  const handleMapSearch = async (e) => {
    if (e) e.preventDefault();
    const query = mapSearchQuery.trim();
    if (!query) return;

    // Check if user pasted coordinates directly (e.g. "7.0084, 100.4975" or "7.0084 100.4975")
    const coordMatch = query.match(/^([+-]?\d+(?:\.\d+)?)[,\s]+([+-]?\d+(?:\.\d+)?)$/);
    if (coordMatch) {
      const parsedLat = parseFloat(coordMatch[1]);
      const parsedLng = parseFloat(coordMatch[2]);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        handleLocationChange({ lat: parsedLat, lng: parsedLng });
        setMapSearchResults([{
          name: `📍 พิกัดระบุ: ${parsedLat.toFixed(6)}, ${parsedLng.toFixed(6)}`,
          display_name: `ดึงตำแหน่งพิกัดที่ระบุด้วยตนเองสำเร็จ`,
          lat: parsedLat.toString(),
          lon: parsedLng.toString()
        }]);
        return;
      }
    }

    // Check if user pasted a Google Maps URL (e.g. contains coordinates)
    if (query.includes('google.com/maps') || query.includes('maps.app.goo.gl') || query.includes('geo:')) {
      const urlCoordMatch = query.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
      if (urlCoordMatch) {
        const parsedLat = parseFloat(urlCoordMatch[1]);
        const parsedLng = parseFloat(urlCoordMatch[2]);
        handleLocationChange({ lat: parsedLat, lng: parsedLng });
        setMapSearchResults([{
          name: `📍 พิกัดจากลิงก์: ${parsedLat.toFixed(6)}, ${parsedLng.toFixed(6)}`,
          display_name: `ถอดรหัสพิกัดจากลิงก์ Google Maps สำเร็จ`,
          lat: parsedLat.toString(),
          lon: parsedLng.toString()
        }]);
        return;
      }
    }

    setSearchingMap(true);
    try {
      const data = await searchGoogleMapsPlacesAction(query);
      const formatted = data.map(item => ({
        name: item.name,
        display_name: item.address,
        lat: item.lat.toString(),
        lon: item.lng.toString(),
        website: item.website,
        phone: item.phone
      }));
      setMapSearchResults(formatted);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setSearchingMap(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLocationChange = async (coords) => {
    setLat(coords.lat);
    setLng(coords.lng);

    setLoadingLocationInfo(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&accept-language=th,en`);
      if (response.ok) {
        const data = await response.json();
        
        // Auto-fill address
        if (data.display_name) {
          setAddress(data.display_name);
        }
        
        // Auto-fill name if it is a specific named place
        const addressObj = data.address || {};
        const placeName = data.name || addressObj.amenity || addressObj.building || addressObj.shop || addressObj.office || addressObj.industrial || addressObj.craft || addressObj.tourism || addressObj.leisure;
        
        if (placeName) {
          setName(placeName);
        }
      }
    } catch (e) {
      console.error('Error fetching reverse geocoding data:', e);
    } finally {
      setLoadingLocationInfo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('กรุณากรอกชื่อสถานประกอบการ');
      return;
    }
    if (!address.trim()) {
      alert('กรุณากรอกที่อยู่สถานประกอบการ');
      return;
    }

    setSubmitting(true);
    try {
      const workplaceData = {
        name: name.trim(),
        category,
        department,
        description: description.trim() || 'ข้อมูลแนะนำเกี่ยวกับสถานประกอบการ',
        address: address.trim(),
        website: website.trim(),
        phone: phone.trim(),
        lat,
        lng,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
      };

      const newWp = await addWorkplaceAction(workplaceData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('my_registered_workplace_name', name.trim());
        localStorage.setItem('my_registered_workplace_id', newWp.id);
      }
      router.push(`/workplace/${newWp.id}`);
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการลงทะเบียนสถานประกอบการ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page-container animate-fade-in">
      <div className="register-header-nav">
        <button onClick={() => router.push('/')} className="btn-back">
          <ArrowLeft size={16} />
          <span>ย้อนกลับไปหน้าหลัก</span>
        </button>
      </div>

      <div className="register-form-card card">
        <div className="form-card-header">
          <div className="header-icon-box">
            <Building2 size={24} />
          </div>
          <div className="header-text">
            <h2>ลงทะเบียนสถานประกอบการใหม่</h2>
            <p>กรอกรายละเอียดเพื่อสร้างฐานข้อมูลแนะแนวให้นักศึกษาวิทยาลัยเทคนิคหาดใหญ่</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            {/* Left Column: Form Details */}
            <div className="form-details-column">
              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label">ชื่อสถานประกอบการ / บริษัท *</label>
                  <div className="input-with-icon">
                    <Building2 size={16} className="input-icon" />
                    <input 
                      type="text" 
                      placeholder="เช่น บริษัท เอบีซี จำกัด" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">หมวดหมู่งาน</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {WORKPLACE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label">แผนกวิชาที่เกี่ยวข้อง</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์ติดต่อ</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon" />
                    <input 
                      type="text" 
                      placeholder="เช่น 074-XXX-XXX" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ลิงก์เว็บไซต์ / เพจ Facebook</label>
                <div className="input-with-icon">
                  <Globe size={16} className="input-icon" />
                  <input 
                    type="url" 
                    placeholder="เช่น https://www.example.com" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">รายละเอียดคำแนะนำเบื้องต้น</label>
                <div className="textarea-with-icon">
                  <FileText size={16} className="textarea-icon" />
                  <textarea 
                    rows={4} 
                    placeholder="อธิบายรายละเอียด เช่น ลักษณะงานที่ฝึกงาน, สภาพแวดล้อมการทำงาน..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ที่อยู่โดยละเอียด *</label>
                <textarea 
                  rows={2} 
                  placeholder="เลขที่, ถนน, ตำบล, อำเภอ..."
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Right Column: Cover & Map Location */}
            <div className="form-media-column">
              <div className="form-group">
                <label className="form-label">ภาพหน้าปกสถานประกอบการ</label>
                <div className="cover-upload-container">
                  {coverImage ? (
                    <div className="uploaded-cover-preview">
                      <img src={coverImage} alt="Cover Preview" />
                      <button 
                        type="button" 
                        onClick={() => setCoverImage('')} 
                        className="btn-remove-preview"
                      >
                        นำรูปออก
                      </button>
                    </div>
                  ) : (
                    <label className="cover-upload-dropzone">
                      <Upload size={32} />
                      <span>{uploading ? 'กำลังอัปโหลด...' : 'คลิกอัปโหลดภาพ (.png, .jpg)'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">พิกัดแผนที่ * (คลิกที่แผนที่เพื่อเลือกตำแหน่ง)</label>
                <div 
                  className="map-picker-wrapper" 
                  onClick={() => setShowMapModal(true)} 
                  style={{ cursor: 'pointer', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-color)', height: '200px' }}
                >
                  <MapLoader 
                    lat={lat} 
                    lng={lng} 
                    interactive={false} 
                    height="200px" 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(15, 23, 42, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    zIndex: 1000,
                    backdropFilter: 'blur(1.2px)',
                    transition: 'all 0.25s ease'
                  }}
                  className="map-click-overlay"
                  >
                    <MapPin size={22} style={{ marginBottom: '6px' }} />
                    <span>📍 คลิกเพื่อปักหมุด / เลือกตำแหน่งบนแผนที่</span>
                  </div>
                </div>

                <div className="location-selected-status card" style={{ marginTop: '12px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>
                    ตำแหน่งพิกัดที่เลือก:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginTop: '6px', fontWeight: '500' }}>
                    Latitude: {lat.toFixed(6)} | Longitude: {lng.toFixed(6)}
                  </div>
                  {address && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginTop: '6px', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      <strong>ที่อยู่อ้างอิง:</strong> {address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Picker Modal Popup */}
          {showMapModal && (
            <div className="sidebar-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', maxWidth: '1350px', width: '98%' }} className="modal-flex-layout">
                
                {/* Left Column: Floating Search Panel */}
                <div 
                  className="map-search-panel card animate-scale-up" 
                  style={{ 
                    width: '300px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px', 
                    background: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)' }}>🔍 ค้นหาสถานที่</h4>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="text" 
                      placeholder="พิมพ์ชื่อสถานที่ เช่น เซ็นทรัลหาดใหญ่..." 
                      value={mapSearchQuery} 
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleMapSearch();
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        flex: 1,
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--navy)'
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleMapSearch()} 
                      className="btn btn-primary" 
                      style={{ padding: '8px 12px', fontSize: '0.82rem', borderRadius: '6px' }}
                      disabled={searchingMap}
                    >
                      {searchingMap ? 'ค้น...' : 'ค้นหา'}
                    </button>
                  </div>

                  {/* Search Results List */}
                  <div className="search-results-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px', backgroundColor: 'var(--bg-main)', minHeight: '280px', maxHeight: '380px' }}>
                    {mapSearchResults.length === 0 ? (
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate)', textAlign: 'center', padding: '12px', fontWeight: '500' }}>
                        {searchingMap ? 'กำลังค้นหา...' : 'ป้อนชื่อสถานที่ข้างต้น'}
                      </div>
                    ) : (
                      mapSearchResults.map((res, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            const newLat = parseFloat(res.lat);
                            const newLng = parseFloat(res.lon);
                            handleLocationChange({ lat: newLat, lng: newLng });
                            if (res.name) setName(res.name);
                            if (res.display_name) setAddress(res.display_name);
                            if (res.website) setWebsite(res.website);
                            if (res.phone) setPhone(res.phone);
                          }}
                          style={{
                            textAlign: 'left',
                            padding: '8px',
                            background: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            color: 'var(--navy)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: '550',
                            width: '100%',
                            lineHeight: '1.3'
                          }}
                          className="map-search-result-item"
                        >
                          <strong>{res.name || 'สถานที่ไม่มีชื่อ'}</strong>
                          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--slate)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {res.display_name}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column: Map Modal */}
                <div className="modal-content location-picker-modal animate-scale-up" style={{ flex: 1, maxWidth: 'none', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column' }}>
                  <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 850, color: 'var(--navy)' }}>📍 เลือกตำแหน่งสถานประกอบการ</h3>
                    <button type="button" onClick={() => setShowMapModal(false)} className="modal-close-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate)', fontWeight: 500, lineHeight: '1.4' }}>
                      คลิกเลือกจุดบนแผนที่เพื่อปักหมุดพิกัดที่ถูกต้อง ข้อมูลชื่อร้าน/ที่อยู่ จะถูกค้นหาให้อัตโนมัติ
                    </p>
                    
                    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border-color)' }}>
                      <MapLoader 
                        lat={lat} 
                        lng={lng} 
                        interactive={true} 
                        onLocationChange={handleLocationChange} 
                        height="480px" 
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--navy)' }}>พิกัด: {lat.toFixed(6)}, {lng.toFixed(6)}</span>
                      {loadingLocationInfo && (
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>🔄 กำลังดึงข้อมูลที่อยู่จากหมุด...</span>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
                    <button type="button" className="btn btn-primary" onClick={() => setShowMapModal(false)} style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
                      ยืนยันตำแหน่งนี้
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          <div className="form-footer-action">
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn btn-primary btn-submit-large"
            >
              <Send size={16} />
              <span>{submitting ? 'กำลังบันทึกข้อมูล...' : 'ลงทะเบียนสถานประกอบการ'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .map-click-overlay:hover {
          background-color: rgba(15, 23, 42, 0.35) !important;
          backdrop-filter: blur(2px) !important;
        }

        .map-search-result-item:hover {
          border-color: var(--primary) !important;
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }

        .register-page-container {
          width: 100%;
          padding: 24px;
        }

        .register-header-nav {
          display: flex;
          margin-bottom: 20px;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--slate);
          cursor: pointer;
          font-weight: 750;
          font-size: 0.9rem;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .btn-back:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .register-form-card {
          padding: 40px;
          background-color: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          border: none;
          text-align: left;
        }

        .form-card-header {
          display: flex;
          gap: 16px;
          align-items: center;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 30px;
        }

        .header-icon-box {
          background-color: var(--primary-light);
          color: var(--primary);
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text h2 {
          font-size: 1.45rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
        }

        .header-text p {
          font-size: 0.88rem;
          color: var(--slate);
          margin: 4px 0 0 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 36px;
        }

        @media (max-width: 850px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-details-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-media-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row-two {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 500px) {
          .form-row-two {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 750;
          color: var(--navy);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--slate);
        }

        .input-with-icon input {
          width: 100%;
          padding: 10.5px 12px 10.5px 36px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          font-size: 0.85rem;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .input-with-icon input:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .form-group select {
          padding: 11px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 700;
          outline: none;
          cursor: pointer;
          font-size: 0.82rem;
          transition: var(--transition);
        }

        .form-group select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .form-group textarea {
          padding: 11px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-main);
          color: var(--navy);
          outline: none;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          resize: vertical;
        }

        .form-group textarea:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .textarea-with-icon {
          position: relative;
        }

        .textarea-icon {
          position: absolute;
          left: 12px;
          top: 14px;
          color: var(--slate);
        }

        .textarea-with-icon textarea {
          width: 100%;
          padding-left: 36px !important;
        }

        /* Dropzone Upload */
        .cover-upload-container {
          width: 100%;
          height: 180px;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .cover-upload-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          border: 2px dashed var(--border-focus);
          border-radius: var(--radius-md);
          background-color: var(--bg-main);
          cursor: pointer;
          color: var(--slate);
          font-size: 0.8rem;
          font-weight: 700;
          gap: 10px;
          transition: var(--transition);
        }

        .cover-upload-dropzone:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .uploaded-cover-preview {
          position: relative;
          height: 100%;
          width: 100%;
        }

        .uploaded-cover-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-remove-preview {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(239, 68, 68, 0.9);
          border: none;
          color: white;
          font-weight: 800;
          font-size: 0.72rem;
          padding: 6px 12px;
          border-radius: 50px;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-remove-preview:hover {
          background-color: var(--danger);
        }

        .map-picker-wrapper {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .coords-debug-row {
          font-size: 0.72rem;
          color: var(--slate);
          font-weight: 600;
          text-align: right;
          margin-top: 4px;
        }

        .form-footer-action {
          margin-top: 36px;
          border-top: 1.5px solid var(--border-color);
          padding-top: 24px;
          display: flex;
          justify-content: flex-end;
        }

        .btn-submit-large {
          padding: 12px 36px;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .modal-flex-layout {
            flex-direction: column !important;
            align-items: stretch !important;
            overflow-y: auto;
            max-height: 90vh;
          }
          .map-search-panel {
            width: 100% !important;
          }
        }

        .map-search-result-item:hover {
          border-color: var(--primary) !important;
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}
