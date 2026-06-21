"use client";
import React, { useState } from 'react';
import Dashboard from '../../views/Dashboard';
import AddWorkplaceModal from '../../components/AddWorkplaceModal';
import { addWorkplaceAction } from '../actions';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ workplaces = [], siteViews = 0, initialSearchTerm = '', initialSelectedDept = 'ทั้งหมด' }) {
  const [showAddWorkplace, setShowAddWorkplace] = useState(false);
  const router = useRouter();

  const handleWorkplaceClick = (id) => {
    router.push(`/workplace/${id}`);
  };

  const handleAddWorkplaceSubmit = async (workplaceData) => {
    try {
      const newWp = await addWorkplaceAction(workplaceData);
      setShowAddWorkplace(false);
      router.push(`/workplace/${newWp.id}`);
      router.refresh();
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการลงทะเบียนสถานประกอบการ');
    }
  };

  return (
    <>
      <Dashboard 
        workplaces={workplaces}
        siteViews={siteViews}
        onWorkplaceClick={handleWorkplaceClick}
        onAddWorkplaceClick={() => setShowAddWorkplace(true)}
        initialSearchTerm={initialSearchTerm}
        initialSelectedDept={initialSelectedDept}
      />

      {showAddWorkplace && (
        <AddWorkplaceModal 
          onClose={() => setShowAddWorkplace(false)}
          onSubmit={handleAddWorkplaceSubmit}
        />
      )}
    </>
  );
}
