"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const MapLoader = dynamic(() => import('./LocationMap'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '300px', 
      backgroundColor: '#f1f5f9', 
      display: 'flex', 
      alignItems: 'center', 
      justify: 'center', 
      borderRadius: 'var(--radius-md)',
      color: 'var(--slate)',
      fontWeight: '600',
      border: '1px solid var(--border-color)'
    }}>
      กำลังโหลดแผนที่พิกัด...
    </div>
  )
});

export default MapLoader;
