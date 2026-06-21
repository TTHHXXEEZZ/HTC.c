import React, { useState, useMemo } from 'react';
import { Search, Plus, SlidersHorizontal, BookOpen, MessageSquare, Star, Eye } from 'lucide-react';
import { DEPARTMENTS } from '../services/api';
import WorkplaceCard from '../components/WorkplaceCard';

export default function Dashboard({ workplaces = [], siteViews = 0, onWorkplaceClick, onAddWorkplaceClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('rating'); // rating, reviews, name

  // Temporary inputs inside the JobsDB search hero
  const [tempSearch, setTempSearch] = useState('');
  const [tempDept, setTempDept] = useState('ทั้งหมด');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWp = workplaces.length;
    const totalRev = workplaces.reduce((sum, w) => sum + (w.totalReviews || 0), 0);
    const avgRating = totalWp > 0 
      ? (workplaces.reduce((sum, w) => sum + (w.averageRating || 0), 0) / totalWp).toFixed(1)
      : '0.0';
    return { totalWp, totalRev, avgRating };
  }, [workplaces]);

  // Filter and sort workplaces
  const filteredWorkplaces = useMemo(() => {
    let list = [...workplaces];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(w => 
        w.name.toLowerCase().includes(term) || 
        w.category.toLowerCase().includes(term) ||
        w.description.toLowerCase().includes(term) ||
        w.address.toLowerCase().includes(term)
      );
    }

    // Department filter
    if (selectedDept !== 'ทั้งหมด') {
      list = list.filter(w => w.department === selectedDept);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (sortBy === 'reviews') {
        return (b.totalReviews || 0) - (a.totalReviews || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'th');
      }
      return 0;
    });

    return list;
  }, [workplaces, searchTerm, selectedDept, sortBy]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchTerm(tempSearch);
    setSelectedDept(tempDept);
  };

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    setTempDept(dept);
  };

  return (
    <div className="jobsdb-dashboard-layout">
      {/* 1. Immersive Blue Hero Search Banner */}
      <section className="hero-banner">
        <div className="hero-banner-glow"></div>
        <div className="hero-banner-content">
          <h2 className="hero-title animate-fade-in">ค้นหาสถานประกอบการฝึกงานที่ดีที่สุด</h2>
          <p className="hero-subtitle animate-fade-in">ฐานข้อมูลแนะแนวและการรีวิวจากรุ่นพี่วิทยาลัยเทคนิคหาดใหญ่ (HTC)</p>
          
          {/* Search Card Widget */}
          <form className="search-card-widget animate-scale-up" onSubmit={handleSearchSubmit}>
            <div className="search-field keyword-field">
              <Search className="field-icon" size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อบริษัท, ลักษณะงาน, ที่ตั้ง..." 
                value={tempSearch} 
                onChange={(e) => setTempSearch(e.target.value)}
              />
            </div>
            
            <div className="search-field select-field">
              <select 
                value={tempDept} 
                onChange={(e) => setTempDept(e.target.value)}
              >
                <option value="ทั้งหมด">ทุกแผนกวิชา</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="hero-search-btn">
              <Search size={18} />
              <span>ค้นหา</span>
            </button>
          </form>

          {/* Quick Stats Pills */}
          <div className="hero-stats-row animate-fade-in">
            <div className="stat-pill-item">
              <Eye size={14} className="stat-pill-icon color-red" />
              <span>ผู้เข้ารับชมเว็บไซต์ <strong>{siteViews}</strong> ครั้ง</span>
            </div>
            <div className="stat-pill-item">
              <BookOpen size={14} className="stat-pill-icon color-blue" />
              <span>สถานประกอบการ <strong>{stats.totalWp}</strong> แห่ง</span>
            </div>
            <div className="stat-pill-item">
              <MessageSquare size={14} className="stat-pill-icon color-green" />
              <span>รีวิวของรุ่นพี่ <strong>{stats.totalRev}</strong> รายการ</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Category Pills */}
      <section className="quick-explore-section">
        <div className="section-container">
          <h4 className="quick-explore-title">กรองด่วนตามแผนกวิชา</h4>
          <div className="category-pills-container">
            <button 
              className={`cat-pill-btn ${selectedDept === 'ทั้งหมด' ? 'active' : ''}`}
              onClick={() => handleDeptSelect('ทั้งหมด')}
            >
              ทั้งหมด
            </button>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                className={`cat-pill-btn ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => handleDeptSelect(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Listings Section with Sidebar */}
      <section className="directory-listings-section">
        <div className="listings-container">
          
          {/* Main Listings Layout */}
          <div className="listings-grid-layout">
            {/* Sidebar Filters & Controls */}
            <aside className="directory-sidebar">
              <div className="sidebar-widget card">
                <h4 className="widget-header">เรียงลำดับ</h4>
                <div className="filter-item-wrapper">
                  <select 
                    className="sidebar-select-control"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">⭐ คะแนนรีวิวสูงสุด</option>
                    <option value="reviews">💬 รีวิวมากที่สุด</option>
                    <option value="name">🔤 ชื่อบริษัท (ก-ฮ)</option>
                  </select>
                </div>
              </div>

              <div className="sidebar-widget card register-widget-card">
                <h4 className="widget-header">ลงทะเบียนเพิ่ม</h4>
                <p className="widget-desc">
                  หากพบสถานประกอบการแห่งใหม่นอกเหนือจากนี้ สามารถช่วยลงข้อมูลเพิ่มเติมเพื่อประโยชน์แก่รุ่นน้องได้
                </p>
                <button 
                  className="btn btn-primary w-full btn-register-new"
                  onClick={onAddWorkplaceClick}
                >
                  <Plus size={16} />
                  <span>ลงทะเบียนที่ใหม่</span>
                </button>
              </div>

              {/* Detailed Overview */}
              <div className="sidebar-widget card stats-widget-card">
                <h4 className="widget-header">ภาพรวมข้อมูล</h4>
                <div className="overview-stats-grid">
                  <div className="overview-stat-row">
                    <span className="overview-stat-label">เรตติ้งเฉลี่ยสะสม</span>
                    <strong className="overview-stat-value">⭐ {stats.avgRating} / 5.0</strong>
                  </div>
                  <div className="overview-stat-row">
                    <span className="overview-stat-label">สาขาที่มีข้อมูลมากสุด</span>
                    <strong className="overview-stat-value">เทคโนโลยีสารสนเทศ</strong>
                  </div>
                </div>
              </div>
            </aside>

            {/* Workplace Grid Area */}
            <main className="directory-main-content">
              <div className="listings-result-header">
                <div className="result-headline-group">
                  <h3>สถานประกอบการแนะนำ</h3>
                  <p className="result-subtext">
                    {selectedDept !== 'ทั้งหมด' ? `แผนกวิชา${selectedDept} ` : ''} 
                    พบข้อมูลทั้งหมด <strong>{filteredWorkplaces.length}</strong> แห่ง
                  </p>
                </div>
              </div>

              {filteredWorkplaces.length > 0 ? (
                <div className="workplace-directory-grid">
                  {filteredWorkplaces.map(wp => (
                    <WorkplaceCard 
                      key={wp.id} 
                      workplace={wp} 
                      onClick={onWorkplaceClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-search-state card">
                  <SlidersHorizontal size={40} className="empty-state-icon" />
                  <h4>ไม่พบข้อมูลสถานประกอบการ</h4>
                  <p>ไม่พบรายการที่ตรงกับคำค้นหาของคุณ ลองเปลี่ยนคำค้นหาหรือตัวกรองวิชา</p>
                  <button className="btn btn-secondary mt-4" onClick={onAddWorkplaceClick}>
                    <Plus size={14} /> เพิ่มสถานประกอบการใหม่
                  </button>
                </div>
              )}
            </main>
          </div>

        </div>
      </section>

      <style>{`
        .jobsdb-dashboard-layout {
          width: 100%;
          min-height: 100vh;
          background-color: var(--bg-main);
          display: flex;
          flex-direction: column;
        }

        /* 1. Hero Search Section */
        .hero-banner {
          background: linear-gradient(135deg, var(--dark-blue) 0%, #1e40af 50%, var(--primary) 100%);
          position: relative;
          color: white;
          padding: 70px 24px 80px 24px;
          text-align: center;
          overflow: hidden;
        }

        .hero-banner-glow {
          position: absolute;
          top: -10%;
          left: 30%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(37, 99, 235, 0) 70%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 1;
        }

        .hero-banner-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 2.3rem;
          font-weight: 850;
          letter-spacing: -1px;
          margin-bottom: 12px;
          color: white;
          line-height: 1.25;
        }

        .hero-subtitle {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 35px;
          font-weight: 500;
        }

        /* Search Card Widget style like JobsDB */
        .search-card-widget {
          background-color: white;
          border-radius: var(--radius-lg);
          box-shadow: 0 15px 35px -5px rgba(15, 23, 42, 0.12), 0 8px 16px -6px rgba(15, 23, 42, 0.08);
          padding: 10px;
          display: flex;
          gap: 10px;
          max-width: 850px;
          margin: 0 auto 30px auto;
          align-items: center;
        }

        .search-field {
          display: flex;
          align-items: center;
          flex: 1;
          height: 52px;
          background: #f8fafc;
          border-radius: var(--radius-md);
          border: 1.5px solid transparent;
          transition: var(--transition);
        }

        .search-field:focus-within {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .keyword-field {
          padding-left: 18px;
        }

        .field-icon {
          color: var(--slate);
          margin-right: 12px;
          flex-shrink: 0;
        }

        .keyword-field input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          color: var(--navy);
          font-weight: 600;
          font-size: 0.92rem;
        }

        .keyword-field input::placeholder {
          color: var(--light-slate);
        }

        .select-field select {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          outline: none;
          color: var(--navy);
          font-weight: 700;
          padding: 0 16px;
          cursor: pointer;
          font-size: 0.92rem;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .hero-search-btn {
          height: 52px;
          padding: 0 28px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
          border-radius: var(--radius-md);
          border: none;
          color: white;
          font-weight: 750;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .hero-search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
        }

        /* Stats in Hero */
        .hero-stats-row {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stat-pill-item {
          background-color: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          padding: 6px 18px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 550;
        }

        .stat-pill-icon {
          flex-shrink: 0;
        }
        
        .color-red { color: #f87171; }
        .color-blue { color: #38bdf8; }
        .color-green { color: #4ade80; }

        /* 2. Quick Explore Section */
        .quick-explore-section {
          background: white;
          border-bottom: 1.5px solid var(--border-color);
          padding: 24px 0;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: left;
        }

        .quick-explore-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--slate);
          margin-bottom: 12px;
          font-weight: 800;
        }

        .category-pills-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cat-pill-btn {
          border: 1.5px solid var(--border-color);
          background-color: transparent;
          color: var(--slate);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 650;
          cursor: pointer;
          transition: var(--transition);
        }

        .cat-pill-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .cat-pill-btn.active {
          background-color: var(--primary);
          border-color: var(--primary);
          color: white;
          font-weight: 750;
          box-shadow: 0 4px 10px var(--primary-glow);
        }

        /* 3. Directory Listings Layout */
        .directory-listings-section {
          padding: 40px 0 60px 0;
          flex: 1;
        }

        .listings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .listings-grid-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Sidebar styles */
        .directory-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-widget {
          text-align: left;
        }

        .widget-header {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--navy);
          margin-bottom: 12px;
          font-weight: 800;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 8px;
        }

        .sidebar-select-control {
          width: 100%;
          padding: 10.5px 12px;
          border-radius: 8px;
          border: 1.5px solid var(--border-color);
          background-color: #f8fafc;
          font-size: 0.85rem;
          font-weight: 700;
          outline: none;
          color: var(--navy);
          cursor: pointer;
          transition: var(--transition);
        }

        .sidebar-select-control:focus {
          border-color: var(--primary);
          background-color: white;
        }

        .register-widget-card {
          background: linear-gradient(135deg, var(--primary-light) 0%, rgba(37, 99, 235, 0.02) 100%);
          border: 1.5px dashed var(--border-focus);
        }

        .widget-desc {
          font-size: 0.78rem;
          color: var(--slate);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .btn-register-new {
          width: 100%;
          border-radius: 8px;
          padding: 11px;
          font-size: 0.85rem;
        }

        .overview-stats-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .overview-stat-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .overview-stat-label {
          font-size: 0.72rem;
          color: var(--slate);
          font-weight: 600;
        }

        .overview-stat-value {
          font-size: 0.85rem;
          color: var(--navy);
          font-weight: 800;
        }

        /* Main Grid Area */
        .directory-main-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .listings-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 14px;
        }

        .result-headline-group h3 {
          font-size: 1.25rem;
          font-weight: 850;
          color: var(--navy);
          margin: 0;
          letter-spacing: -0.5px;
        }

        .result-subtext {
          font-size: 0.82rem;
          color: var(--slate);
          margin-top: 4px;
        }

        .result-subtext strong {
          color: var(--primary);
          font-weight: 750;
        }

        .workplace-directory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 24px;
        }

        .empty-search-state {
          padding: 60px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .empty-state-icon {
          color: var(--light-slate);
        }

        .empty-search-state h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
        }

        .empty-search-state p {
          font-size: 0.85rem;
          color: var(--slate);
          margin: 0;
        }

        .mt-4 { margin-top: 16px; }
        .w-full { width: 100%; }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .listings-grid-layout {
            grid-template-columns: 1fr;
          }

          .directory-sidebar {
            order: 2; /* Move filters below grid on small screens or keep them organized */
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .search-card-widget {
            flex-direction: column;
            padding: 12px;
          }

          .search-field {
            width: 100%;
          }

          .hero-search-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

