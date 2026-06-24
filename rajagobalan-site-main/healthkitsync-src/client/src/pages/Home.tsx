import { useState } from 'react';
import { useProjectData } from '@/hooks/useProjectData';
import { useTheme } from '@/contexts/ThemeContext';
import type { Phase, Milestone, TeamRole } from '@/lib/projectData';
import GanttChart from '@/components/GanttChart';
import WBSView from '@/components/WBSView';

const STATS = [
  { value: '2',  label: 'Tasks Complete',  sub: 'P0.1, P0.2',          colorVar: 'var(--status-done)' },
  { value: '1',  label: 'In Progress',     sub: 'P0.3 Dev Setup',       colorVar: 'var(--status-progress)' },
  { value: '33', label: 'Not Started',     sub: 'Phases 1, 2, Reviews', colorVar: 'var(--status-pending)' },
  { value: '19', label: 'UI Screens',      sub: 'Phase 1 scope',        colorVar: 'var(--phase-p1)' },
  { value: '7',  label: 'Logic Tasks',     sub: 'Phase 2 scope',        colorVar: 'var(--phase-p2)' },
  { value: '5',  label: 'QA / Review',     sub: 'Phase 2 review',       colorVar: 'var(--phase-r2)' },
];

type StatusFilter = 'all' | 'done' | 'in-progress' | 'not-started';
type PhaseFilter = 'all' | 'P0' | 'P1' | 'R1' | 'P2' | 'R2';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
      style={{
        background: 'var(--secondary)',
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
      }}
    >
      {isDark ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Light
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          Dark
        </>
      )}
    </button>
  );
}

function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const options: { value: StatusFilter; label: string; colorVar: string }[] = [
    { value: 'all',         label: 'All tasks',    colorVar: 'var(--muted-foreground)' },
    { value: 'done',        label: 'Done',         colorVar: 'var(--status-done)' },
    { value: 'in-progress', label: 'In Progress',  colorVar: 'var(--status-progress)' },
    { value: 'not-started', label: 'Not Started',  colorVar: 'var(--status-pending)' },
  ];
  const current = options.find(o => o.value === value)!;

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Filter
      </span>
      <div className="relative">
        <div
          className="w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ background: current.colorVar }}
        />
        <select
          value={value}
          onChange={e => onChange(e.target.value as StatusFilter)}
          className="appearance-none pl-6 pr-7 py-1.5 rounded-full border text-xs font-semibold cursor-pointer"
          style={{
            background: 'var(--secondary)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
            fontFamily: "'Space Grotesk', sans-serif",
            outline: 'none',
          }}
          aria-label="Filter tasks by status"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {/* Chevron icon */}
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

function PhaseFilterDropdown({
  value,
  onChange,
  phases,
}: {
  value: PhaseFilter;
  onChange: (v: PhaseFilter) => void;
  phases: Phase[];
}) {
  const options: { value: PhaseFilter; label: string }[] = [
    { value: 'all', label: 'All phases' },
    ...phases.map(p => ({ value: p.id as PhaseFilter, label: p.shortName })),
  ];
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Phase
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as PhaseFilter)}
          className="appearance-none pl-3 pr-7 py-1.5 rounded-full border text-xs font-semibold cursor-pointer"
          style={{
            background: 'var(--secondary)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
            fontFamily: "'Space Grotesk', sans-serif",
            outline: 'none',
          }}
          aria-label="Filter tasks by phase"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

