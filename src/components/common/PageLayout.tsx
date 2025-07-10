"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standard page layout component with navbar and footer
 * Used to maintain consistent layout across pages
 */
export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <main className={`min-h-screen bg-bg-primary text-text-primary page-transition font-netflix ${className}`}>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
