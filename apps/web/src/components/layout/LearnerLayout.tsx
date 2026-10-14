import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileTabBar } from './MobileTabBar';
import { AIChatDrawer } from '../assistant/AIChatDrawer';

export function LearnerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden relative selection:bg-blue-600 selection:text-white">
      {/* Background ambient liquid lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 dark:bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px]" />
      </div>

      {/* Unified Single Sleek Navbar */}
      <Navbar />

      {/* Main Full-Width Content Canvas */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 w-full max-w-[1720px] mx-auto min-w-0 px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 pb-24 md:pb-16 overflow-y-auto overflow-x-hidden outline-none"
      >
        <Outlet />
      </main>

      {/* Refined Floating Mobile Dock & AI Mentor */}
      <MobileTabBar />
      <AIChatDrawer />
    </div>
  );
}
