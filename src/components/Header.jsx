"use client";
import React from 'react';
import { LogOut, BookOpen, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Left Side: Branding (aligned far-left) */}
        <Link href="/" className="header-brand">
          <div className="brand-logo">
            <BookOpen size={20} className="brand-icon" />
          </div>
          <div className="brand-text">
            <h1>HTC Workplace Connect</h1>
            <span className="brand-subtitle">
              <span className="subtitle-dot"></span> ฐานข้อมูลสถานประกอบการและการฝึกงาน
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        {user && (
          <nav className="header-nav">
            <Link 
              href="/" 
              className={`nav-link-btn ${pathname === '/' ? 'active' : ''}`}
            >
              หน้าแรก
            </Link>
            <Link 
              href="/dashboard" 
              className={`nav-link-btn ${pathname === '/dashboard' ? 'active' : ''}`}
            >
              แดชบอร์ด
            </Link>
          </nav>
        )}

        {/* Right Side: Logged-in User Profile (aligned far-right) */}
        {user && (
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            
            <div className="avatar-wrapper">
              {user.image ? (
                <img src={user.image} alt={user.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  <User size={16} />
                </div>
              )}
              <span className="avatar-pulse-ring"></span>
            </div>

            <button onClick={handleLogout} className="btn-logout" title="ออกจากระบบ">
              <LogOut size={15} />
              <span className="logout-text">ออกจากระบบ</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .site-header {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1.5px solid rgba(226, 232, 240, 0.8);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          z-index: 1000;
          box-shadow: 0 4px 20px -5px rgba(15, 23, 42, 0.02);
        }
        
        .header-container {
          width: 100%;
          max-width: 100%;
          padding: 0 32px;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
          transition: var(--transition);
        }

        .header-brand:hover {
          opacity: 0.85;
        }

        .brand-logo {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          position: relative;
        }

        .brand-icon {
          stroke-width: 2.5px;
        }

        .brand-text {
          text-align: left;
        }

        .brand-text h1 {
          font-size: 1.25rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--navy) 40%, var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--slate);
          font-weight: 600;
          letter-spacing: 0.1px;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .subtitle-dot {
          width: 6px;
          height: 6px;
          background-color: var(--success);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px var(--success);
          animation: blink 2s infinite ease-in-out;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .header-nav {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: var(--slate);
          font-weight: 750;
          font-size: 0.88rem;
          padding: 8px 18px;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition);
        }

        .nav-link-btn:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .nav-link-btn.active {
          color: var(--primary);
          background-color: var(--primary-light);
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: var(--primary-light);
          padding: 4px 6px 4px 14px;
          border-radius: 50px;
          border: 1px solid rgba(37, 99, 235, 0.08);
          box-shadow: inset 0 1px 2px rgba(37, 99, 235, 0.02);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        @media (max-width: 768px) {
          .user-info {
            display: none;
          }
          .header-container {
            padding: 0 16px;
          }
        }

        .user-name {
          font-size: 0.8rem;
          font-weight: 750;
          color: var(--navy);
          line-height: 1.2;
        }

        .user-email {
          font-size: 0.65rem;
          color: var(--slate);
        }

        .avatar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
          z-index: 2;
        }

        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #cbd5e1;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          z-index: 2;
        }

        .avatar-pulse-ring {
          content: '';
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: rgba(37, 99, 235, 0.15);
          animation: avatarPulse 2s infinite ease-out;
          z-index: 1;
        }

        @keyframes avatarPulse {
          0% { transform: scale(0.85); opacity: 1; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid var(--border-color);
          color: var(--slate);
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.78rem;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .btn-logout:hover {
          background-color: #fff1f2;
          color: var(--danger);
          border-color: #fecdd3;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.05);
        }

        @media (max-width: 500px) {
          .logout-text {
            display: none;
          }
          .btn-logout {
            padding: 6px;
            border-radius: 50%;
          }
          .brand-text h1 {
            font-size: 1.05rem;
          }
          .brand-subtitle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
