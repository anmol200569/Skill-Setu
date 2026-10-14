import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileTabBar } from './MobileTabBar';
import { AIChatDrawer } from '../assistant/AIChatDrawer';

export function LearnerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar mode="learner" />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 md:pb-12 overflow-y-auto outline-none"
        >
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
      <AIChatDrawer />
    </div>
  );
}
