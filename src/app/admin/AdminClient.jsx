"use client";
import React, { useState, useMemo } from 'react';
import { 
  Building2, MessageSquare, Trash2, ArrowLeft, ShieldCheck, Eye, Star, CheckCircle, 
  XCircle, UserPlus, Users, Activity, FileCheck, HelpCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  deleteWorkplaceAction, deleteReviewAction, approveWorkplaceAction, 
  approveReviewAction, addAdminEmailAction, deleteAdminEmailAction 
} from '../actions';

export default function AdminClient({ 
  workplaces = [], 
  reviews = [], 
  adminEmails = [], 
  currentUserEmail 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('approvals'); // approvals, workplaces, reviews, admins
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [submittingAdmin, setSubmittingAdmin] = useState(false);

  // Divide workplaces and reviews into pending vs approved lists
  const pendingWorkplaces = useMemo(() => workplaces.filter(w => !w.approved), [workplaces]);
  const approvedWorkplaces = useMemo(() => workplaces.filter(w => w.approved), [workplaces]);
  
  const pendingReviews = useMemo(() => reviews.filter(r => !r.approved), [reviews]);
  const approvedReviews = useMemo(() => reviews.filter(r => r.approved), [reviews]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      pendingWorkplacesCount: pendingWorkplaces.length,
      pendingReviewsCount: pendingReviews.length,
      totalPending: pendingWorkplaces.length + pendingReviews.length,
      approvedWorkplacesCount: approvedWorkplaces.length,
      approvedReviewsCount: approvedReviews.length,
      totalAdmins: adminEmails.length + 1 // Add the super admin 67219010003@htc.ac.th
    };
  }, [pendingWorkplaces, pendingReviews, approvedWorkplaces, approvedReviews, adminEmails]);

  // Workplace approval actions
  const handleApproveWorkplace = async (id) => {
    try {
      await approveWorkplaceAction(id);
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleDeleteWorkplace = async (id, name) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ / ปฏิเสธ "${name}"? ข้อมูลทั้งหมดจะถูกลบถาวร!`)) {
      try {
        await deleteWorkplaceAction(id);
        router.refresh();
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  // Review approval actions
  const handleApproveReview = async (id) => {
    try {
      await approveReviewAction(id);
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการอนุมัติรีวิว');
    }
  };

  const handleDeleteReview = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?')) {
      try {
        await deleteReviewAction(id);
        router.refresh();
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการลบรีวิว');
      }
    }
  };

  // Admin emails management
  const handleAddAdminEmail = async (e) => {
    e.preventDefault();
    const email = newAdminEmail.trim();
    if (!email) return;

    if (!email.endsWith('@htc.ac.th')) {
      alert('แอดมินจะต้องใช้อีเมลของวิทยาลัย (@htc.ac.th) เท่านั้น');
      return;
    }

    setSubmittingAdmin(true);
    try {
      await addAdminEmailAction(email);
      setNewAdminEmail('');
      router.refresh();
    } catch (e) {
      alert('อีเมลนี้ได้รับการลงทะเบียนหรือเกิดข้อผิดพลาด');
    } finally {
      setSubmittingAdmin(false);
    }
  };

  const handleDeleteAdminEmail = async (id, email) => {
    if (currentUserEmail === email) {
      alert('คุณไม่สามารถลบสิทธิ์ของตัวเองได้');
      return;
    }
    if (confirm(`คุณต้องการถอนสิทธิ์แอดมินของ "${email}" ใช่หรือไม่?`)) {
      try {
        await deleteAdminEmailAction(id);
        router.refresh();
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการลบสิทธิ์แอดมิน');
      }
    }
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Header section */}
      <div className="dashboard-header card">
        <div className="header-top-row">
          <button onClick={() => router.push('/')} className="btn-back-home">
            <ArrowLeft size={16} />
            <span>กลับสู่หน้าแรก</span>
          </button>
          <span className="role-badge">🔒 SUPER USER / ADMINISTRATOR</span>
        </div>
        
        <div className="header-main-row">
          <div className="brand-section">
            <div className="shield-icon-wrapper">
              <ShieldCheck size={30} />
            </div>
            <div className="brand-info">
              <h2>แผงควบคุมผู้ดูแลระบบ (Admin Console)</h2>
              <p>ยินดีต้อนรับแอดมิน: <strong className="email-highlight">{currentUserEmail}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Statistics widgets */}
      <div className="stats-dashboard-grid">
        <div className="stat-widget card widget-pending">
          <div className="widget-icon">
            <Activity size={24} />
          </div>
          <div className="widget-info">
            <span className="widget-label">รายการรออนุมัติ</span>
            <h3>{stats.totalPending} รายการ</h3>
            <span className="widget-sub">แบ่งเป็น ร้านค้า {stats.pendingWorkplacesCount} | รีวิว {stats.pendingReviewsCount}</span>
          </div>
        </div>

        <div className="stat-widget card widget-approved">
          <div className="widget-icon">
            <FileCheck size={24} />
          </div>
          <div className="widget-info">
            <span className="widget-label">สถานประกอบการทั้งหมด</span>
            <h3>{stats.approvedWorkplacesCount} แห่ง</h3>
            <span className="widget-sub">ได้รับการอนุมัติและเปิดให้บริการแล้ว</span>
          </div>
        </div>

        <div className="stat-widget card widget-reviews">
          <div className="widget-icon">
            <MessageSquare size={24} />
          </div>
          <div className="widget-info">
            <span className="widget-label">รีวิวที่เปิดเผย</span>
            <h3>{stats.approvedReviewsCount} รีวิว</h3>
            <span className="widget-sub">ผ่านการตรวจสอบความถูกต้องแล้ว</span>
          </div>
        </div>

        <div className="stat-widget card widget-admins">
          <div className="widget-icon">
            <Users size={24} />
          </div>
          <div className="widget-info">
            <span className="widget-label">จำนวนผู้ดูแลระบบ</span>
            <h3>{stats.totalAdmins} คน</h3>
            <span className="widget-sub">ได้รับอนุญาตให้ใช้แผงควบคุมนี้</span>
          </div>
        </div>
      </div>

      {/* Nav Tab Controls */}
      <div className="dashboard-tabs-row">
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`tab-btn-pill ${activeTab === 'approvals' ? 'active' : ''}`}
        >
          <Activity size={15} />
          <span>รออนุมัติ ({stats.totalPending})</span>
          {stats.totalPending > 0 && <span className="notification-badge">{stats.totalPending}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('workplaces')}
          className={`tab-btn-pill ${activeTab === 'workplaces' ? 'active' : ''}`}
        >
          <Building2 size={15} />
          <span>สถานประกอบการ ({approvedWorkplaces.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`tab-btn-pill ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          <MessageSquare size={15} />
          <span>รีวิว ({approvedReviews.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('admins')}
          className={`tab-btn-pill ${activeTab === 'admins' ? 'active' : ''}`}
        >
          <Users size={15} />
          <span>จัดการอีเมลแอดมิน ({stats.totalAdmins})</span>
        </button>
      </div>

      {/* Tab Panels Contents */}
      <div className="tab-panel-container card">
        
        {/* TAB 1: Pending Approvals workflow */}
        {activeTab === 'approvals' && (
          <div className="approval-panel">
            <div className="panel-title-block">
              <h3>รายการรอยืนยันตรวจสอบความถูกต้อง</h3>
              <p>ข้อมูลที่จะเปิดเผยสู่ชุมชนวิทยาลัยเทคนิคหาดใหญ่จำเป็นต้องผ่านการอนุมัติก่อนเสมอ</p>
            </div>

            {/* Pending Workplaces Table */}
            <div className="approval-sub-section">
              <h4 className="approval-section-title">🏢 สถานประกอบการรออนุมัติ ({pendingWorkplaces.length})</h4>
              {pendingWorkplaces.length > 0 ? (
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>ชื่อสถานประกอบการ</th>
                        <th>ที่อยู่</th>
                        <th>แผนกที่แนะนำ</th>
                        <th style={{ textAlign: 'center' }}>การควบคุม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingWorkplaces.map(wp => (
                        <tr key={wp.id}>
                          <td>
                            <div className="table-title-cell">
                              <strong>{wp.name}</strong>
                              <span className="category-tag-sub">{wp.category}</span>
                            </div>
                          </td>
                          <td>{wp.address}</td>
                          <td>{wp.department}</td>
                          <td>
                            <div className="approval-actions-cell">
                              <button 
                                onClick={() => handleApproveWorkplace(wp.id)}
                                className="btn-action-round approve" 
                                title="อนุมัติเผยแพร่"
                              >
                                <CheckCircle size={16} />
                                <span>อนุมัติ</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteWorkplace(wp.id, wp.name)}
                                className="btn-action-round reject"
                                title="ปฏิเสธและลบ"
                              >
                                <Trash2 size={15} />
                                <span>ลบ</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-panel-state">
                  <CheckCircle size={32} className="icon-green" />
                  <p>ไม่มีสถานประกอบการค้างอนุมัติในระบบ</p>
                </div>
              )}
            </div>

            {/* Pending Reviews List */}
            <div className="approval-sub-section" style={{ marginTop: '40px' }}>
              <h4 className="approval-section-title">💬 ความคิดเห็นและรีวิวรออนุมัติ ({pendingReviews.length})</h4>
              {pendingReviews.length > 0 ? (
                <div className="pending-reviews-list">
                  {pendingReviews.map(rev => (
                    <div key={rev.id} className="pending-review-card">
                      <div className="review-header">
                        <div className="reviewer-meta">
                          <strong>{rev.reviewerName}</strong>
                          <span>({rev.reviewerDept})</span>
                          <span className="target-badge">บริษัท: {rev.workplace?.name}</span>
                        </div>
                        <span className="stars">⭐ {rev.rating}/5 คะแนน</span>
                      </div>
                      <p className="comment-text">"{rev.content}"</p>
                      <div className="review-footer">
                        <div className="approval-actions-cell" style={{ marginLeft: 'auto' }}>
                          <button 
                            onClick={() => handleApproveReview(rev.id)}
                            className="btn-action-round approve"
                          >
                            <CheckCircle size={15} />
                            <span>อนุมัติ</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            className="btn-action-round reject"
                          >
                            <Trash2 size={14} />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-panel-state">
                  <CheckCircle size={32} className="icon-green" />
                  <p>ไม่มีความคิดเห็นหรือรีวิวค้างอนุมัติในระบบ</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Workplaces List */}
        {activeTab === 'workplaces' && (
          <div className="workplaces-panel">
            <div className="panel-title-block">
              <h3>รายชื่อสถานประกอบการที่เปิดบริการแล้ว</h3>
              <p>สามารถดูหน้าเพจรีวิว หรือลบสถานประกอบการที่ปิดกิจการแล้วออกได้</p>
            </div>
            
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>สถานประกอบการ</th>
                    <th>แผนกวิชา</th>
                    <th>ยอดผู้ชม</th>
                    <th>จำนวนรีวิว</th>
                    <th style={{ textAlign: 'center' }}>การควบคุม</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedWorkplaces.map(wp => (
                    <tr key={wp.id}>
                      <td>
                        <div className="table-title-cell">
                          <strong>{wp.name}</strong>
                          <span>{wp.address}</span>
                        </div>
                      </td>
                      <td>{wp.department}</td>
                      <td>{wp.views} วิว</td>
                      <td>{wp.reviews?.length || 0} รีวิว</td>
                      <td>
                        <div className="approval-actions-cell justify-center">
                          <button 
                            onClick={() => router.push(`/workplace/${wp.id}`)}
                            className="btn-action-round approve"
                            title="ดูเพจรีวิว"
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteWorkplace(wp.id, wp.name)}
                            className="btn-action-round reject"
                            title="ลบสถานประกอบการ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Reviews List */}
        {activeTab === 'reviews' && (
          <div className="reviews-panel">
            <div className="panel-title-block">
              <h3>รีวิวของนักศึกษาทั้งหมดในระบบ</h3>
              <p>ลบความคิดเห็นที่มีเจตนาทำให้เสียหาย หรือมีถ้อยคำหยาบคาย</p>
            </div>

            <div className="pending-reviews-list">
              {approvedReviews.map(rev => (
                <div key={rev.id} className="pending-review-card">
                  <div className="review-header">
                    <div className="reviewer-meta">
                      <strong>{rev.reviewerName}</strong>
                      <span>({rev.reviewerDept})</span>
                      <span className="target-badge">รีวิวที่: {rev.workplace?.name}</span>
                    </div>
                    <span className="stars">⭐ {rev.rating}/5 คะแนน</span>
                  </div>
                  <p className="comment-text">"{rev.content}"</p>
                  <div className="review-footer">
                    <div className="vote-counts">
                      <span>👍 เห็นด้วย: {rev.agreeCount || 0} | 👎 ไม่เห็นด้วย: {rev.disagreeCount || 0}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteReview(rev.id)}
                      className="btn-action-round reject"
                      style={{ marginLeft: 'auto' }}
                    >
                      <Trash2 size={13} />
                      <span>ลบรีวิว</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Admin list settings */}
        {activeTab === 'admins' && (
          <div className="admins-panel">
            <div className="panel-title-block">
              <h3>ระบบบริหารสิทธิ์ผู้ดูแลระบบ (Admin Email Control)</h3>
              <p>แอดมินหลักสามารถเพิ่มรายชื่ออีเมลอื่นๆ ให้อำนาจจัดการเข้ามาตรวจสอบอนุมัติรายการได้</p>
            </div>

            <div className="admins-split-grid">
              {/* Form Add Admin */}
              <div className="admins-form-box">
                <h4>➕ เพิ่มสิทธิ์แอดมินใหม่</h4>
                <form onSubmit={handleAddAdminEmail} className="add-admin-form">
                  <div className="form-group-flex">
                    <input 
                      type="email" 
                      placeholder="เช่น student_id@htc.ac.th"
                      value={newAdminEmail} 
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      required 
                    />
                    <button type="submit" disabled={submittingAdmin} className="btn btn-primary">
                      <UserPlus size={15} />
                      <span>{submittingAdmin ? 'กำลังบันทึก...' : 'เพิ่มแอดมิน'}</span>
                    </button>
                  </div>
                  <p className="form-helper-text">อีเมลแอดมินเสริมจะต้องสะกดด้วยโดเมน `@htc.ac.th` เท่านั้น</p>
                </form>
              </div>

              {/* Table Admins list */}
              <div className="admins-list-box">
                <h4>👥 รายชื่อผู้ได้รับอนุญาตเข้าใช้ระบบแอดมิน</h4>
                <div className="admin-emails-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>ที่อยู่อีเมลแอดมิน</th>
                        <th>ประเภทสิทธิ์</th>
                        <th style={{ textAlign: 'center' }}>การควบคุม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Super Admin */}
                      <tr>
                        <td><strong>67219010003@htc.ac.th</strong></td>
                        <td><span className="role-tag super">แอดมินหลัก (Super Admin)</span></td>
                        <td><span className="system-locked-label">ระบบล็อคไว้</span></td>
                      </tr>
                      {/* Database Admins */}
                      {adminEmails.map(admin => (
                        <tr key={admin.id}>
                          <td>{admin.email}</td>
                          <td><span className="role-tag">ผู้ช่วยแอดมิน (Admin Assist)</span></td>
                          <td>
                            <div className="approval-actions-cell justify-center">
                              <button 
                                onClick={() => handleDeleteAdminEmail(admin.id, admin.email)}
                                className="btn-action-round reject"
                                title="ถอนสิทธิ์แอดมิน"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .admin-dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 12px;
          text-align: left;
        }

        .dashboard-header {
          padding: 24px 30px;
          margin-bottom: 24px;
          border-left: 6px solid var(--navy);
        }

        .header-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .btn-back-home {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--slate);
          cursor: pointer;
          font-weight: 750;
          font-size: 0.85rem;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .btn-back-home:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .role-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--danger);
          background-color: #fef2f2;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .shield-icon-wrapper {
          background-color: var(--navy);
          color: white;
          width: 58px;
          height: 58px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.12);
        }

        .brand-info h2 {
          font-size: 1.45rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
          letter-spacing: -0.5px;
        }

        .brand-info p {
          font-size: 0.88rem;
          color: var(--slate);
          margin: 4px 0 0 0;
        }

        .email-highlight {
          color: var(--primary);
        }

        /* Widgets Grid */
        .stats-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        @media (max-width: 900px) {
          .stats-dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .stats-dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-widget {
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          border: none;
        }

        .stat-widget .widget-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .widget-pending .widget-icon {
          background-color: #fef3c7;
          color: #d97706;
        }

        .widget-approved .widget-icon {
          background-color: #d1fae5;
          color: #059669;
        }

        .widget-reviews .widget-icon {
          background-color: #e0f2fe;
          color: #0284c7;
        }

        .widget-admins .widget-icon {
          background-color: #f3e8ff;
          color: #7c3aed;
        }

        .widget-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .widget-label {
          font-size: 0.72rem;
          font-weight: 750;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .widget-info h3 {
          font-size: 1.3rem;
          font-weight: 850;
          color: var(--navy);
          margin: 4px 0;
        }

        .widget-sub {
          font-size: 0.7rem;
          color: var(--slate);
          font-weight: 600;
        }

        /* Tab Pill Bar styling */
        .dashboard-tabs-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 6px;
          scrollbar-width: thin;
        }

        .tab-btn-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid var(--border-color);
          background: white;
          color: var(--slate);
          font-weight: 750;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }

        .tab-btn-pill:hover {
          background-color: var(--bg-main);
          color: var(--navy);
        }

        .tab-btn-pill.active {
          background-color: var(--navy);
          color: white;
          border-color: var(--navy);
        }

        .notification-badge {
          background-color: var(--danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 750;
          padding: 1px 6px;
          border-radius: 50px;
          margin-left: 2px;
        }

        /* Tab panel */
        .tab-panel-container {
          padding: 36px;
          background: white;
          border: none;
        }

        .panel-title-block {
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 18px;
          margin-bottom: 28px;
        }

        .panel-title-block h3 {
          font-size: 1.25rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
        }

        .panel-title-block p {
          font-size: 0.85rem;
          color: var(--slate);
          margin: 4px 0 0 0;
        }

        /* Sub table styles */
        .approval-section-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 16px;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .dashboard-table th {
          font-weight: 800;
          color: var(--navy);
          padding: 14px;
          border-bottom: 2px solid var(--border-color);
          text-align: left;
        }

        .dashboard-table td {
          padding: 14px;
          border-bottom: 1px solid var(--border-color);
          color: var(--slate);
        }

        .table-title-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-start;
        }

        .table-title-cell strong {
          color: var(--navy);
          font-size: 0.9rem;
        }

        .category-tag-sub {
          background-color: var(--bg-main);
          color: var(--navy);
          font-size: 0.65rem;
          font-weight: 750;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Action buttons in cells */
        .approval-actions-cell {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .justify-center {
          justify-content: center;
        }

        .btn-action-round {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 750;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid var(--border-color);
          background: white;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-action-round.approve {
          color: var(--success);
          border-color: rgba(16, 185, 129, 0.25);
        }

        .btn-action-round.approve:hover {
          background-color: #ecfdf5;
          border-color: var(--success);
        }

        .btn-action-round.reject {
          color: var(--danger);
          border-color: rgba(239, 68, 68, 0.25);
        }

        .btn-action-round.reject:hover {
          background-color: #fef2f2;
          border-color: var(--danger);
        }

        .empty-panel-state {
          padding: 30px;
          text-align: center;
          background-color: var(--bg-main);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--slate);
          font-size: 0.82rem;
          font-weight: 600;
        }

        .icon-green {
          color: var(--success);
        }

        /* Pending review items cards */
        .pending-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pending-review-card {
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          background-color: white;
        }

        .pending-review-card:hover {
          border-color: var(--border-focus);
        }

        .pending-review-card .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .reviewer-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .reviewer-meta strong {
          color: var(--navy);
          font-size: 0.9rem;
        }

        .reviewer-meta span {
          font-size: 0.76rem;
          color: var(--slate);
        }

        .target-badge {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 800;
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .pending-review-card .stars {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--navy);
        }

        .comment-text {
          font-size: 0.85rem;
          color: var(--slate);
          line-height: 1.5;
          margin: 0 0 14px 0;
          white-space: pre-line;
          background-color: var(--bg-main);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
        }

        .review-footer {
          display: flex;
          align-items: center;
          font-size: 0.76rem;
          color: var(--slate);
        }

        .vote-counts {
          font-weight: 600;
        }

        /* Admin Management tab columns */
        .admins-split-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 40px;
        }

        @media (max-width: 800px) {
          .admins-split-grid {
            grid-template-columns: 1fr;
          }
        }

        .admins-form-box h4, .admins-list-box h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }

        .form-group-flex {
          display: flex;
          gap: 10px;
        }

        .form-group-flex input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 500;
          font-size: 0.85rem;
        }

        .form-group-flex input:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .form-group-flex button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 20px;
        }

        .form-helper-text {
          font-size: 0.72rem;
          color: var(--slate);
          margin-top: 6px;
          font-weight: 550;
        }

        .role-tag {
          font-size: 0.7rem;
          font-weight: 750;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .role-tag.super {
          color: var(--success);
          background-color: #ecfdf5;
        }

        .system-locked-label {
          font-size: 0.74rem;
          color: var(--slate);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
