import React, { useState } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import { DEPARTMENTS } from '../services/departments';
import MapLoader from './MapLoader';

const WORKPLACE_CATEGORIES = [
  'เทคโนโลยีและซอฟต์แวร์',
  'การเงินและการธนาคาร',
  'ยานยนต์และการซ่อมบำรุง',
  'โรงแรมและการท่องเที่ยว',
  'พลังงานและสาธารณูปโภค',
  'คลังสินค้าและโลจิสติกส์',
  'อสังหาริมทรัพย์และก่อสร้าง',
  'การผลิตและอุตสาหกรรม',
  'อาหารและเครื่องดื่ม',
  'สื่อและการโฆษณา',
  'อื่น ๆ'
];

export default function AddWorkplaceModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(WORKPLACE_CATEGORIES[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  
  // Coordinates default to Hat Yai (HTC area)
  const [lat, setLat] = useState(7.0084);
  const [lng, setLng] = useState(100.4975);
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result); // Base64 representation
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLocationChange = (coords) => {
    setLat(coords.lat);
    setLng(coords.lng);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('กรุณากรอกชื่อสถานประกอบการ');
      return;
    }
    if (!address.trim()) {
      alert('กรุณากรอกที่อยู่สถานประกอบการ');
      return;
    }

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

    onSubmit(workplaceData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content add-workplace-modal animate-scale-up">
        <div className="modal-header">
          <h3>เพิ่มสถานประกอบการใหม่</h3>
          <button onClick={onClose} className="modal-close-btn" title="ปิด">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Form row 1: Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="wp-name">ชื่อสถานประกอบการ / บริษัท</label>
              <input 
                id="wp-name"
                type="text" 
                className="form-control" 
                placeholder="เช่น บริษัท ดิจิทัล โซลูชั่น จำกัด" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Form row 2: Category & Department */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="wp-category">ประเภทธุรกิจ</label>
                <select 
                  id="wp-category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {WORKPLACE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wp-dept">รองรับแผนกวิชาหลัก</label>
                <select 
                  id="wp-dept"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form row 3: Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="wp-desc">คำแนะนำ / รายละเอียดเบื้องต้น</label>
              <textarea 
                id="wp-desc"
                className="form-control" 
                rows="3" 
                placeholder="อธิบายว่าบริษัททำเกี่ยวกับอะไรและรับนักศึกษาไปทำงานในลักษณะใดบ้าง..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Form row 4: Contact & Website */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="wp-web">เว็บไซต์ (ถ้ามี)</label>
                <input 
                  id="wp-web"
                  type="url" 
                  className="form-control" 
                  placeholder="https://example.com" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wp-phone">เบอร์โทรศัพท์ติดต่อ (ถ้ามี)</label>
                <input 
                  id="wp-phone"
                  type="text" 
                  className="form-control" 
                  placeholder="เช่น 074-XXXXXX" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="wp-address">ที่อยู่โดยละเอียด</label>
              <input 
                id="wp-address"
                type="text" 
                className="form-control" 
                placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Interactive Map Picker */}
            <div className="form-group">
              <label className="form-label">ปักหมุดพิกัดแผนที่ (Google Maps / OpenStreetMap)</label>
              <div className="map-picker-container">
                <MapLoader 
                  lat={lat} 
                  lng={lng} 
                  interactive={true} 
                  onLocationChange={handleLocationChange}
                  height="260px"
                />
                <div className="coordinates-preview">
                  <MapPin size={14} className="map-pin-accent" />
                  <span>พิกัดปัจจุบัน: Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {/* Cover image uploader */}
            <div className="form-group">
              <label className="form-label">รูปภาพหน้าปกสถานประกอบการ (ถ้ามี)</label>
              <div className="wp-image-uploader">
                <label className="image-uploader-label">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="file-hidden-input"
                  />
                  <div className="uploader-content">
                    <Upload size={18} />
                    <span>อัปโหลดรูปภาพหน้าปกบริษัท</span>
                  </div>
                </label>

                {coverImage && (
                  <div className="cover-preview-card">
                    <img src={coverImage} alt="Cover Preview" />
                    <button 
                      type="button" 
                      onClick={() => setCoverImage('')} 
                      className="preview-remove-btn"
                      title="ลบรูปภาพ"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              บันทึกสถานประกอบการ
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .add-workplace-modal {
          max-width: 680px;
        }

        .map-picker-container {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--bg-main);
        }

        .coordinates-preview {
          padding: 8px 14px;
          font-size: 0.8rem;
          color: var(--slate);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          border-top: 1px solid var(--border-color);
        }

        .map-pin-accent {
          color: var(--primary);
        }

        /* Image Uploader */
        .wp-image-uploader {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .image-uploader-label {
          flex: 1;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px;
          text-align: center;
          cursor: pointer;
          background-color: var(--bg-main);
          transition: var(--transition);
          display: block;
        }

        .image-uploader-label:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .uploader-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--slate);
          font-weight: 600;
        }

        .cover-preview-card {
          position: relative;
          width: 80px;
          height: 52px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .cover-preview-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-remove-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: rgba(239, 68, 68, 0.9);
          border: none;
          color: white;
          padding: 3px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
export { WORKPLACE_CATEGORIES };
