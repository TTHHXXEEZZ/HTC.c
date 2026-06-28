import React, { useState } from 'react';
import { X, Star, Upload, Trash2, Camera } from 'lucide-react';
import { DEPARTMENTS } from '../services/departments';
import StarRating from './StarRating';

export default function AddReviewModal({ user, workplace, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [department, setDepartment] = useState(user?.department || DEPARTMENTS[0]);
  const [position, setPosition] = useState('');
  const [year, setYear] = useState(new Date().getFullYear() + 543 - 1); // Default to current Thai Buddhist year (e.g., 2568)
  const [allowance, setAllowance] = useState('');
  const [comments, setComments] = useState('');
  const [photos, setPhotos] = useState([]); // Array of base64 strings
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    const readPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Base64 string
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(base64Images => {
      setPhotos(prev => [...prev, ...base64Images]);
      setUploading(false);
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      alert('กรุณาให้ดาวระหว่าง 1 - 5 ดาว');
      return;
    }
    if (!comments.trim()) {
      alert('กรุณากรอกความคิดเห็นหรือรีวิวประสบการณ์');
      return;
    }

    const reviewData = {
      workplaceId: workplace.id,
      userName: user.name,
      userEmail: user.email,
      userPhoto: user.photoUrl,
      department,
      position,
      year: year.toString(),
      rating,
      comments,
      allowance: allowance ? parseFloat(allowance) : null,
      photos
    };

    onSubmit(reviewData);
  };

  // Generate Buddhist Years list for selection (last 5 years)
  const currentThaiYear = new Date().getFullYear() + 543;
  const yearsList = Array.from({ length: 6 }, (_, i) => currentThaiYear - i);

  return (
    <div className="modal-overlay">
      <div className="modal-content add-review-modal animate-scale-up">
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>เขียนรีวิวแชร์ประสบการณ์</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--slate)', fontWeight: '600' }}>
              ให้ดาวและคอมเมนต์เพื่อช่วยแนะแนวรุ่นน้อง
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="ปิด" style={{ alignSelf: 'flex-start' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-workplace-summary">
              <span className="summary-label">รีวิวให้กับ:</span>
              <strong className="summary-name">{workplace.name}</strong>
            </div>

            {/* Rating Star Selection */}
            <div className="form-group text-center">
              <label className="form-label text-center">คะแนนประเมินโดยรวม</label>
              <div className="star-selection-wrapper">
                <StarRating rating={rating} interactive={true} onChange={setRating} size={36} />
                <span className="rating-helper-text">
                  {rating === 5 && '🌟 ดีเยี่ยม (ประทับใจมากที่สุด)'}
                  {rating === 4 && '👍 ดีมาก (การเรียนรู้งานเป็นระบบ)'}
                  {rating === 3 && '👌 ปานกลาง (งานพอใช้ได้)'}
                  {rating === 2 && '⚠️ พอใช้ (ต้องปรับปรุงบางส่วน)'}
                  {rating === 1 && '❌ แย่ (ไม่แนะนำให้ฝึกงาน)'}
                </span>
              </div>
            </div>

            {/* Form row 1: Department & Year */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="dept-select">แผนกวิชาที่เรียน</label>
                <select 
                  id="dept-select"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="year-select">ปีการศึกษาที่ฝึกงาน</label>
                <select 
                  id="year-select"
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  required
                >
                  {yearsList.map(y => (
                    <option key={y} value={y}>ปีการศึกษา {y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form row 2: Position & Allowance */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="position-input">ตำแหน่งงานที่ฝึกฝน</label>
                <input 
                  id="position-input"
                  type="text" 
                  className="form-control" 
                  placeholder="เช่น Web Developer, ธุรการบัญชี, ช่างเทคนิค" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="allowance-input">เบี้ยเลี้ยง / ค่าตอบแทน (บาท/วัน)</label>
                <input 
                  id="allowance-input"
                  type="number" 
                  className="form-control" 
                  placeholder="เช่น 300 (เว้นว่างได้หากไม่มี)" 
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Review Comment */}
            <div className="form-group">
              <label className="form-label" htmlFor="comments-input">แชร์ประสบการณ์ฝึกงาน</label>
              <textarea 
                id="comments-input"
                className="form-control" 
                rows="4" 
                placeholder="เล่ารายละเอียด เช่น พี่เลี้ยงสอนงานดีไหม? สภาพแวดล้อม สวัสดิการ ทักษะที่ได้เรียนรู้ เพื่อเป็นแนวทางให้รุ่นน้อง..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Image attachment uploader */}
            <div className="form-group">
              <label className="form-label">แนบรูปถ่ายการทำงาน / บรรยากาศ (ถ้ามี)</label>
              <div className="photo-upload-container">
                <label className="photo-upload-dropzone">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="file-hidden-input"
                  />
                  <div className="dropzone-content">
                    <Upload size={20} className="upload-icon" />
                    <span>เลือกไฟล์รูปภาพที่เคยทำงาน</span>
                  </div>
                </label>

                {photos.length > 0 && (
                  <div className="uploaded-thumbnails-grid">
                    {photos.map((photo, index) => (
                      <div key={index} className="thumbnail-card">
                        <img src={photo} alt="Attached Work experience" />
                        <button 
                          type="button" 
                          onClick={() => removePhoto(index)} 
                          className="thumbnail-delete-btn"
                          title="ลบรูปภาพ"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
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
              บันทึกรีวิว
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-workplace-summary {
          background-color: var(--primary-light);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
          text-align: left;
          font-size: 0.9rem;
          border: 1px dashed var(--border-focus);
        }

        .summary-label {
          color: var(--slate);
          margin-right: 6px;
        }

        .summary-name {
          color: var(--primary-hover);
        }

        .star-selection-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .rating-helper-text {
          font-size: 0.85rem;
          color: var(--slate);
          font-weight: 600;
        }

        /* File Upload */
        .photo-upload-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .photo-upload-dropzone {
          border: 2.5px dashed var(--border-color);
          border-radius: var(--radius-sm);
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: var(--transition);
          background-color: var(--bg-main);
          display: block;
        }

        .photo-upload-dropzone:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .file-hidden-input {
          display: none;
        }

        .dropzone-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--slate);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .upload-icon {
          color: var(--primary);
        }

        .uploaded-thumbnails-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 4px;
        }

        .thumbnail-card {
          width: 68px;
          height: 68px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          position: relative;
          border: 1px solid var(--border-color);
        }

        .thumbnail-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-delete-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: rgba(239, 68, 68, 0.9);
          border: none;
          color: white;
          padding: 4px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .thumbnail-delete-btn:hover {
          background-color: var(--danger);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
