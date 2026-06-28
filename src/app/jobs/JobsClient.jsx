"use client";
import React, { useState, useMemo } from 'react';
import { Briefcase, Building2, MapPin, Phone, Calendar, Search, Plus, X, ArrowLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addInternshipJobAction, deleteInternshipJobAction } from '../actions';
import { DEPARTMENTS } from '../../services/departments';
import DepartmentBadge from '../../components/DepartmentBadge';

export default function JobsClient({ initialJobs = [], user }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ทั้งหมด');

  const handleDeleteJob = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) {
      try {
        await deleteInternshipJobAction(id);
        setJobs(jobs.filter(j => j.id !== id));
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการลบประกาศ');
      }
    }
  };

  const filteredJobs = useMemo(() => {
    let list = [...jobs];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(j => 
        j.title.toLowerCase().includes(term) ||
        j.companyName.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term)
      );
    }
    if (selectedDept !== 'ทั้งหมด') {
      list = list.filter(j => j.department === selectedDept);
    }
    return list;
  }, [jobs, searchTerm, selectedDept]);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="jobs-container animate-fade-in">
      <div className="jobs-header">
        <button onClick={() => router.push('/')} className="btn-back">
          <ArrowLeft size={16} />
          <span>กลับหน้าแรก</span>
        </button>

        <div className="header-flex">
          <div className="header-info">
            <h2>ประกาศรับสมัครเด็กฝึกงานจากสถานประกอบการ</h2>
            <p>ค้นหาและลงประกาศหานักศึกษาฝึกงานจากวิทยาลัยเทคนิคหาดใหญ่</p>
          </div>
          <button onClick={() => router.push('/jobs/post')} className="btn btn-primary btn-post-job">
            <Plus size={16} />
            <span>ลงประกาศหาเด็กฝึกงาน</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="jobs-filter-bar card">
        <div className="search-group">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อตำแหน่งงาน บริษัท..." 
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

      {/* Grid List */}
      <div className="jobs-list">
        {filteredJobs.map(job => (
          <div key={job.id} className="job-card card">
            <div className="job-card-header">
              <div className="job-meta">
                <span className="job-date">โพสต์เมื่อ: {formatDate(job.createdAt)}</span>
                <DepartmentBadge deptName={job.department} />
              </div>
              {user.email === '67219010003@htc.ac.th' && (
                <button 
                  onClick={() => handleDeleteJob(job.id)} 
                  className="btn-delete-job" 
                  title="ลบประกาศนี้"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="job-title-row">
              <div className="job-icon-box">
                <Briefcase size={22} />
              </div>
              <div className="job-title-info">
                <h3>{job.title}</h3>
                <h4>{job.companyName}</h4>
              </div>
            </div>

            <div className="job-content">
              <h5>รายละเอียดงาน:</h5>
              <p className="job-desc">{job.description}</p>

              <h5>คุณสมบัติ:</h5>
              <p className="job-requirements">{job.requirements}</p>

              {job.salary && (
                <div className="job-salary-box">
                  ค่าตอบแทน/เบี้ยเลี้ยง: <strong>{job.salary}</strong>
                </div>
              )}
            </div>

            <div className="job-footer">
              <div className="contact-box">
                <Phone size={14} />
                <span>ช่องทางติดต่อ: <strong>{job.contact}</strong></span>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="empty-jobs-state card">
            <Briefcase size={48} className="empty-icon" />
            <h3>ยังไม่มีประกาศรับสมัครฝึกงานในขณะนี้</h3>
            <p>สถานประกอบการสามารถคลิกปุ่มด้านขวาบนเพื่อประกาศรับสมัครนักศึกษาฝึกงานแผนกต่าง ๆ ได้ฟรี</p>
          </div>
        )}
      </div>



      <style>{`
        .jobs-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 10px;
          text-align: left;
        }

        .jobs-header {
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

        .btn-post-job {
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .jobs-filter-bar {
          padding: 16px;
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .jobs-filter-bar {
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

        /* Jobs Cards list */
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .job-card {
          padding: 24px;
          background-color: white;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          transition: var(--transition);
        }

        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }

        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .job-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .job-date {
          font-size: 0.72rem;
          color: var(--slate);
          font-weight: 600;
        }

        .btn-delete-job {
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

        .btn-delete-job:hover {
          background-color: #fef2f2;
          color: var(--danger);
        }

        .job-title-row {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 18px;
        }

        .job-icon-box {
          background-color: var(--primary-light);
          color: var(--primary);
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .job-title-info h3 {
          font-size: 1.1rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
        }

        .job-title-info h4 {
          font-size: 0.88rem;
          font-weight: 650;
          color: var(--slate);
          margin: 2px 0 0 0;
        }

        .job-content {
          border-top: 1px solid var(--border-color);
          padding-top: 14px;
          margin-bottom: 18px;
        }

        .job-content h5 {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }

        .job-desc, .job-requirements {
          font-size: 0.85rem;
          color: var(--slate);
          line-height: 1.5;
          margin: 0 0 14px 0;
          white-space: pre-line;
        }

        .job-salary-box {
          display: inline-block;
          font-size: 0.8rem;
          color: #059669;
          background-color: #ecfdf5;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 600;
        }

        .job-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 14px;
          font-size: 0.8rem;
          color: var(--slate);
        }

        .contact-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-box strong {
          color: var(--navy);
        }

        .empty-jobs-state {
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

        /* Sidebar form details override */
        .post-job-sidebar {
          max-width: 550px;
          text-align: left;
        }

        .post-job-sidebar .modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-job-sidebar input, .post-job-sidebar textarea, .post-job-sidebar select {
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

        .post-job-sidebar input:focus, .post-job-sidebar textarea:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .post-job-sidebar select {
          font-weight: 700;
        }



        .btn-submit-job {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
        }
      `}</style>
    </div>
  );
}
