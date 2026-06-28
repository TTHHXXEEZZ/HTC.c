"use client";
import React, { useState } from 'react';
import { BookOpen, AlertCircle, ShieldCheck, User, X, Mail, Building2, Briefcase, Star } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChooser, setShowChooser] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Custom account input states
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  
  const router = useRouter();

  const mockAccounts = [
    {
      name: "สมศักดิ์ รักเรียน (นักศึกษา)",
      email: "somsak.r@htc.ac.th",
      type: "HTC Student",
      desc: "มีสิทธิ์เข้าถึงและเขียนรีวิวสถานประกอบการครบถ้วน",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "มุกดา รัตนพร (นักศึกษา)",
      email: "mookda.r@htc.ac.th",
      type: "HTC Student",
      desc: "มีสิทธิ์เข้าถึงและเขียนรีวิวสถานประกอบการครบถ้วน",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "บุคคลทั่วไป / สถานประกอบการ (ทั่วไป)",
      email: "guest.user@gmail.com",
      type: "External Guest",
      desc: "ไม่เห็นข้อมูลรีวิวหรือฟอร์มการให้ดาวสถานประกอบการ",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    }
  ];

  const handleSignIn = async (email, name) => {
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase(),
        name: name,
        redirect: false,
      });

      if (res?.error) {
        setError('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์อีเมล');
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) {
      setError('กรุณากรอกอีเมล Google Account');
      return;
    }
    setShowChooser(false);
    handleSignIn(customEmail, customName || customEmail.split('@')[0]);
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <BookOpen size={48} />
          </div>
          <h2 className="hero-title">Hatyai Technical College Insight</h2>
          <p className="hero-description">
            ยินดีต้อนรับสู่ระบบรวบรวมข้อมูล เปิดรับสถานประกอบการใหม่ ๆ ค้นหาที่ทำงานพาร์ทไทม์ และแบ่งปันรีวิวฝึกงานเพื่อช่วยแนะแนวรุ่นน้อง วิทยาลัยเทคนิคหาดใหญ่
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <Building2 size={20} className="feature-icon" style={{ color: '#60a5fa' }} />
              <span>เปิดรับลงทะเบียนสถานประกอบการแห่งใหม่ ๆ</span>
            </div>
            <div className="feature-item">
              <Briefcase size={20} className="feature-icon" style={{ color: '#34d399' }} />
              <span>ค้นหาที่ทำงานพาร์ทไทม์สำหรับนักศึกษาหาดใหญ่</span>
            </div>
            <div className="feature-item">
              <Star size={20} className="feature-icon" style={{ color: '#fbbf24' }} />
              <span>ให้ดาวและคอมเมนต์เพื่อช่วยแนะแนวรุ่นน้อง</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-portal">
        <div className="portal-card card animate-scale-up">
          <div className="portal-header">
            <h3>เข้าสู่ระบบด้วยบัญชี Google</h3>
            <p>กรุณาลงชื่อเข้าใช้งานด้วย Google Account ของคุณเพื่อใช้งานระบบ</p>
          </div>

          {error && (
            <div className="login-error-alert">
              <AlertCircle size={18} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <div className="login-action-container">
            <button 
              onClick={() => setShowChooser(true)} 
              className="btn btn-login-google-btn" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  กำลังประมวลผลการเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <svg className="google-icon-svg" viewBox="0 0 24 24" width="22" height="22">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.02h3.87c2.27-2.08 3.58-5.15 3.58-8.5z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.13C3.26 21.84 7.37 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.27c-.24-.72-.38-1.5-.38-2.27s.14-1.55.38-2.27V6.6H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.4l3.98-3.13z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.16 1.29 5.4l3.98 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>ลงชื่อเข้าใช้ด้วย Google (Simulated)</span>
                </>
              )}
            </button>
          </div>

          <div className="portal-footer">
            <span className="secure-badge">
              <ShieldCheck size={14} /> ระบบจำลองความปลอดภัยการเข้าสู่ระบบผ่าน Google OAuth
            </span>
          </div>
        </div>
      </div>

      {/* Simulated Google Account Chooser Modal */}
      {showChooser && (
        <div className="modal-overlay">
          <div className="modal-content account-chooser-modal animate-scale-up">
            <div className="google-chooser-header">
              <div className="google-logo-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.02h3.87c2.27-2.08 3.58-5.15 3.58-8.5z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.13C3.26 21.84 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.27c-.24-.72-.38-1.5-.38-2.27s.14-1.55.38-2.27V6.6H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.4l3.98-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.16 1.29 5.4l3.98 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </div>
              <h3>เลือกบัญชีเพื่อใช้ลงชื่อเข้าใช้</h3>
              <p>เพื่อนำเข้าสู่บริการ Hatyai Technical College Insight</p>
              <button className="chooser-close-btn" onClick={() => setShowChooser(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="google-chooser-body">
              {!showCustomInput ? (
                <>
                  <div className="account-list">
                    {mockAccounts.map((acc, index) => (
                      <button 
                        key={index} 
                        className="account-item-btn"
                        onClick={() => {
                          setShowChooser(false);
                          handleSignIn(acc.email, acc.name.split(" ")[0]);
                        }}
                      >
                        <img src={acc.photo} alt={acc.name} className="account-avatar" />
                        <div className="account-details">
                          <div className="account-title-row">
                            <span className="account-name">{acc.name}</span>
                            <span className={`domain-badge ${acc.email.endsWith('@htc.ac.th') ? 'htc' : 'external'}`}>
                              {acc.email.endsWith('@htc.ac.th') ? '@htc.ac.th (มีสิทธิ์รีวิว)' : 'ทั่วไป'}
                            </span>
                          </div>
                          <span className="account-email">{acc.email}</span>
                          <span className="account-desc">{acc.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="btn btn-outline btn-use-another" 
                    onClick={() => setShowCustomInput(true)}
                  >
                    <Mail size={16} />
                    <span>ใช้บัญชี Google อื่นๆ...</span>
                  </button>
                </>
              ) : (
                <form onSubmit={handleCustomSubmit} className="custom-account-form">
                  <div className="form-group">
                    <label className="form-label">ที่อยู่อีเมล Google Account (Gmail)</label>
                    <input 
                      type="email" 
                      placeholder="เช่น user.name@htc.ac.th หรือ someone@gmail.com" 
                      className="form-control"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      required
                    />
                    <span className="input-hint">หากลงท้ายด้วย @htc.ac.th จะได้สิทธิ์เข้าถึงฟอรัมรีวิวการฝึกงาน</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ชื่อแสดงตัวตน (ชื่อ-นามสกุล)</label>
                    <input 
                      type="text" 
                      placeholder="เช่น สมศรี ใจดี" 
                      className="form-control"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                  </div>

                  <div className="form-actions-flex">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowCustomInput(false)}
                    >
                      ย้อนกลับ
                    </button>
                    <button type="submit" className="btn btn-primary">
                      ลงชื่อเข้าใช้
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .login-page {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          background-color: var(--bg-main);
        }

        /* Hero Left Panel */
        .login-hero {
          flex: 1.2;
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: 60px;
          color: white;
        }

        @media (max-width: 900px) {
          .login-hero {
            display: none;
          }
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(37, 99, 235, 0.8) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 500px;
          text-align: left;
        }

        .hero-logo {
          background-color: rgba(255, 255, 255, 0.15);
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
          letter-spacing: -1px;
          line-height: 1.2;
        }

        .hero-description {
          font-size: 1.05rem;
          color: #bfdbfe;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .hero-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: #eff6ff;
        }

        .feature-icon {
          color: var(--secondary);
          flex-shrink: 0;
        }

        /* Portal Right Panel */
        .login-portal {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background-color: var(--bg-main);
          overflow-y: auto;
        }

        .portal-card {
          width: 100%;
          max-width: 440px;
          padding: 40px 32px;
          text-align: left;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .portal-header {
          margin-bottom: 28px;
        }

        .portal-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .portal-header p {
          font-size: 0.85rem;
          color: var(--slate);
        }

        .login-error-alert {
          background-color: rgba(239, 68, 68, 0.08);
          border: 1.5px solid rgba(239, 68, 68, 0.2);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          animation: pulse 0.3s ease-in-out;
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .login-action-container {
          margin: 30px 0;
        }

        .btn-login-google-btn {
          width: 100%;
          padding: 14px 20px;
          background-color: white;
          color: var(--navy);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .btn-login-google-btn:hover:not(:disabled) {
          border-color: #cbd5e1;
          background-color: #f8fafc;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        }

        .google-icon-svg {
          flex-shrink: 0;
        }

        .portal-footer {
          margin-top: 28px;
          border-top: 1px solid var(--border-color);
          padding-top: 18px;
          text-align: center;
        }

        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--slate);
        }

        /* Spinner for loading state */
        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(15, 23, 42, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Account Chooser Dialog Stylings */
        .account-chooser-modal {
          max-width: 480px;
          padding: 0;
          overflow: hidden;
        }

        .google-chooser-header {
          padding: 24px;
          text-align: center;
          position: relative;
          border-bottom: 1px solid var(--border-color);
        }

        .google-logo-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .google-chooser-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 4px;
        }

        .google-chooser-header p {
          font-size: 0.82rem;
          color: var(--slate);
        }

        .chooser-close-btn {
          position: absolute;
          right: 20px;
          top: 20px;
          background: transparent;
          border: none;
          color: var(--slate);
          cursor: pointer;
          border-radius: 50%;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .chooser-close-btn:hover {
          background-color: var(--bg-main);
          color: var(--navy);
        }

        .google-chooser-body {
          padding: 24px;
          background-color: white;
          max-height: 400px;
          overflow-y: auto;
        }

        .account-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .account-item-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 16px;
          background: white;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: var(--transition);
        }

        .account-item-btn:hover {
          background-color: #f8fafc;
          border-color: var(--primary);
        }

        .account-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--border-color);
        }

        .account-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .account-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .account-name {
          font-size: 0.9rem;
          font-weight: 750;
          color: var(--navy);
        }

        .domain-badge {
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 700;
        }

        .domain-badge.htc {
          background-color: #eff6ff;
          color: var(--primary);
          border: 1px solid #dbeafe;
        }

        .domain-badge.external {
          background-color: #f1f5f9;
          color: var(--slate);
          border: 1px solid var(--border-color);
        }

        .account-email {
          font-size: 0.78rem;
          color: var(--slate);
        }

        .account-desc {
          font-size: 0.72rem;
          color: var(--slate);
          margin-top: 4px;
          display: block;
          line-height: 1.3;
        }

        .btn-use-another {
          width: 100%;
          padding: 12px;
          font-size: 0.85rem;
          border-radius: var(--radius-md);
        }

        .custom-account-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-actions-flex {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
