import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkplaceDetail from './pages/WorkplaceDetail';
import AddWorkplaceModal from './components/AddWorkplaceModal';
import AddReviewModal from './components/AddReviewModal';
import { getCurrentUser } from './services/auth';
import { getWorkplaces, getReviews, addWorkplace, addReview, getSiteViews, incrementSiteViews, incrementWorkplaceViews } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [workplaces, setWorkplaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [siteViews, setSiteViews] = useState(0);
  
  // Navigation
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'detail'
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState(null);

  // Modals
  const [showAddWorkplace, setShowAddWorkplace] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);

  // Load initial states and increment visitor counter
  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    
    // Increment total site views on startup
    const views = incrementSiteViews();
    setSiteViews(views);
    
    // Load workplaces
    setWorkplaces(getWorkplaces());
  }, []);

  // Sync reviews when a workplace is selected
  useEffect(() => {
    if (selectedWorkplaceId) {
      setReviews(getReviews(selectedWorkplaceId));
    }
  }, [selectedWorkplaceId]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setWorkplaces(getWorkplaces()); // Refresh data
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
    setSelectedWorkplaceId(null);
  };

  const handleWorkplaceClick = (id) => {
    // Increment workplace view count in database
    incrementWorkplaceViews(id);
    
    // Re-fetch workplaces list to get updated view count state
    setWorkplaces(getWorkplaces());
    
    setSelectedWorkplaceId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setSelectedWorkplaceId(null);
    setCurrentPage('dashboard');
    setWorkplaces(getWorkplaces()); // Refresh counters
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddWorkplaceSubmit = (workplaceData) => {
    const newWp = addWorkplace(workplaceData);
    setWorkplaces(getWorkplaces()); // Reload list
    setShowAddWorkplace(false);
    // Automatically view the newly created workplace
    handleWorkplaceClick(newWp.id);
  };

  const handleAddReviewSubmit = (reviewData) => {
    addReview(reviewData);
    // Reload reviews for current workplace
    setReviews(getReviews(selectedWorkplaceId));
    // Reload workplaces list to update ratings count/average
    setWorkplaces(getWorkplaces());
    setShowAddReview(false);
  };

  // Find currently selected workplace
  const currentWorkplace = selectedWorkplaceId 
    ? workplaces.find(w => w.id === selectedWorkplaceId) 
    : null;

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* 
        Horizontal Top Header Bar:
        Stays fixed at the top of the viewport.
      */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onHomeClick={handleBackToDashboard}
      />
      
      {/* Main viewport area below Header */}
      <div className="app-main-wrapper">
        {currentPage === 'dashboard' ? (
          <Dashboard 
            workplaces={workplaces}
            siteViews={siteViews} // Pass visitor counter to Dashboard
            onWorkplaceClick={handleWorkplaceClick}
            onAddWorkplaceClick={() => setShowAddWorkplace(true)}
          />
        ) : (
          <>
            <main className="main-content-padded">
              {currentWorkplace && (
                <WorkplaceDetail 
                  workplace={currentWorkplace}
                  reviews={reviews}
                  onBackClick={handleBackToDashboard}
                  onAddReviewClick={() => setShowAddReview(true)}
                />
              )}
            </main>
            <Footer />
          </>
        )}
      </div>

      {/* Modal overlays */}
      {showAddWorkplace && (
        <AddWorkplaceModal 
          onClose={() => setShowAddWorkplace(false)}
          onSubmit={handleAddWorkplaceSubmit}
        />
      )}

      {showAddReview && currentWorkplace && (
        <AddReviewModal 
          user={user}
          workplace={currentWorkplace}
          onClose={() => setShowAddReview(false)}
          onSubmit={handleAddReviewSubmit}
        />
      )}
    </div>
  );
}

export default App;
