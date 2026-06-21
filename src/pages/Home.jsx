import React, { useState, useMemo } from 'react';
import { Search, BookOpen, MessageSquare, Eye, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../services/api';

export default function Home({ workplaces = [], siteViews = 0, onSearch, onWorkplaceClick }) {
  const [tempSearch, setTempSearch] = useState('');
  const [tempDept, setTempDept] = useState('ทั้งหมด');

  // Stats calculation
  const stats = useMemo(() => {
    const totalWp = workplaces.length;
    const totalRev = workplaces.reduce((sum, w) => sum + (w.totalReviews || 0), 0);
    const avgRating = totalWp > 0 
      ? (workplaces.reduce((sum, w) => sum + (w.averageRating || 0), 0) / totalWp).toFixed(1)
      : '0.0';
    return { totalWp, totalRev, avgRating };
  }, [workplaces]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(tempSearch, tempDept);
  };

  const handleQuickDeptClick = (dept) => {
    onSearch('', dept);
  };

  // Duplicate workplaces list for the continuous seamless infinite marquee effect
  const marqueeWorkplaces = useMemo(() => {
    if (workplaces.length === 0) return [];
    // Repeat the list to ensure it spans across the viewport smoothly
    return [...workplaces, ...workplaces, ...workplaces];
  }, [workplaces]);

  return (
    <div className="home-portal-layout">
      {/* 1. JobsDB Style Blue Hero Banner */}
      <section className="portal-hero">
        <div className="portal-hero-overlay"></div>
        <div className="portal-hero-content animate-fade-in">
          <h1 className="portal-title">ค้นหาสถานประกอบการฝึกงานที่ดีที่สุด</h1>
          <p className="portal-subtitle">
            ฐานข้อมูลแนะแนวและรีวิวจากรุ่นพี่วิทยาลัยเทคนิคหาดใหญ่ (HTC) เพื่ออนาคตที่เป็นคุณ
          </p>

          {/* Unified Search Widget */}
          <form className="portal-search-widget" onSubmit={handleSearchSubmit}>
            <div className="widget-input-group keyword-input-group">
              <Search className="widget-icon" size={20} />
              <input 
                type="text" 
                placeholder="ชื่อบริษัท, ลักษณะงาน, ที่อยู่..." 
                value={tempSearch} 
                onChange={(e) => setTempSearch(e.target.value)}
              />
            </div>
            
            <div className="widget-input-group select-input-group">
              <select 
                value={tempDept} 
                onChange={(e) => setTempDept(e.target.value)}
              >
                <option value="ทั้งหมด">แผนกวิชาทั้งหมด</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="portal-search-btn">
              <Search size={18} />
              <span>ค้นหา</span>
            </button>
          </form>

          {/* Real-time counters */}
          <div className="portal-stats-row">
            <div className="portal-stat-pill">
              <Eye size={14} className="icon-red" />
              <span>ผู้เข้าชม <strong>{siteViews}</strong> ครั้ง</span>
            </div>
            <div className="portal-stat-pill">
              <BookOpen size={14} className="icon-blue" />
              <span>สถานประกอบการ <strong>{stats.totalWp}</strong> แห่ง</span>
            </div>
            <div className="portal-stat-pill">
              <MessageSquare size={14} className="icon-green" />
              <span>รีวิวจากรุ่นพี่ <strong>{stats.totalRev}</strong> รายการ</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Exploration */}
      <section className="portal-categories-section">
        <div className="portal-container">
          <div className="section-header-row">
            <h3>กรองด่วนตามแผนกวิชา</h3>
            <p>เลือกแผนกวิชาที่คุณสนใจเพื่อค้นหาทันที</p>
          </div>
          <div className="categories-pill-grid">
            {DEPARTMENTS.map(dept => (
              <button 
                key={dept} 
                className="category-pill-card"
                onClick={() => handleQuickDeptClick(dept)}
              >
                <span>{dept}</span>
                <ArrowRight size={14} className="arrow-icon" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Infinite Sliding Showcase (เลื่อนไปเรื่อยๆ) */}
      <section className="portal-marquee-section">
        <div className="portal-container">
          <div className="section-header-row text-center">
            <h3>สถานประกอบการแนะนำ</h3>
            <p>สไลด์แสดงสถานประกอบการยอดนิยมของนักศึกษาวิทยาลัยเทคนิคหาดใหญ่</p>
          </div>
        </div>

        {/* Seamless Marquee Container */}
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {marqueeWorkplaces.map((wp, index) => (
              <div 
                key={`${wp.id}-${index}`} 
                className="marquee-card"
                onClick={() => onWorkplaceClick(wp.id)}
              >
                <div className="marquee-image-wrapper">
                  <img src={wp.coverImage} alt={wp.name} />
                  <div className="marquee-dept-badge">{wp.department}</div>
                </div>
                <div className="marquee-card-body">
                  <h4>{wp.name}</h4>
                  <p className="marquee-card-cat">{wp.category}</p>
                  <div className="marquee-card-rating">
                    <span className="star-rating">⭐ {wp.averageRating.toFixed(1)}</span>
                    <span className="review-count">({wp.totalReviews} รีวิว)</span>
                  </div>
                  <div className="marquee-card-views">
                    <Eye size={12} />
                    <span>{wp.views} เข้าชม</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-portal-layout {
          width: 100%;
          min-height: 100vh;
          background-color: var(--bg-main);
          display: flex;
          flex-direction: column;
        }

        /* 1. Hero banner styling */
        .portal-hero {
          background: linear-gradient(135deg, var(--dark-blue) 0%, #1e40af 50%, var(--primary) 100%);
          position: relative;
          color: white;
          padding: 85px 24px 95px 24px;
          text-align: center;
          overflow: hidden;
        }

        .portal-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .portal-hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .portal-title {
          font-size: 2.6rem;
          font-weight: 850;
          letter-spacing: -1.2px;
          line-height: 1.2;
          margin-bottom: 14px;
          text-shadow: 0 4px 10px rgba(15, 23, 42, 0.2);
        }

        .portal-subtitle {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.88);
          margin-bottom: 40px;
          font-weight: 500;
        }

        /* Search Widget */
        .portal-search-widget {
          background-color: white;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.15), 0 10px 20px -8px rgba(15, 23, 42, 0.1);
          padding: 10px;
          display: flex;
          gap: 10px;
          max-width: 850px;
          margin: 0 auto 35px auto;
          align-items: center;
        }

        .widget-input-group {
          display: flex;
          align-items: center;
          flex: 1;
          height: 54px;
          background: #f8fafc;
          border-radius: var(--radius-md);
          border: 1.5px solid transparent;
          transition: var(--transition);
        }

        .widget-input-group:focus-within {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .keyword-input-group {
          padding-left: 18px;
        }

        .widget-icon {
          color: var(--slate);
          margin-right: 12px;
          flex-shrink: 0;
        }

        .keyword-input-group input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          color: var(--navy);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .select-input-group select {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          outline: none;
          color: var(--navy);
          font-weight: 700;
          padding: 0 16px;
          cursor: pointer;
          font-size: 0.95rem;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .portal-search-btn {
          height: 54px;
          padding: 0 32px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
          border-radius: var(--radius-md);
          border: none;
          color: white;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .portal-search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
        }

        .portal-stats-row {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .portal-stat-pill {
          background-color: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50px;
          padding: 8px 20px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 550;
        }

        .icon-red { color: #f87171; }
        .icon-blue { color: #38bdf8; }
        .icon-green { color: #4ade80; }

        /* 2. Categories */
        .portal-categories-section {
          padding: 55px 0;
          background-color: white;
          border-bottom: 1.5px solid var(--border-color);
        }

        .portal-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header-row {
          margin-bottom: 30px;
          text-align: left;
        }

        .section-header-row h3 {
          font-size: 1.45rem;
          font-weight: 850;
          color: var(--navy);
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .section-header-row p {
          font-size: 0.88rem;
          color: var(--slate);
          margin: 0;
        }

        .categories-pill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }

        .category-pill-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--navy);
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }

        .category-pill-card:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .category-pill-card .arrow-icon {
          opacity: 0;
          transform: translateX(-5px);
          transition: var(--transition);
          color: var(--primary);
        }

        .category-pill-card:hover .arrow-icon {
          opacity: 1;
          transform: translateX(0);
        }

        /* 3. Infinite Scrolling Marquee */
        .portal-marquee-section {
          padding: 60px 0;
          background-color: var(--bg-main);
          overflow: hidden;
          position: relative;
        }

        .text-center {
          text-align: center !important;
        }

        /* Continuous seamless scrolling keyframes */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-290px * 10 - 20px * 10)); } /* Width of marquee cards + margin */
        }

        .marquee-wrapper {
          width: 100%;
          padding: 20px 0;
          display: flex;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 20px;
          animation: marquee 35s linear infinite;
          width: max-content;
        }

        /* Pause marquee on hover so students can read cards */
        .marquee-track:hover {
          animation-play-state: paused;
        }

        .marquee-card {
          width: 290px;
          flex-shrink: 0;
          background-color: white;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          text-align: left;
        }

        .marquee-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-focus);
        }

        .marquee-image-wrapper {
          height: 140px;
          position: relative;
          background-color: #cbd5e1;
        }

        .marquee-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .marquee-dept-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: var(--primary);
          color: white;
          font-size: 0.72rem;
          font-weight: 750;
          padding: 4px 10px;
          border-radius: 50px;
          box-shadow: var(--shadow-sm);
        }

        .marquee-card-body {
          padding: 16px;
        }

        .marquee-card-body h4 {
          font-size: 0.92rem;
          font-weight: 850;
          color: var(--navy);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .marquee-card-cat {
          font-size: 0.76rem;
          color: var(--slate);
          font-weight: 600;
          margin-bottom: 12px;
        }

        .marquee-card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .marquee-card-rating .star-rating {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--navy);
        }

        .marquee-card-rating .review-count {
          font-size: 0.75rem;
          color: var(--slate);
        }

        .marquee-card-views {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--slate);
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
          margin-top: 8px;
        }

        @media (max-width: 900px) {
          .portal-title {
            font-size: 1.9rem;
          }

          .portal-search-widget {
            flex-direction: column;
            padding: 12px;
          }

          .widget-input-group {
            width: 100%;
          }

          .portal-search-btn {
            width: 100%;
            justify-content: center;
          }

          .categories-pill-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
