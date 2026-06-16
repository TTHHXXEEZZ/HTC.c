import React from 'react';
import { MapPin, MessageSquare, Star, Eye } from 'lucide-react';
import DepartmentBadge from './DepartmentBadge';

export default function WorkplaceCard({ workplace, onClick }) {
  const { name, category, address, department, averageRating, totalReviews, coverImage, views } = workplace;

  return (
    <div className="workplace-card-wireframe card card-hover" onClick={() => onClick(workplace.id)}>
      {/* Bordered Image Container */}
      <div className="card-image-box">
        <img 
          src={coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80'} 
          alt={name} 
          className="card-media-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80';
          }}
        />
        <span className="card-category-tag">{category}</span>
      </div>

      {/* Card Details Block */}
      <div className="card-details-box">
        <div className="details-left">
          <h3 className="card-title" title={name}>{name}</h3>
          
          <div className="card-badge-row">
            <DepartmentBadge deptName={department} />
          </div>
          
          <div className="card-address-row">
            <MapPin size={12} className="address-pin-icon" />
            <span className="address-text-mini">{address}</span>
          </div>

          {/* Polished Meta statistics inside card (Views and Reviews count) */}
          <div className="card-meta-row">
            <span className="meta-item-mini" title={`เข้าชม ${views || 0} ครั้ง`}>
              <Eye size={12} className="meta-icon" />
              <span>{views || 0} เข้าชม</span>
            </span>
            <span className="meta-item-separator">•</span>
            <span className="meta-item-mini" title={`${totalReviews} รีวิวจากรุ่นพี่`}>
              <MessageSquare size={12} className="meta-icon" />
              <span>{totalReviews} รีวิว</span>
            </span>
          </div>
        </div>

        {/* Polished Star Rating at Bottom Right */}
        <div className="details-right-star">
          <Star size={14} fill="#d97706" color="#d97706" className="star-icon-accent" />
          <span className="star-rating-score">{averageRating || '0.0'}</span>
        </div>
      </div>

      <style>{`
        .workplace-card-wireframe {
          padding: 16px;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color) !important;
          border-radius: var(--radius-md) !important;
          cursor: pointer;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
        }

        .workplace-card-wireframe:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(15, 23, 42, 0.08);
          border-color: var(--primary) !important;
        }

        /* Bordered image box from wireframe with polished styling */
        .card-image-box {
          width: 100%;
          height: 145px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background-color: var(--bg-main);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .card-media-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .workplace-card-wireframe:hover .card-media-image {
          transform: scale(1.06);
        }

        .card-category-tag {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: white;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.65rem;
          font-weight: 700;
          z-index: 2;
          box-shadow: var(--shadow-sm);
        }

        /* Details layout */
        .card-details-box {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 14px;
          flex: 1;
          gap: 10px;
        }

        .details-left {
          text-align: left;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-title {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1.35;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.1px;
          transition: var(--transition);
        }

        .workplace-card-wireframe:hover .card-title {
          color: var(--primary);
        }

        .card-badge-row {
          display: flex;
          gap: 4px;
        }

        .card-address-row {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--slate);
          margin-top: 2px;
        }

        .address-pin-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .address-text-mini {
          font-size: 0.72rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Meta statistics under address */
        .card-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--slate);
          font-size: 0.72rem;
          margin-top: 2px;
          font-weight: 600;
        }

        .meta-item-mini {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .meta-icon {
          color: var(--light-slate);
        }

        .meta-item-separator {
          color: var(--border-color);
        }

        /* Floating rating badge style at Bottom Right */
        .details-right-star {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: #fef3c7; /* Gold/Amber background tint */
          border: 1px solid #fde68a; /* Amber-200 border */
          padding: 6px 10px;
          border-radius: 6px;
          flex-shrink: 0;
          margin-bottom: 2px;
          box-shadow: 0 2px 4px rgba(217, 119, 6, 0.05);
          transition: var(--transition);
        }

        .workplace-card-wireframe:hover .details-right-star {
          background-color: #fde68a;
          transform: scale(1.03);
        }

        .star-icon-accent {
          flex-shrink: 0;
        }

        .star-rating-score {
          font-size: 0.82rem;
          font-weight: 800;
          color: #b45309; /* Dark Amber text */
        }
      `}</style>
    </div>
  );
}
