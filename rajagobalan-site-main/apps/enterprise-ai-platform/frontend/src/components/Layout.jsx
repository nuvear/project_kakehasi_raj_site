'use client';

import React from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">RR</span>
            AI Command Center
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Home</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Dashboard</Link>
            <Link href="/discovery" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Discovery</Link>
            <Link href="/portfolio" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Portfolio</Link>
            <Link href="/maturity" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Maturity</Link>
            <Link href="/roi" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">ROI</Link>
            <Link href="/architecture" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Architecture</Link>
            <Link href="/wardley" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Wardley</Link>
            <Link href="/roadmap" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">Roadmap</Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
