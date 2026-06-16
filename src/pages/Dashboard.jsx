import React, { useState, useMemo } from 'react';
import { Search, Plus, SlidersHorizontal, BookOpen, MessageSquare, Star, X, Filter, Eye } from 'lucide-react';
import { DEPARTMENTS } from '../services/api';
import WorkplaceCard from '../components/WorkplaceCard';

export default function Dashboard({ workplaces = [], siteViews = 0, onWorkplaceClick, onAddWorkplaceClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('rating'); // rating, reviews, name
  
  // Mobile Filter Drawer Toggle
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  return (
    <div className="dashboard-layout-wireframe">
      {/* Mobile Filter Drawer Overlay */}
      {isFilterOpen && (
        <div className="filter-overlay-mobile" onClick={() => setIsFilterOpen(false)}></div>
      )}

      {/* Left Sidebar (Floating Rounded Panel) */}
      <aside className={`filter-sidebar-box ${isFilterOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header-mobile">
          <h4>ตัวกรองข้อมูล</h4>
          <button className="btn-close-filter" onClick={() => setIsFilterOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* 1. Search Bar */}
        <div className="sidebar-section">
          <label className="sidebar-section-title">ค้นหาสถานประกอบการ</label>
          <div className="sidebar-search-box">
            <Search size={16} className="sidebar-search-icon" />
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="พิมพ์ชื่อบริษัท ลักษณะงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Sorting */}
        <div className="sidebar-section">
          <label className="sidebar-section-title">เรียงลำดับข้อมูล</label>
          <select 
            className="sidebar-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">⭐ คะแนนรีวิวสูงสุด</option>
            <option value="reviews">💬 รีวิวมากที่สุด</option>
            <option value="name">🔤 ชื่อบริษัท (ก-ฮ)</option>
          </select>
        </div>

        {/* 3. Department Filters */}
        <div className="sidebar-section dept-section">
          <label className="sidebar-section-title">กรองตามแผนกวิชา</label>
          <div className="sidebar-dept-list">
            <button 
              className={`sidebar-dept-item ${selectedDept === 'ทั้งหมด' ? 'active' : ''}`}
              onClick={() => { setSelectedDept('ทั้งหมด'); setIsFilterOpen(false); }}
            >
              ทั้งหมด
            </button>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                className={`sidebar-dept-item ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => { setSelectedDept(dept); setIsFilterOpen(false); }}
                title={dept}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Statistics Panel inside Sidebar (With Website view count) */}
        <div className="sidebar-section stats-section">
          <label className="sidebar-section-title">ภาพรวมข้อมูล</label>
          <div className="sidebar-stats-card">
            <div className="sidebar-stat-item">
              <div className="stat-circle blue">
                <BookOpen size={13} />
              </div>
              <span className="stat-label-text">สถานที่ทั้งหมด</span>
              <strong className="stat-value-text">{stats.totalWp}</strong>
            </div>
            <div className="sidebar-stat-item">
              <div className="stat-circle green">
                <MessageSquare size={13} />
              </div>
              <span className="stat-label-text">รีวิวของรุ่นพี่</span>
              <strong className="stat-value-text">{stats.totalRev}</strong>
            </div>
            <div className="sidebar-stat-item">
              <div className="stat-circle yellow">
                <Star size={13} />
              </div>
              <span className="stat-label-text">คะแนนเฉลี่ย</span>
              <strong className="stat-value-text">{stats.avgRating}</strong>
            </div>
            <div className="sidebar-stat-item">
              <div className="stat-circle red">
                <Eye size={13} />
              </div>
              <span className="stat-label-text">ผู้เข้าชมเว็บไซต์</span>
              <strong className="stat-value-text">{siteViews}</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Grid Content (Floating Rounded Panel) */}
      <main className="dashboard-content-box">
        <div className="content-header-row animate-fade-in">
          <div className="header-text-block">
            <h2>รายชื่อสถานประกอบการแนะแนว</h2>
            <p className="header-text-subtitle">
              พบข้อมูลสถานประกอบการทั้งหมด <span className="subtitle-count-badge">{filteredWorkplaces.length}</span> แห่ง
            </p>
          </div>
          
          <div className="header-action-row">
            <button className="btn btn-outline btn-mobile-filter" onClick={() => setIsFilterOpen(true)}>
              <Filter size={16} />
              <span>ตัวกรอง</span>
            </button>
            <button className="btn btn-primary btn-add-workplace" onClick={onAddWorkplaceClick}>
              <Plus size={16} />
              <span>ลงทะเบียนที่ใหม่</span>
            </button>
          </div>
        </div>

        {filteredWorkplaces.length > 0 ? (
          <div className="wireframe-cards-grid animate-fade-in">
            {filteredWorkplaces.map(wp => (
              <WorkplaceCard 
                key={wp.id} 
                workplace={wp} 
                onClick={onWorkplaceClick} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state card animate-scale-up">
            <SlidersHorizontal size={44} className="empty-icon" />
            <h3>ไม่พบข้อมูลสถานประกอบการ</h3>
            <p>กรุณาลองพิมพ์ชื่อคำค้นหาใหม่อีกครั้ง หรือช่วยเพิ่มรายละเอียดของสถานที่ฝึกงานใหม่เข้าระบบ</p>
            <button className="btn btn-secondary" onClick={onAddWorkplaceClick}>
              <Plus size={14} /> เพิ่มสถานประกอบการใหม่
            </button>
          </div>
        )}
      </main>

      <style>{`
        .dashboard-layout-wireframe {
          display: flex;
          width: 100%;
          height: calc(100vh - 72px);
          position: relative;
          background-color: #f1f5f9;
          overflow: hidden;
        }

        /* Floating Sidebar under header */
        .filter-sidebar-box {
          width: 290px;
          border-right: 1.5px solid var(--border-color) !important;
          background-color: white;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 26px;
          flex-shrink: 0;
          
          /* Floating Panel Effect */
          margin: 24px 12px 24px 24px;
          border-radius: var(--radius-lg);
          border: none !important;
          height: calc(100vh - 72px - 48px);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .sidebar-header-mobile {
          display: none;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 8px;
        }

        .sidebar-header-mobile h4 {
          font-weight: 850;
          color: var(--navy);
          font-size: 1.1rem;
        }

        .btn-close-filter {
          background: #f1f5f9;
          border: none;
          color: var(--slate);
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .btn-close-filter:hover {
          background-color: #e2e8f0;
          color: var(--navy);
        }

        .sidebar-section {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .sidebar-section-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--navy);
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
          opacity: 0.85;
        }

        /* Search input box */
        .sidebar-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sidebar-search-icon {
          position: absolute;
          left: 12px;
          color: var(--slate);
          pointer-events: none;
          transition: var(--transition);
        }

        .sidebar-search-input {
          width: 100%;
          padding: 10.5px 12px 10.5px 36px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          font-size: 0.85rem;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .sidebar-search-input:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        .sidebar-search-input:focus + .sidebar-search-icon {
          color: var(--primary);
        }

        .sidebar-select {
          width: 100%;
          padding: 11px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-main);
          color: var(--navy);
          font-weight: 700;
          outline: none;
          cursor: pointer;
          font-size: 0.82rem;
          transition: var(--transition);
        }

        .sidebar-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3.5px var(--primary-glow);
        }

        /* Department scroll list */
        .sidebar-dept-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 6px;
          scrollbar-width: thin;
        }

        .sidebar-dept-item {
          width: 100%;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background-color: transparent;
          color: var(--slate);
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .sidebar-dept-item::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #cbd5e1;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .sidebar-dept-item:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          padding-left: 16px;
        }

        .sidebar-dept-item:hover::before {
          background-color: var(--primary);
        }

        .sidebar-dept-item.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 800;
          padding-left: 16px;
        }

        .sidebar-dept-item.active::before {
          background-color: var(--primary);
          transform: scale(1.3);
        }

        /* Polished Stats card */
        .sidebar-stats-card {
          background-color: var(--primary-light);
          border: 1px dashed var(--border-focus);
          border-radius: var(--radius-md);
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stat-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .stat-circle.blue {
          background-color: white;
          color: var(--primary);
        }

        .stat-circle.green {
          background-color: white;
          color: var(--success);
        }

        .stat-circle.yellow {
          background-color: white;
          color: var(--warning);
        }
        
        .stat-circle.red {
          background-color: white;
          color: var(--danger);
        }

        .stat-label-text {
          font-size: 0.76rem;
          color: var(--slate);
          font-weight: 600;
        }

        .stat-value-text {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--navy);
          margin-left: auto;
        }

        /* Right Content panel (Floating Rounded Card Box) */
        .dashboard-content-box {
          flex: 1;
          background-color: white;
          display: flex;
          flex-direction: column;
          gap: 28px;
          overflow-y: auto;
          scrollbar-width: thin;
          
          /* Floating Panel Layout Effect */
          margin: 24px 24px 24px 12px;
          border-radius: var(--radius-lg);
          padding: 30px;
          border: none !important;
          height: calc(100vh - 72px - 48px);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
        }

        .content-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 18px;
        }

        .header-text-block {
          text-align: left;
        }

        .header-text-block h2 {
          font-size: 1.5rem;
          font-weight: 850;
          color: var(--navy);
          letter-spacing: -0.5px;
          margin: 0;
          line-height: 1.2;
        }

        .header-text-subtitle {
          font-size: 0.85rem;
          color: var(--slate);
          font-weight: 500;
          margin-top: 4px;
        }

        .subtitle-count-badge {
          background-color: var(--primary);
          color: white;
          padding: 1px 6px;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          margin: 0 2px;
        }

        .header-action-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-mobile-filter {
          display: none;
          background: white;
          border: 1.5px solid var(--navy);
          box-shadow: var(--shadow-sm);
        }

        .btn-add-workplace {
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        /* Cards Grid */
        .wireframe-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
          gap: 16px;
        }

        .empty-icon {
          color: var(--light-slate);
        }

        /* Mobile adaptation drawer styles */
        @media (max-width: 900px) {
          .btn-mobile-filter {
            display: flex;
            gap: 6px;
          }

          .dashboard-content-box {
            margin: 16px;
            height: calc(100vh - 72px - 32px);
          }

          .filter-sidebar-box {
            position: fixed;
            left: -290px;
            top: 72px;
            bottom: 0;
            z-index: 1001;
            height: calc(100vh - 72px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 10px 0 30px rgba(15, 23, 42, 0.15);
            border-right: none !important;
            margin: 0;
            border-radius: 0;
          }

          .filter-sidebar-box.mobile-open {
            left: 0;
          }

          .sidebar-header-mobile {
            display: flex;
          }

          .filter-overlay-mobile {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 1000;
          }
        }
      `}</style>
    </div>
  );
}
