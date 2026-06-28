"use client";
import React from "react";
import Home from "../views/Home";
import { useRouter } from "next/navigation";

export default function HomeClient({ workplaces, siteViews }) {
  const router = useRouter();

  const handleSearch = (q, dept) => {
    router.push(`/dashboard?q=${encodeURIComponent(q)}&dept=${encodeURIComponent(dept)}`);
  };

  const handleWorkplaceClick = (id) => {
    router.push(`/workplace/${id}`);
  };

  const handleRegisterClick = () => {
    router.push('/register-workplace');
  };

  return (
    <Home 
      workplaces={workplaces}
      siteViews={siteViews}
      onSearch={handleSearch}
      onWorkplaceClick={handleWorkplaceClick}
      onRegisterClick={handleRegisterClick}
    />
  );
}
