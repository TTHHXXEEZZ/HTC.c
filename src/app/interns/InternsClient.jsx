"use client";
import React, { useState, useMemo } from 'react';
import { User, Mail, Link as LinkIcon, BookOpen, Search, Plus, X, ArrowLeft, Send, Trash2, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addStudentProfileAction, deleteStudentProfileAction } from '../actions';
import { DEPARTMENTS } from '../../services/departments';
import DepartmentBadge from '../../components/DepartmentBadge';

export default function InternsClient({ initialProfiles = [], sessionUser }) {
  const router = useRouter();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ทั้งหมด');

  const handleDeleteProfile = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์ฝากงานนี้?')) {
      try {
        await deleteStudentProfileAction(id);
        setProfiles(profiles.filter(p => p.id !== id));
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการลบโปรไฟล์');
      }
    }
  };

  const filteredProfiles = useMemo(() => {
    let list = [...profiles];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.skills.toLowerCase().includes(term) ||
        p.bio.toLowerCase().includes(term)
      );
    }
    if (selectedDept !== 'ทั้งหมด') {
      list = list.filter(p => p.department === selectedDept);
    }
    return list;
  }, [profiles, searchTerm, selectedDept]);

  const userExistingProfile = useMemo(() => {
    return profiles.find(p => p.email === sessionUser?.email);
  }, [profiles, sessionUser]);

  // Load existing profile details into form when opening modal
  const handleOpenAddForm = () => {
    router.push('/interns/post');
  };

  return (
    <div className="interns-container animate-fade-in">
      <div className="interns-header">
        <button onClick={() => router.push('/')} className="btn-back">
          <ArrowLeft size={16} />
          <span>กลับหน้าแรก</span>
        </button>

        <div className="header-flex">
          <div className="header-info">
            <h2>ทำเนียบและพอร์ตโฟลิโอฝากงานของนักศึกษา</h2>
            <p>รายชื่อนักศึกษาที่เปิดรับการติดต่อเพื่อเข้าฝึกงานกับสถานประกอบการต่าง ๆ</p>
          </div>
          <button onClick={handleOpenAddForm} className="btn btn-primary btn-post-profile">
            <Plus size={16} />
            <span>{userExistingProfile ? 'แก้ไขพอร์ต/โปรไฟล์' : 'ฝากโปรไฟล์ & พอร์ตโฟลิโอ'}</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="interns-filter-bar card">
        <div className="search-group">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อนักศึกษา, ทักษะการทำงาน..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="dept-select-group">
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="ทั้งหมด">แผนกวิชาทั้งหมด</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="interns-grid">
        {filteredProfiles.map(profile => (
          <div key={profile.id} className="intern-card card">
            <div className="intern-card-header">
              <div className="user-icon-circle">
                <User size={24} />
              </div>
              <div className="intern-badge-row">
                <DepartmentBadge deptName={profile.department} />
              </div>
              {(sessionUser.email === profile.email || sessionUser.email === '67219010003@htc.ac.th') && (
                <button 
                  onClick={() => handleDeleteProfile(profile.id)} 
                  className="btn-delete-profile"
                  title="ลบโปรไฟล์นี้"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="intern-body">
              <h3>{profile.name}</h3>
              <p className="intern-bio">{profile.bio || 'ยังไม่มีคำอธิบายสั้น ๆ'}</p>

              <div className="skills-section">
                <span className="skills-title">
                  <Award size={13} />
                  ทักษะ / ความสามารถ:
                </span>
                <p className="skills-text">{profile.skills}</p>
              </div>
              
              {profile.certificateImage && (
                <div className="cert-card-preview" style={{ marginTop: '12px' }}>
                  <span className="skills-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--slate)', fontWeight: 700, marginBottom: '6px' }}>
                    <Award size={13} style={{ color: 'var(--secondary)' }} />
                    ใบประกาศ / เกียรติบัตร:
                  </span>
                  <a href={profile.certificateImage} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid var(--border-color)', height: '90px' }}>
                    <img 
                      src={profile.certificateImage} 
                      alt="Certificate" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </a>
                </div>
              )}
            </div>

            <div className="intern-footer">
              <div className="contact-info-list">
                <div className="contact-item">
                  <Mail size={13} />
                  <span>{profile.contact}</span>
                </div>
                {profile.portfolioUrl && (
                  <div className="contact-item portfolio">
                    <LinkIcon size={13} />
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                      ดูพอร์ตโฟลิโอออนไลน์
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="empty-intern-state card">
            <User size={48} className="empty-icon" />
            <h3>ไม่พบข้อมูลฝากโปรไฟล์นักศึกษา</h3>
            <p>นักศึกษาสามารถคลิกปุ่ม "ฝากโปรไฟล์ & พอร์ตโฟลิโอ" ด้านบนเพื่อแชร์ทักษะและไฟล์พอร์ตโฟลิโอให้บริษัทเห็นได้</p>
          </div>
        )}
      </div>



      <style>{`
        .interns-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 10px;
          text-align: left;
        }

        .interns-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-info h2 {
          font-size: 1.45rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
        }

        .header-info p {
          font-size: 0.88rem;
          color: var(--slate);
          margin: 4px 0 0 0;
        }

        .btn-post-profile {
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .interns-filter-bar {
          padding: 16px;
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .interns-filter-bar {
            flex-direction: column;
          }
        }

        .search-group {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--slate);
        }

        .search-group input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          font-size: 0.85rem;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 500;
          transition: var(--transition);
        }

        .search-group input:focus {
          border-color: var(--primary);
          background-color: white;
        }

        .dept-select-group select {
          padding: 10px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 700;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }

        /* Profile Grid */
        .interns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .intern-card {
          padding: 24px;
          background-color: white;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
          transition: var(--transition);
        }

        .intern-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }

        .intern-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .user-icon-circle {
          background-color: var(--primary-light);
          color: var(--primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-delete-profile {
          background: transparent;
          border: none;
          color: var(--slate);
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: var(--transition);
        }

        .btn-delete-profile:hover {
          background-color: #fef2f2;
          color: var(--danger);
        }

        .intern-body h3 {
          font-size: 1.05rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0 0 6px 0;
        }

        .intern-bio {
          font-size: 0.82rem;
          color: var(--slate);
          line-height: 1.5;
          margin: 0 0 14px 0;
        }

        .skills-section {
          background-color: var(--bg-main);
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .skills-title {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .skills-text {
          font-size: 0.8rem;
          color: var(--slate);
          line-height: 1.4;
          margin: 0;
        }

        .intern-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
        }

        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--slate);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .portfolio-link {
          color: var(--primary);
          font-weight: 750;
        }

        .portfolio-link:hover {
          text-decoration: underline;
        }

        .empty-intern-state {
          grid-column: 1 / -1;
          padding: 60px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--slate);
        }

        .empty-icon {
          color: var(--light-slate);
        }

        /* Sidebar Forms styles */
        .post-profile-sidebar {
          max-width: 550px;
        }

        .post-profile-sidebar .modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-profile-sidebar input, .post-profile-sidebar textarea, .post-profile-sidebar select {
          width: 100%;
          padding: 10.5px 12px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          font-size: 0.85rem;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .post-profile-sidebar input:focus, .post-profile-sidebar textarea:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .post-profile-sidebar select {
          font-weight: 700;
        }



        .btn-submit-profile {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
        }
      `}</style>
    </div>
  );
}
