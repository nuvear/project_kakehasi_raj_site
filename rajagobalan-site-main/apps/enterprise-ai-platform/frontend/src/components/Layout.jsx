"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
const routes = [
  ["/", "Overview"],
  ["/dashboard", "Dashboard"],
  ["/discovery", "Discovery"],
  ["/portfolio", "Portfolio"],
  ["/maturity", "Maturity"],
  ["/roi", "ROI"],
  ["/architecture", "Architecture"],
  ["/wardley", "Wardley"],
  ["/roadmap", "Roadmap"],
  ["/slides", "Slides"],
];
export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();
  return (
    <div className="coast-app">
      <Head>
        <title>
          {routes.find(([path]) => path === pathname)?.[1] || "Workspace"} | AI
          Command Center
        </title>
      </Head>
      <a className="coast-skip" href="#workspace">
        Skip to content
      </a>
      <header className="coast-header">
        <a href="https://www.rajagobalan.com/en" className="coast-owner">
          <span>R.</span>Rajkumar Rajagobalan
        </a>
        <Link href="/" className="coast-product">
          AI Command Center
        </Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="coast-nav"
        >
          {open ? "Close" : "Menu"}
        </button>
        <a
          className="coast-diary-link"
          href="https://www.rajagobalan.com/diary"
        >
          Leadership Diary ↗
        </a>
      </header>
      <div className="coast-layout">
        <aside className={`coast-sidebar ${open ? "is-open" : ""}`}>
          <p className="coast-kicker">TRANSFORMATION WORKSPACE</p>
          <nav id="coast-nav" aria-label="Command Center">
            {routes.map(([href, label], i) => (
              <Link
                href={href}
                key={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="coast-sidebar-note">
            <span>STRATEGY → EXECUTION</span>
            <p>
              Explore opportunities. Evaluate priorities. Shape your roadmap.
            </p>
            <a href="https://www.rajagobalan.com/en/apps/ai-transformation-command-center/docs/deployment">
              Deployment guide ↗
            </a>
          </div>
        </aside>
        <main id="workspace" className="coast-workspace">
          {children}
        </main>
      </div>
      <footer className="coast-footer">
        <span>Campus & Coast / AI Transformation</span>
        <a href="https://www.rajagobalan.com/en">Back to the main site ↗</a>
      </footer>
    </div>
  );
}
