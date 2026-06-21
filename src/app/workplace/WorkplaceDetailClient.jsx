"use client";
import React, { useState } from 'react';
import WorkplaceDetail from '../../views/WorkplaceDetail';
import AddReviewModal from '../../components/AddReviewModal';
import { useSession } from 'next-auth/react';
import { addReviewAction } from '../actions';
import { useRouter } from 'next/navigation';

export default function WorkplaceDetailClient({ workplace, reviews = [] }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleBackClick = () => {
    router.push('/');
  };

  const handleAddReviewSubmit = async (reviewData) => {
    if (!user) return;
    try {
      await addReviewAction({
        workplaceId: workplace.id,
        reviewerName: user.name || user.email.split('@')[0],
        reviewerDept: reviewData.department,
        rating: reviewData.rating,
        content: reviewData.comments
      });
      setShowAddReview(false);
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการบันทึกรีวิว');
    }
  };

  // Map database review models to the props format expected by WorkplaceDetail
  const formattedReviews = reviews.map(r => ({
    id: r.id,
    workplaceId: r.workplaceId,
    userName: r.reviewerName,
    department: r.reviewerDept,
    rating: r.rating,
    comments: r.content,
    date: r.createdAt.toISOString ? r.createdAt.toISOString() : new Date(r.createdAt).toISOString()
  }));

  const formattedWorkplace = {
    ...workplace,
    averageRating: workplace.averageRating || 0,
    totalReviews: reviews.length
  };

  return (
    <>
      <WorkplaceDetail 
        workplace={formattedWorkplace}
        reviews={formattedReviews}
        onBackClick={handleBackClick}
        onAddReviewClick={() => setShowAddReview(true)}
      />

      {showAddReview && user && (
        <AddReviewModal 
          user={{
            name: user.name,
            email: user.email,
            photoUrl: user.image
          }}
          workplace={workplace}
          onClose={() => setShowAddReview(false)}
          onSubmit={handleAddReviewSubmit}
        />
      )}
    </>
  );
}