function formatLastUpdated(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function Home() {
  const [tab, setTab] = useState<'gantt' | 'wbs'>('gantt');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const { data, loading } = useProjectData();
  const { theme } = useTheme();

  const phases: Phase[]         = data.phases;
  const milestones: Milestone[] = data.milestones;
  const teamRoles: TeamRole[]   = data.teamRoles;
   const lastUpdated: string | undefined = data.lastUpdated;
  const isDark = theme === 'dark';

  // Progress bar calculation
  const allTasksForProgress = phases.flatMap(p => p.tasks);
  const totalTasks = allTasksForProgress.length;
  const completedTasks = allTasksForProgress.filter(t => t.status === 'done').length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* ── HEADER ── */}
      <header
        className="border-b px-6 py-5"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-header, var(--background))' }}
      >
        {/* Home breadcrumb */}
        <div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <a
            href="https://www.rajagobalan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium transition-colors"
            style={{ color: 'var(--primary)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            www.rajagobalan.com
          </a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ color: 'var(--muted-foreground)' }}>HealthKitSync v1</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--status-done)' }} />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--status-done)' }}
              >
                Live Plan
              </span>
            </div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--foreground)' }}
            >
              HealthKitSync v1 — Project Plan
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Figma → SwiftUI implementation · Expert review · Logic &amp; infrastructure · App Store
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Start', value: '1 Apr 2026' },
              { label: 'P1 UI Target', value: '20 Apr 2026' },
              { label: 'P2 Logic Target', value: '20 May 2026' },
              { label: 'App Store', value: '25 May 2026' },
            ].map(m => (
              <div
                key={m.label}
                className="px-3 py-1.5 rounded-full text-xs border"
                style={{ background: 'var(--secondary)', borderColor: 'var(--border)' }}
              >
                <span style={{ color: 'var(--muted-foreground)' }}>{m.label}: </span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{m.value}</span>
              </div>
            ))}
            <ThemeToggle />
          </div>
        </div>
        {/* ── PROGRESS BAR ── */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
              Overall Progress
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
              {completedTasks} / {totalTasks} tasks &nbsp;·&nbsp; {progressPct}% complete
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: '6px', background: 'var(--secondary)', border: '1px solid var(--border)' }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPct}% of tasks complete`}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPct}%`,
                background: progressPct === 100
                  ? 'var(--status-done)'
                  : progressPct > 50
                  ? 'var(--primary)'
                  : 'var(--status-progress)',
                minWidth: progressPct > 0 ? '6px' : '0',
              }}
            />
          </div>
        </div>
      </header>

      {/* ── STATS ROW ── */}
      <div
        className="grid gap-3 px-6 py-4 border-b"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          borderColor: 'var(--border)',
          background: 'var(--surface-section, var(--background))',
        }}
      >
        {STATS.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div
              className="text-3xl font-bold leading-none"
              style={{ color: s.colorVar, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {s.value}
            </div>
            <div className="text-xs font-semibold mt-1.5" style={{ color: 'var(--foreground)' }}>{s.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── MILESTONES STRIP ── */}
      <div
        className="flex items-center gap-4 px-6 py-3 border-b overflow-x-auto"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-widest flex-shrink-0"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Milestones
        </span>
        {milestones.map((m: Milestone) => (
          <div key={m.date} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rotate-45 rounded-sm flex-shrink-0" style={{ background: m.color }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.label}</span>
            <span
              className="text-[10px] font-mono"
              style={{ color: 'var(--muted-foreground)', opacity: 0.6, fontFamily: "'DM Mono', monospace" }}
            >
              {m.date}
            </span>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-0 px-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {(['gantt', 'wbs'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-3 text-sm font-semibold border-b-2 transition-colors"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              borderBottomColor: tab === t ? 'var(--primary)' : 'transparent',
              color: tab === t ? 'var(--primary)' : 'var(--muted-foreground)',
            }}
          >
            {t === 'gantt' ? 'Gantt Chart' : 'Work Breakdown Structure'}
          </button>
        ))}
      </div>

      {/* ── LEGEND + FILTER BAR ── */}
      <div
        className="flex flex-wrap items-center gap-4 px-6 py-3 border-b text-xs"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="uppercase tracking-wider text-[10px] font-semibold"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Phases
        </span>
        {phases.map((p: Phase) => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div className="w-5 h-2.5 rounded-sm" style={{ background: p.color }} />
            <span style={{ color: 'var(--muted-foreground)' }}>{p.shortName}</span>
          </div>
        ))}
        <span
          className="uppercase tracking-wider text-[10px] font-semibold ml-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Status
        </span>
        {[
          { colorVar: 'var(--status-done)',     label: 'Done' },
          { colorVar: 'var(--status-progress)', label: 'In Progress' },
          { colorVar: 'var(--status-pending)',  label: 'Not Started' },
          { colorVar: 'var(--today-line)',       label: 'Today' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: s.colorVar }} />
            <span style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
          </div>
        ))}

        {/* Spacer + filter — only shown on Gantt tab */}
        {tab === 'gantt' && (
          <div className="ml-auto flex items-center gap-3">
            <PhaseFilterDropdown value={phaseFilter} onChange={setPhaseFilter} phases={phases} />
            <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div
            className="flex items-center justify-center h-64 text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Loading plan data…
          </div>
        ) : (
          tab === 'gantt'
            ? <GanttChart data={data} statusFilter={statusFilter} phaseFilter={phaseFilter} />
            : <WBSView data={data} />
        )}
      </div>

      {/* ── TEAM ROSTER ── */}
      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <div
          className="text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Team Roles
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
          {teamRoles.map((r: TeamRole) => (
            <div
              key={r.name}
              className="rounded-lg px-3 py-2.5 border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{r.name}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div
        className="border-t px-6 py-3 flex items-center justify-between flex-wrap gap-2 text-[10px]"
        style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
      >
        <span>HealthKitSync v1 · Expert-approved design lock: 31 Mar 2026</span>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
              style={{ background: 'var(--secondary)', borderColor: 'var(--border)' }}
            >
              {/* Clock icon */}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Updated {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
          <span style={{ fontFamily: "'DM Mono', monospace" }}>36 tasks · 11 roles · 55 days</span>
        </div>
      </div>
    </div>
  );
}
