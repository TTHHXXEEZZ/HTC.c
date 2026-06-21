import React, { useState, useMemo } from 'react';
import { ArrowLeft, Globe, Phone, MapPin, Calendar, Briefcase, DollarSign, MessageSquare, Plus, ExternalLink, Image as ImageIcon, X, Eye } from 'lucide-react';
import StarRating from '../components/StarRating';
import DepartmentBadge from '../components/DepartmentBadge';
import MapLoader from '../components/MapLoader';

export default function WorkplaceDetail({ workplace, reviews = [], onBackClick, onAddReviewClick }) {
  const [activePhoto, setActivePhoto] = useState(null); // For fullscreen lightbox

  const { name, category, description, address, website, phone, department, lat, lng, averageRating, totalReviews, coverImage, views } = workplace;

  // Calculate rating distribution and average allowance
  const stats = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalAllowance = 0;
    let allowanceCount = 0;

    reviews.forEach(r => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      if (r.allowance) {
        totalAllowance += parseFloat(r.allowance);
        allowanceCount++;
      }
    });

    const avgAllowance = allowanceCount > 0 ? Math.round(totalAllowance / allowanceCount) : null;
    return { counts, avgAllowance };
  }, [reviews]);

  const ratingProgress = (stars) => {
    if (reviews.length === 0) return 0;
    return ((stats.counts[stars] || 0) / reviews.length) * 100;
  };

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
    <div className="workplace-detail-bento animate-fade-in">
      {/* Back navigation */}
      <div className="detail-navigation">
        <button onClick={onBackClick} className="btn-back">
          <ArrowLeft size={18} />
          <span>ย้อนกลับไปหน้าแรก</span>
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="bento-grid">
        
        {/* Bento Box 1: Hero Cover & Brand (Spans 2 columns on desktop) */}
        <div className="bento-item bento-hero card">
          <div className="hero-bento-layout">
            <div className="hero-bento-media">
              <img 
                src={coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'} 
                alt={name} 
                className="hero-bento-image"
              />
            </div>
            <div className="hero-bento-info">
              <div className="hero-badge-row">
                <span className="category-tag">{category}</span>
                <DepartmentBadge deptName={department} />
              </div>
              <h2 className="detail-title">{name}</h2>
              <div className="rating-overview">
                <div className="star-block">
                  <StarRating rating={averageRating} size={18} />
                  <span className="rating-num">{averageRating || '0.0'}</span>
                </div>
                <span className="divider">•</span>
                <span className="reviews-count-text">{totalReviews} รีวิวจากเพื่อนนักศึกษา</span>
                <span className="divider">•</span>
                {/* Workplace individual view count displayed next to reviews */}
                <span className="views-count-text">
                  <Eye size={15} className="views-eye-icon" />
                  <span>มีผู้เข้าชม {views || 0} ครั้ง</span>
                </span>
              </div>
              <button className="btn btn-primary btn-write-review" onClick={onAddReviewClick}>
                <Plus size={16} /> เขียนรีวิวแชร์ประสบการณ์
              </button>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Review Stats Summary (Spans 1 column on desktop) */}
        <div className="bento-item bento-stats card">
          <h3 className="bento-title">สรุปคะแนนประเมิน</h3>
          <div className="rating-analytics-summary">
            <div className="avg-rating-big">
              <span className="rating-big-value">{averageRating || '0.0'}</span>
              <StarRating rating={averageRating} size={14} />
              <span className="total-reviews-count">{reviews.length} รีวิว</span>
            </div>
            <div className="rating-bars-list">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="rating-bar-row">
                  <span className="bar-label">{stars} ดาว</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${ratingProgress(stars)}%` }}></div>
                  </div>
                  <span className="bar-count">{stats.counts[stars] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {stats.avgAllowance && (
            <div className="allowance-stat-card">
              <DollarSign size={20} className="stat-money-icon" />
              <div className="stat-money-info">
                <span className="stat-money-title">ค่าตอบแทนเฉลี่ยโดยประมาณ</span>
                <span className="stat-money-value">{stats.avgAllowance} บาท/วัน</span>
              </div>
            </div>
          )}
        </div>

        {/* Bento Box 3: About Workplace (Spans 2 columns on desktop) */}
        <div className="bento-item bento-about card">
          <h3 className="bento-title">เกี่ยวกับสถานประกอบการ</h3>
          <p className="description-text">{description}</p>
          
          <div className="contact-list">
            {website && (
              <div className="contact-item">
                <Globe size={15} className="contact-icon" />
                <a href={website} target="_blank" rel="noopener noreferrer" className="contact-link">
                  {website} <ExternalLink size={11} style={{ marginLeft: 2 }} />
                </a>
              </div>
            )}
            {phone && (
              <div className="contact-item">
                <Phone size={15} className="contact-icon" />
                <span>{phone}</span>
              </div>
            )}
            <div className="contact-item">
              <MapPin size={15} className="contact-icon" />
              <span>{address}</span>
            </div>
          </div>
        </div>

        {/* Bento Box 4: Map Location (Spans 1 column on desktop) */}
        <div className="bento-item bento-map card">
          <h3 className="bento-title">สถานที่ตั้ง</h3>
          <MapLoader lat={lat} lng={lng} height="180px" />
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline btn-google-maps"
          >
            <MapPin size={14} style={{ color: 'var(--danger)' }} />
            <span>เปิดดูบน Google Maps</span>
            <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
          </a>
        </div>

        {/* Bento Box 5: Reviews (Spans 3 columns/full-width on desktop) */}
        <div className="bento-item bento-reviews card">
          <div className="reviews-header">
            <h3 className="bento-title">รีวิวประสบการณ์ฝึกงาน ({reviews.length})</h3>
            <button className="btn btn-secondary btn-sm-review" onClick={onAddReviewClick}>
              เขียนรีวิวใหม่
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="reviews-timeline">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-user-row">
                    <img 
                      src={review.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                      alt={review.userName} 
                      className="reviewer-avatar" 
                    />
                    <div className="reviewer-info">
                      <h4 className="reviewer-name">{review.userName}</h4>
                      <span className="review-date">{formatDate(review.date)}</span>
                    </div>
                    <div className="review-badge-wrapper">
                      <DepartmentBadge deptName={review.department} />
                    </div>
                  </div>

                  <div className="review-meta-info">
                    <div className="meta-tag">
                      <Briefcase size={14} />
                      <span>ตำแหน่ง: <strong>{review.position || 'นักศึกษาฝึกงาน'}</strong></span>
                    </div>
                    <div className="meta-tag">
                      <Calendar size={14} />
                      <span>ปีการศึกษา: <strong>{review.year || '-'}</strong></span>
                    </div>
                    {review.allowance && (
                      <div className="meta-tag allowance">
                        <DollarSign size={14} />
                        <span>ค่าตอบแทน: <strong>{review.allowance} บาท/วัน</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="review-rating-row">
                    <StarRating rating={review.rating} size={14} />
                    <span className="rating-badge-text">{review.rating} / 5 คะแนน</span>
                  </div>

                  <p className="review-comment">"{review.comments}"</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="review-photo-gallery">
                      {review.photos.map((photo, pIdx) => (
                        <div 
                          key={pIdx} 
                          className="review-photo-thumbnail"
                          onClick={() => setActivePhoto(photo)}
                        >
                          <img src={photo} alt="Work experience upload" />
                          <div className="photo-zoom-overlay">
                            <ImageIcon size={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reviews">
              <MessageSquare size={36} className="empty-reviews-icon" />
              <h4>ยังไม่มีการรีวิวในขณะนี้</h4>
              <p>คุณเคยฝึกงานหรือทำงานที่นี่มาก่อนหรือไม่? มาร่วมแชร์รีวิวเพื่อแนะแนวให้กับรุ่นน้องแผนกต่าง ๆ กันเถอะ!</p>
              <button className="btn btn-primary" onClick={onAddReviewClick}>
                เริ่มเขียนรีวิวคนแรก
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Full screen Lightbox overlay */}
      {activePhoto && (
        <div className="photo-lightbox-overlay" onClick={() => setActivePhoto(null)}>
          <div className="lightbox-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActivePhoto(null)}>
              <X size={20} />
            </button>
            <img src={activePhoto} alt="Work experience Fullscreen View" className="lightbox-image" />
          </div>
        </div>
      )}

      <style>{`
        .workplace-detail-bento {
          padding-bottom: 60px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .detail-navigation {
          text-align: left;
          margin-bottom: 20px;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--slate);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }

        .btn-back:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        /* Bento Grid System styling */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Bento Item base */
        .bento-item {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .bento-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 18px;
          border-left: 4px solid var(--primary);
          padding-left: 10px;
          line-height: 1.2;
        }

        /* Span alignments */
        .bento-hero {
          grid-column: span 2;
        }

        .bento-stats {
          grid-column: span 1;
        }

        .bento-about {
          grid-column: span 2;
        }

        .bento-map {
          grid-column: span 1;
        }

        .bento-reviews {
          grid-column: span 3;
        }

        /* Responsive spans */
        @media (max-width: 992px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .bento-hero, .bento-about {
            grid-column: span 2;
          }

          .bento-stats, .bento-map {
            grid-column: span 1;
          }

          .bento-reviews {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }

          .bento-hero, .bento-about, .bento-stats, .bento-map, .bento-reviews {
            grid-column: span 1;
          }
        }

        /* Hero Bento inner layout */
        .hero-bento-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 600px) {
          .hero-bento-layout {
            grid-template-columns: 240px 1fr;
          }
        }

        .hero-bento-media {
          height: 160px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--primary-light);
        }

        .hero-bento-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-bento-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .hero-badge-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .category-tag {
          font-size: 0.7rem;
          background-color: var(--navy);
          color: white;
          padding: 4px 10px;
          border-radius: 50px;
          font-weight: 700;
        }

        .detail-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .rating-overview {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 0.85rem;
          color: var(--slate);
          flex-wrap: wrap;
        }

        .star-block {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-num {
          font-weight: 700;
          color: var(--navy);
        }

        .divider {
          color: var(--border-color);
        }

        .reviews-count-text {
          font-weight: 500;
        }

        .views-count-text {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: var(--slate);
        }
        
        .views-eye-icon {
          color: var(--primary);
        }

        /* Description text */
        .description-text {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--slate);
          margin-bottom: 18px;
        }

        /* Contact layout */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--border-color);
          padding-top: 14px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--slate);
        }

        .contact-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .contact-link {
          color: var(--primary);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        /* Rating Breakdown statistics */
        .rating-analytics-summary {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 14px;
        }

        .avg-rating-big {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .rating-big-value {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1;
        }

        .total-reviews-count {
          font-size: 0.75rem;
          color: var(--slate);
        }

        .rating-bars-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rating-bar-row {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: var(--slate);
          gap: 6px;
        }

        .bar-label {
          width: 38px;
          text-align: right;
        }

        .bar-track {
          flex: 1;
          height: 6px;
          background-color: var(--bg-main);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .bar-fill {
          height: 100%;
          background-color: var(--warning);
        }

        .bar-count {
          width: 20px;
          text-align: left;
          font-weight: 600;
          color: var(--navy);
        }

        /* Allowance Stat */
        .allowance-stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stat-money-icon {
          color: #059669;
          background-color: #ecfdf5;
          padding: 6px;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
        }

        .stat-money-info {
          display: flex;
          flex-direction: column;
        }

        .stat-money-title {
          font-size: 0.7rem;
          color: var(--slate);
        }

        .stat-money-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: #059669;
        }

        /* Map Google buttons */
        .btn-google-maps {
          width: 100%;
          margin-top: 12px;
          font-size: 0.8rem;
          padding: 10px;
        }

        /* Reviews Header */
        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
        }

        .reviews-header .bento-title {
          margin-bottom: 0;
          border-left: none;
          padding-left: 0;
          font-size: 1.15rem;
        }

        .btn-sm-review {
          padding: 8px 14px;
          font-size: 0.8rem;
        }

        /* Review Card timeline */
        .review-card {
          border-bottom: 1px solid var(--border-color);
          padding: 20px 0;
        }

        .review-card:first-child {
          padding-top: 0;
        }

        .review-card:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .review-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .reviewer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid white;
          box-shadow: var(--shadow-sm);
        }

        .reviewer-info {
          flex: 1;
        }

        .reviewer-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.2;
        }

        .review-date {
          font-size: 0.7rem;
          color: var(--slate);
        }

        .review-meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 14px;
          margin-bottom: 10px;
          background-color: var(--bg-main);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--slate);
        }

        .meta-tag {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .meta-tag strong {
          color: var(--navy);
        }

        .meta-tag.allowance {
          color: #059669;
        }

        .meta-tag.allowance strong {
          color: #059669;
        }

        .review-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .rating-badge-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--navy);
        }

        .review-comment {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--slate);
          white-space: pre-line;
          margin-bottom: 12px;
        }

        /* Image gallery uploads */
        .review-photo-gallery {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .review-photo-thumbnail {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          position: relative;
          cursor: zoom-in;
          border: 1px solid var(--border-color);
        }

        .review-photo-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .review-photo-thumbnail:hover img {
          transform: scale(1.08);
        }

        .photo-zoom-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: var(--transition);
        }

        .review-photo-thumbnail:hover .photo-zoom-overlay {
          opacity: 1;
        }

        /* Empty state reviews */
        .empty-reviews {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 10px;
          gap: 10px;
        }

        .empty-reviews-icon {
          color: var(--light-slate);
        }

        .empty-reviews h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--navy);
        }

        .empty-reviews p {
          color: var(--slate);
          font-size: 0.8rem;
          max-width: 340px;
          margin-bottom: 6px;
        }

        /* Lightbox overlays */
        .photo-lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.9);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          backdrop-filter: blur(8px);
        }

        .lightbox-content {
          position: relative;
          max-width: 90%;
          max-height: 85vh;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: var(--radius-sm);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 2px solid white;
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .lightbox-close:hover {
          background-color: rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </div>
  );
}
