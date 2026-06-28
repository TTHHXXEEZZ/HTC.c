"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Briefcase, Building2, Phone, FileText, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addInternshipJobAction, addWorkplaceAction, searchGoogleMapsPlacesAction } from '../../actions';
import { DEPARTMENTS } from '../../../services/departments';
import MapLoader from '../../../components/MapLoader';

export default function JobPostClient({ workplaces = [], user }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  
  // Workplace selection states
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState('');
  const [customCompanyName, setCustomCompanyName] = useState('');
  
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [salary, setSalary] = useState('');
  const [contact, setContact] = useState(user?.email || '');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myWorkplace, setMyWorkplace] = useState({ id: '', name: '' });

  // Map Coordinates & Picker states
  const [mapLat, setMapLat] = useState(7.0084);
  const [mapLng, setMapLng] = useState(100.4975);
  const [mapAddress, setMapAddress] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [searchingMap, setSearchingMap] = useState(false);
  const [loadingLocationInfo, setLoadingLocationInfo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('my_registered_workplace_name');
      const storedId = localStorage.getItem('my_registered_workplace_id');
      if (storedName) {
        setMyWorkplace({ id: storedId || 'custom', name: storedName });
        setSelectedWorkplaceId(storedId || 'custom');
        if (!storedId) {
          setCustomCompanyName(storedName);
        }
      }
    }
  }, []);

  const handleWorkplaceSelectChange = (val) => {
    setSelectedWorkplaceId(val);
    if (val === 'my_registered' || val === 'custom') {
      if (val === 'my_registered' && myWorkplace.name) {
        setCustomCompanyName(myWorkplace.name);
      } else {
        setCustomCompanyName('');
      }
      setMapLat(7.0084);
      setMapLng(100.4975);
      setMapAddress('');
    } else {
      const match = workplaces.find(w => w.id === val);
      if (match) {
        setCustomCompanyName(match.name);
        setMapLat(match.lat || 7.0084);
        setMapLng(match.lng || 100.4975);
        setMapAddress(match.address || '');
      }
    }
  };

  const handleLocationChange = async (coords) => {
    setMapLat(coords.lat);
    setMapLng(coords.lng);

    setLoadingLocationInfo(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&accept-language=th,en`);
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          setMapAddress(data.display_name);
        }
      }
    } catch (e) {
      console.error('Error fetching reverse geocoding data:', e);
    } finally {
      setLoadingLocationInfo(false);
    }
  };

  const handleMapSearch = async () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine final company name
    let companyName = "";
    if (selectedWorkplaceId === "custom" || selectedWorkplaceId === "my_registered" || !selectedWorkplaceId) {
      if (!customCompanyName.trim()) {
        alert("กรุณากรอกชื่อบริษัท/สถานประกอบการ");
        return;
      }
      companyName = customCompanyName.trim();

      // Automatically register this custom workplace on submit
      try {
        await addWorkplaceAction({
          name: companyName,
          category: "อื่น ๆ",
          department,
          description: description.trim() || "ประกาศรับสมัครนักศึกษาฝึกงาน",
          address: mapAddress || "หาดใหญ่",
          website: "",
          phone: contact,
          lat: mapLat,
          lng: mapLng,
          coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"
        });
      } catch (err) {
        console.error("Failed to automatically register workplace on submit:", err);
      }
    } else {
      const match = workplaces.find(w => w.id === selectedWorkplaceId);
      companyName = match ? match.name : "";
    }

    if (!title.trim() || !companyName || !contact.trim()) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    setSubmitting(true);
    try {
      await addInternshipJobAction({
        title: title.trim(),
        companyName,
        description: description.trim() || 'ไม่มีรายละเอียดเพิ่มเติม',
        requirements: requirements.trim() || 'ไม่มีระบุคุณสมบัติ',
        contact: contact.trim(),
        department,
        salary: salary.trim()
      });
      router.push('/jobs');
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการลงประกาศงาน');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-post-page-container animate-fade-in">
      <div className="register-header-nav">
        <button onClick={() => router.push('/jobs')} className="btn-back">
          <ArrowLeft size={16} />
          <span>ย้อนกลับไปหน้าประกาศรับสมัคร</span>
        </button>
      </div>

      <div className="register-form-card card">
        <div className="form-card-header">
          <div className="header-icon-box">
            <Briefcase size={24} />
          </div>
          <div className="header-text">
            <h2>ลงประกาศรับสมัครเด็กฝึกงาน</h2>
            <p>ลงประกาศรับสมัครงานของบริษัทของคุณเพื่อแนะแนวและรับสมัครนักศึกษาเทคนิคหาดใหญ่</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            
            {/* Left Column: Job Details */}
            <div className="form-inputs-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">หัวข้อประกาศรับสมัคร *</label>
                <div className="input-with-icon">
                  <Briefcase size={16} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="เช่น รับสมัครนักศึกษาฝึกงานตำแหน่งช่างไฟฟ้าด่วน"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">รายละเอียดงานโดยสังเขป</label>
                <div className="textarea-with-icon">
                  <FileText size={16} className="textarea-icon" />
                  <textarea 
                    rows={5} 
                    placeholder="อธิบายรายละเอียดลักษณะงานที่ปฏิบัติ เช่น งานบำรุงรักษาระบบไฟ, ช่วยติดตั้งอุปกรณ์..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">คุณสมบัติผู้สมัคร</label>
                <textarea 
                  rows={4} 
                  placeholder="ระบุคุณสมบัติหรือแผนกวิชาที่เน้น เช่น ระดับ ปวส. ขึ้นไป, มีความกระตือรือร้น..."
                  value={requirements} 
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Company details, Salary, Contact, and Map Preview/Picker */}
            <div className="form-media-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">เลือกสถานประกอบการ / บริษัท *</label>
                <select 
                  value={selectedWorkplaceId} 
                  onChange={(e) => handleWorkplaceSelectChange(e.target.value)}
                  required
                >
                  <option value="">-- เลือกบริษัท / สถานประกอบการ --</option>
                  {myWorkplace.name && (
                    <option value={myWorkplace.id === 'custom' ? 'my_registered' : myWorkplace.id}>
                      ⭐ สถานประกอบการของคุณ ({myWorkplace.name})
                    </option>
                  )}
                  {workplaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                  <option value="custom">อื่น ๆ (พิมพ์ระบุชื่อบริษัทเอง)</option>
                </select>
              </div>

              {/* Show custom text box if "Other" or "My Registered" is chosen */}
              {(selectedWorkplaceId === "custom" || selectedWorkplaceId === "my_registered" || !selectedWorkplaceId) && (
                <div className="form-group animate-scale-up" style={{ animationDuration: '0.2s' }}>
                  <label className="form-label">ระบุชื่อสถานประกอบการ / บริษัท *</label>
                  <div className="input-with-icon">
                    <Building2 size={16} className="input-icon" />
                    <input 
                      type="text" 
                      placeholder="พิมพ์ชื่อบริษัท เช่น บริษัท เอสเตท กรุ๊ป จำกัด"
                      value={customCompanyName} 
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      required={selectedWorkplaceId === "custom" || selectedWorkplaceId === "my_registered" || !selectedWorkplaceId}
                    />
                  </div>
                </div>
              )}

              {/* Map Preview or Picker based on company selection */}
              {selectedWorkplaceId && selectedWorkplaceId !== 'custom' && selectedWorkplaceId !== 'my_registered' ? (
                <div className="form-group animate-scale-up" style={{ animationDuration: '0.2s' }}>
                  <label className="form-label">แผนที่ที่ตั้งสถานประกอบการ (อิงตามฐานข้อมูล)</label>
                  <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-color)', height: '180px' }}>
                    <MapLoader 
                      lat={mapLat} 
                      lng={mapLng} 
                      interactive={false} 
                      height="180px" 
                    />
                  </div>
                  {mapAddress && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginTop: '6px', fontWeight: '500', lineHeight: '1.4' }}>
                      <strong>ที่ตั้ง:</strong> {mapAddress}
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group animate-scale-up" style={{ animationDuration: '0.2s' }}>
                  <label className="form-label">พิกัดแผนที่สถานประกอบการ * (คลิกเพื่อเลือกตำแหน่งใน Google Maps)</label>
                  <div 
                    className="map-picker-wrapper" 
                    onClick={() => setShowMapModal(true)} 
                    style={{ cursor: 'pointer', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-color)', height: '180px' }}
                  >
                    <MapLoader 
                      lat={mapLat} 
                      lng={mapLng} 
                      interactive={false} 
                      height="180px" 
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
                      fontSize: '0.82rem',
                      zIndex: 1000,
                      backdropFilter: 'blur(1.2px)',
                      transition: 'all 0.25s ease'
                    }}
                    className="map-click-overlay"
                    >
                      <MapPin size={20} style={{ marginBottom: '4px' }} />
                      <span>📍 คลิกเพื่อปักหมุดใน Google Maps</span>
                    </div>
                  </div>

                  <div className="location-selected-status card" style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate)', fontWeight: '550' }}>
                      พิกัด: {mapLat.toFixed(6)}, {mapLng.toFixed(6)}
                    </div>
                    {mapAddress && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        <strong>ที่อยู่:</strong> {mapAddress}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">แผนกวิชาที่เปิดรับสมัคร</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ค่าตอบแทน / เบี้ยเลี้ยง (ถ้ามี)</label>
                <input 
                  type="text" 
                  placeholder="เช่น 300 บาท/วัน, ตามตกลง"
                  value={salary} 
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ช่องทางติดต่อกลับ *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="เช่น โทร 08X-XXX-XXXX หรือ Line ID: ..."
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="form-footer-action">
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn btn-primary btn-submit-job-action"
              style={{ padding: '14px 28px' }}
            >
              <Send size={16} />
              <span>{submitting ? 'กำลังบันทึกข้อมูล...' : 'ลงประกาศรับสมัครงานตอนนี้'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Map Picker Modal Popup */}
      {showMapModal && (
        <div className="sidebar-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', maxWidth: '1200px', width: '96%' }} className="modal-flex-layout">
            
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
                        setSelectedWorkplaceId('custom');
                        if (res.name) setCustomCompanyName(res.name);
                        if (res.display_name) setMapAddress(res.display_name);
                        if (res.phone) setContact(res.phone);
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
                    lat={mapLat} 
                    lng={mapLng} 
                    interactive={true} 
                    onLocationChange={handleLocationChange} 
                    height="480px" 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>พิกัด: {mapLat.toFixed(6)}, {mapLng.toFixed(6)}</span>
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

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 32px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
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

        .job-post-page-container {
          width: 100%;
          padding: 24px;
          text-align: left;
        }

        .register-header-nav {
          margin-bottom: 20px;
        }

        .register-form-card {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .form-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 28px 32px;
          border-bottom: 1.5px solid var(--border-color);
          background-color: #f8fafc;
        }

        .header-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-text h2 {
          font-size: 1.35rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
        }

        .header-text p {
          font-size: 0.85rem;
          color: var(--slate);
          margin: 4px 0 0 0;
        }

        .register-form {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .register-form select, .register-form input, .register-form textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          outline: none;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .register-form select {
          font-weight: 700;
          cursor: pointer;
        }

        .register-form input:focus, .register-form textarea:focus, .register-form select:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--slate);
          pointer-events: none;
        }

        .input-with-icon input {
          padding-left: 38px !important;
        }

        .textarea-with-icon {
          position: relative;
          display: flex;
          width: 100%;
        }

        .textarea-icon {
          position: absolute;
          left: 14px;
          top: 14px;
          color: var(--slate);
          pointer-events: none;
        }

        .textarea-with-icon textarea {
          padding-left: 38px !important;
        }

        .form-footer-action {
          display: flex;
          justify-content: flex-end;
          border-top: 1.5px solid var(--border-color);
          padding-top: 24px;
          margin-top: 10px;
        }

        .btn-submit-job-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}