import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Hatyai Technical College Insight. สงวนลิขสิทธิ์ วิทยาลัยเทคนิคหาดใหญ่ (HTC)
        </p>
        <p className="footer-tagline">
          ระบบตัวกลางรวบรวมและแบ่งปันประสบการณ์ฝึกงานของนักศึกษาทุกแผนกวิชา
        </p>
      </div>

      <style>{`
        .site-footer {
          background-color: var(--navy);
          color: #94a3b8;
          padding: 24px 20px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .footer-copyright {
          font-weight: 500;
          color: #f8fafc;
        }

        .footer-tagline {
          color: #64748b;
          font-size: 0.8rem;
        }
      `}</style>
    </footer>
  );
}
