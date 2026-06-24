import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      <Head>
        <title>AI Transformation Command Center — Rajkumar Rajagobalan</title>
        <meta name="description" content="A production-grade AI Transformation Platform for enterprise consulting, internal transformation, and AI strategy workshops." />
      </Head>

      {/* Header */}
      <header className="landing-nav-header">
        <div className="landing-nav-container">
          <Link href="/" className="landing-nav-brand">
            <div className="landing-nav-logo">RR</div>
            Rajkumar Rajagobalan
          </Link>
          <button 
            className="landing-menu-toggle" 
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <ul className={`landing-nav-menu ${mobileMenuOpen ? 'block' : ''}`} style={mobileMenuOpen ? {
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--md-sys-color-surface)',
            flexDirection: 'column',
            padding: '24px',
            display: 'flex'
          } : {}}>
            <li><Link href="/" className="landing-nav-link">Home</Link></li>
            <li><Link href="/dashboard" className="landing-nav-link">Dashboard</Link></li>
            <li><a href="https://www.rajagobalan.com/blogs.html" className="landing-nav-link">Blogs</a></li>
            <li><a href="https://www.rajagobalan.com/framework.html" className="landing-nav-link">Framework</a></li>
          </ul>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="landing-hero-section">
          <h1 className="landing-hero-title">AI Transformation Command Center</h1>
          <p className="landing-hero-subtitle">The operating system for enterprise AI strategy. From discovery to deployment, manage your entire transformation portfolio in one unified platform.</p>
          
          <div className="landing-cta-buttons">
            <Link href="/dashboard" className="landing-btn landing-btn-primary">
              <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i> Launch Dashboard
            </Link>
            <a href="https://www.rajagobalan.com/deployment-guide.html" className="landing-btn landing-btn-secondary">
              <i className="fas fa-book" style={{ marginRight: '8px' }}></i> Deployment Guide
            </a>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="landing-feature-grid">
          {/* Dashboard */}
          <Link href="/dashboard" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-chart-line"></i></div>
              <h3 className="landing-feature-title">Executive Dashboard</h3>
              <p className="landing-feature-desc">Real-time visibility into your AI portfolio health. Track ROI projections, maturity scores, and project status across the enterprise.</p>
            </div>
          </Link>

          {/* Discovery Engine */}
          <Link href="/discovery" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-search-dollar"></i></div>
              <h3 className="landing-feature-title">Discovery Engine</h3>
              <p className="landing-feature-desc">AI-powered opportunity identification. Input your industry and challenges to generate prioritized use cases with ROI estimates.</p>
            </div>
          </Link>

          {/* Portfolio Manager */}
          <Link href="/portfolio" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-th-large"></i></div>
              <h3 className="landing-feature-title">Portfolio Manager</h3>
              <p className="landing-feature-desc">Visual Impact vs. Feasibility matrix. Drag-and-drop projects to optimize your investment strategy and balance risk.</p>
            </div>
          </Link>

          {/* Maturity Assessment */}
          <Link href="/maturity" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-clipboard-check"></i></div>
              <h3 className="landing-feature-title">Maturity Assessment</h3>
              <p className="landing-feature-desc">Comprehensive 40-point assessment across Strategy, Data, Tech, People, and Governance domains with industry benchmarking.</p>
            </div>
          </Link>

          {/* ROI Simulator */}
          <Link href="/roi" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-calculator"></i></div>
              <h3 className="landing-feature-title">ROI Simulator</h3>
              <p className="landing-feature-desc">Advanced financial modeling. Calculate NPV, IRR, and payback periods for your AI initiatives based on cost savings and revenue uplift.</p>
            </div>
          </Link>

          {/* Architecture Generator */}
          <Link href="/architecture" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-sitemap"></i></div>
              <h3 className="landing-feature-title">Architecture Generator</h3>
              <p className="landing-feature-desc">Instantly generate ML pipeline architecture diagrams tailored to your specific use cases and cloud environment.</p>
            </div>
          </Link>

          {/* Wardley Mapping */}
          <Link href="/wardley" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-map-signs"></i></div>
              <h3 className="landing-feature-title">Wardley Mapping</h3>
              <p className="landing-feature-desc">Strategic situational awareness. Determine "Build vs. Buy" decisions based on component evolution and commoditization.</p>
            </div>
          </Link>

          {/* Roadmap Generator */}
          <Link href="/roadmap" className="block">
            <div className="landing-feature-card cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <div className="landing-feature-icon"><i className="fas fa-road"></i></div>
              <h3 className="landing-feature-title">Roadmap Generator</h3>
              <p className="landing-feature-desc">Create 12-24 month phased transformation plans. Define milestones, dependencies, and resource requirements automatically.</p>
            </div>
          </Link>
        </section>

        {/* Technical Architecture */}
        <section className="landing-tech-stack">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '16px', color: 'var(--md-sys-color-on-surface)' }}>Built for Enterprise Scale</h2>
          <p style={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>A modern, containerized full-stack architecture designed for security, scalability, and extensibility.</p>
          
          <div className="landing-tech-badges">
            <span className="landing-tech-badge"><i className="fab fa-react" style={{ marginRight: '6px' }}></i>Next.js 14</span>
            <span className="landing-tech-badge"><i className="fab fa-python" style={{ marginRight: '6px' }}></i>FastAPI</span>
            <span className="landing-tech-badge"><i className="fas fa-database" style={{ marginRight: '6px' }}></i>PostgreSQL</span>
            <span className="landing-tech-badge"><i className="fab fa-docker" style={{ marginRight: '6px' }}></i>Docker</span>
            <span className="landing-tech-badge"><i className="fas fa-brain" style={{ marginRight: '6px' }}></i>OpenAI / LangChain</span>
            <span className="landing-tech-badge"><i className="fas fa-chart-bar" style={{ marginRight: '6px' }}></i>Chart.js</span>
          </div>
        </section>

        <footer className="landing-site-footer">
          <div className="landing-footer-container">
            <div className="landing-footer-brand">
              <div className="landing-nav-logo" style={{ marginBottom: '16px' }}>RR</div>
              <p className="font-bold">Rajkumar Rajagobalan</p>
              <p className="landing-footer-text">Enterprise AI Transformation Leader</p>
            </div>
            <div className="landing-footer-links">
              <Link href="/" className="landing-footer-link">Home</Link>
              <a href="https://www.rajagobalan.com/blogs.html" className="landing-footer-link">Blogs</a>
              <a href="https://www.rajagobalan.com/framework.html" className="landing-footer-link">Framework</a>
              <a href="https://www.rajagobalan.com/deployment-guide.html" className="landing-footer-link">Deployment Guide</a>
            </div>
            <div className="flex gap-4">
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-600"><i className="fab fa-linkedin fa-lg"></i></a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-blue-400"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" aria-label="Email" className="text-gray-500 hover:text-red-500"><i className="fas fa-envelope fa-lg"></i></a>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <p>&copy; 2026 Rajkumar Rajagobalan. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
