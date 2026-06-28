"use client";
import React, { useState } from 'react';
import { ArrowLeft, Send, User, Award, Upload, Link as LinkIcon, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addStudentProfileAction } from '../../actions';
import { DEPARTMENTS } from '../../../services/departments';

export default function InternsPostClient({ initialProfile, user }) {
  const router = useRouter();
  
  // State initialized with existing profile values if they exist
  const [name, setName] = useState(initialProfile?.name || user?.name || '');
  const [department, setDepartment] = useState(initialProfile?.department || DEPARTMENTS[0]);
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolioUrl || '');
  const [contact, setContact] = useState(initialProfile?.contact || user?.email || '');
  const [skills, setSkills] = useState(initialProfile?.skills || '');
  const [gpa, setGpa] = useState(initialProfile?.bio || initialProfile?.gpa || '');
  const [certificateImage, setCertificateImage] = useState(initialProfile?.certificateImage || '');
  
  const [uploadingCert, setUploadingCert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCert(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertificateImage(reader.result);
      setUploadingCert(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim()) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    setSubmitting(true);
    try {
      await addStudentProfileAction({
        name: name.trim(),
        email: user?.email,
        department,
        portfolioUrl: portfolioUrl.trim(),
        contact: contact.trim(),
        skills: skills.trim(),
        bio: gpa.trim(),
        certificateImage: certificateImage
      });
      router.push('/interns');
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการบันทึกโปรไฟล์');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="intern-post-page-container animate-fade-in">
      <div className="register-header-nav">
        <button onClick={() => router.push('/interns')} className="btn-back">
          <ArrowLeft size={16} />
          <span>ย้อนกลับไปหน้าฝากประวัติ</span>
        </button>
      </div>

      <div className="register-form-card card">
        <div className="form-card-header">
          <div className="header-icon-box">
            <User size={24} />
          </div>
          <div className="header-text">
            <h2>{initialProfile ? 'แก้ไขข้อมูลพอร์ตโฟลิโอ & ประวัติ' : 'ลงทะเบียนฝากโปรไฟล์พอร์ตโฟลิโอ'}</h2>
            <p>กรอกข้อมูลแนะนำตัวและลิงก์ผลงานของคุณเพื่อเปิดโอกาสให้สถานประกอบการติดต่อร่วมงาน</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            
            {/* Left Column: Student Details */}
            <div className="form-inputs-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">ชื่อ - นามสกุลจริง *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="เช่น สมชาย ใจดี"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">แผนกวิชาของฉัน</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">เกรดเฉลี่ยสะสม (GPA)</label>
                <input 
                  type="text" 
                  placeholder="เช่น 3.50"
                  value={gpa} 
                  onChange={(e) => setGpa(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ทักษะความสามารถ (คั่นด้วยจุลภาค ,)</label>
                <input 
                  type="text" 
                  placeholder="เช่น เดินสายไฟ, เขียนแบบ CAD, ซ่อมเครื่องยนต์"
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ข้อมูลการติดต่อกลับ *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="เช่น เบอร์โทร 08X-XXX-XXXX, อีเมล หรือ Line ID"
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Portfolio & Certificates */}
            <div className="form-media-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">ลิงก์พอร์ตโฟลิโอ (Canva, Google Drive, etc.)</label>
                <div className="input-with-icon">
                  <LinkIcon size={16} className="input-icon" />
                  <input 
                    type="url" 
                    placeholder="เช่น https://www.canva.com/design/..."
                    value={portfolioUrl} 
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">อัปโหลดรูปภาพเกียรติบัตร / รางวัลผลงาน</label>
                <div className="cert-upload-wrapper">
                  {certificateImage ? (
                    <div className="uploaded-cert-preview">
                      <img src={certificateImage} alt="Certificate Preview" />
                      <button 
                        type="button" 
                        onClick={() => setCertificateImage('')} 
                        className="btn-remove-preview"
                      >
                        นำรูปออก
                      </button>
                    </div>
                  ) : (
                    <label className="cert-upload-dropzone">
                      <Upload size={32} style={{ color: 'var(--primary)' }} />
                      <span>{uploadingCert ? 'กำลังอัปโหลด...' : 'คลิกเพื่อเลือกภาพเกียรติบัตรผลงาน'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCertificateUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  )}
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
              <span>{submitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกประวัติพอร์ตโฟลิโอ'}</span>
            </button>
          </div>
        </form>
      </div>

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
        }

        .intern-post-page-container {
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

        .cert-upload-wrapper {
          margin-top: 8px;
        }

        .cert-upload-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 36px;
          background-color: #f8fafc;
          cursor: pointer;
          color: var(--slate);
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .cert-upload-dropzone:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .uploaded-cert-preview {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1.5px solid var(--border-color);
          max-height: 250px;
          width: fit-content;
        }

        .uploaded-cert-preview img {
          max-height: 250px;
          object-fit: contain;
          display: block;
        }

        .btn-remove-preview {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--danger);
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-remove-preview:hover {
          background-color: #b91c1c;
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
      `}</style>
    </div>
  );
}