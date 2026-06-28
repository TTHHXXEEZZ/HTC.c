"use client";
import React, { useState, useEffect } from 'react';
import WorkplaceDetail from '../../views/WorkplaceDetail';
import AddReviewModal from '../../components/AddReviewModal';
import { useSession } from 'next-auth/react';
import { addReviewAction, voteReviewAction } from '../actions';
import { useRouter } from 'next/navigation';

export default function WorkplaceDetailClient({ workplace, reviews = [] }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [votedReviews, setVotedReviews] = useState({});
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  // Load voted reviews from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('voted_reviews');
    if (stored) {
      try {
        setVotedReviews(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

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

  const handleVoteClick = async (reviewId, voteType) => {
    if (votedReviews[reviewId]) {
      alert('คุณได้โหวตให้รีวิวนี้ไปแล้ว');
      return;
    }

    try {
      await voteReviewAction(reviewId, voteType);
      
      const newVoted = { ...votedReviews, [reviewId]: voteType };
      setVotedReviews(newVoted);
      localStorage.setItem('voted_reviews', JSON.stringify(newVoted));
      
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการส่งผลโหวต');
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
    agreeCount: r.agreeCount || 0,
    disagreeCount: r.disagreeCount || 0,
    date: r.createdAt.toISOString ? r.createdAt.toISOString() : new Date(r.createdAt).toISOString()
  }));

  const formattedWorkplace = {
    ...workplace,
    averageRating: workplace.averageRating || 0,
    totalReviews: reviews.length
  };

  const hasReviewAccess = user?.email?.toLowerCase().endsWith('@htc.ac.th');

  return (
    <>
      <WorkplaceDetail 
        workplace={formattedWorkplace}
        reviews={formattedReviews}
        onBackClick={handleBackClick}
        onAddReviewClick={() => setShowAddReview(true)}
        onVoteClick={handleVoteClick}
        hasReviewAccess={hasReviewAccess}
        votedReviews={votedReviews}
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
