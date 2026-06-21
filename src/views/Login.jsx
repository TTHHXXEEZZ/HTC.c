import React, { useState } from 'react';
import { BookOpen, AlertCircle, ShieldCheck } from 'lucide-react';
import { loginSimulated } from '../services/auth';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('กรุณากรอกอีเมลวิทยาลัย');
      return;
    }

    if (!email.toLowerCase().endsWith('@htc.ac.th')) {
      setError('กรุณาใช้อีเมลวิทยาลัยที่ลงท้ายด้วย @htc.ac.th เท่านั้น');
      return;
    }

    setLoading(true);
    try {
      const user = await loginSimulated(email, name);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <BookOpen size={48} />
          </div>
          <h2 className="hero-title">HTC Workplace Connect</h2>
          <p className="hero-description">
            ยินดีต้อนรับสู่ศูนย์กลางการรวบรวมข้อมูลสถานประกอบการและรีวิวการฝึกงานของนักศึกษาวิทยาลัยเทคนิคหาดใหญ่
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <ShieldCheck size={20} className="feature-icon" />
              <span>แบ่งปันประสบการณ์ตรงจากรุ่นพี่ทุกแผนกวิชา</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} className="feature-icon" />
              <span>ค้นหาพิกัดแผนที่สถานประกอบการชั้นนำ</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} className="feature-icon" />
              <span>ให้ดาวและคอมเมนต์เพื่อช่วยแนะแนวรุ่นน้อง</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-portal">
        <div className="portal-card card animate-scale-up">
          <div className="portal-header">
            <h3>เข้าสู่ระบบด้วยบัญชี HTC</h3>
            <p>เพื่อดูฐานข้อมูลสถานประกอบการและร่วมแสดงความคิดเห็น</p>
          </div>

          {error && (
            <div className="login-error-alert">
              <AlertCircle size={18} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                อีเมล Google วิทยาลัย (@htc.ac.th)
              </label>
              <input
                id="email-input"
                type="email"
                className="form-control"
                placeholder="ชื่อนักศึกษา@htc.ac.th"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <span className="input-hint">ตัวอย่าง: somsak.r@htc.ac.th</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name-input">
                ชื่อ-นามสกุล (ภาษาไทย)
              </label>
              <input
                id="name-input"
                type="text"
                className="form-control"
                placeholder="สมศักดิ์ รักเรียน"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-login-submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  กำลังตรวจสอบบัญชี...
                </>
              ) : (
                <>
                  <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#ffffff" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.465 0-6.285-2.82-6.285-6.285 0-3.465 2.82-6.285 6.285-6.285 1.5 0 2.871.527 3.96 1.404l3.107-3.107C18.9 1.776 15.784 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.132 10.867-11.24 0-.568-.068-1.218-.18-1.755H12.24z"/>
                  </svg>
                  Sign in with Google Account
                </>
              )}
            </button>
          </form>

          <div className="portal-footer">
            <span className="secure-badge">
              <ShieldCheck size={14} /> ระบบเข้าสู่ระบบจำลองที่มีความปลอดภัยสูง
            </span>
          </div>
        </div>
      </div>

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

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-hint {
          display: block;
          font-size: 0.75rem;
          color: var(--slate);
          margin-top: 6px;
        }

        .btn-login-submit {
          width: 100%;
          padding: 14px;
          background-color: var(--primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }

        .btn-login-submit:hover {
          background-color: var(--primary-hover);
        }

        .google-icon {
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
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
