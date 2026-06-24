import { useRef } from 'react';
import { parseDate, daysBetween } from '@/lib/projectData';
import type { ProjectData } from '@/hooks/useProjectData';
import StatusBadge from './StatusBadge';

const CELL_W = 26; // px per day

type StatusFilter = 'all' | 'done' | 'in-progress' | 'not-started';

interface Props {
  data: ProjectData;
  statusFilter?: StatusFilter;
  phaseFilter?: string;
}

export default function GanttChart({ data, statusFilter = 'all', phaseFilter = 'all' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const start = parseDate(data.projectStart);
  const end   = parseDate(data.projectEnd);
  const today = parseDate(data.today);
  const totalDays = daysBetween(start, end) + 1;
  const todayOff  = daysBetween(start, today);

  const dates: Date[] = [];
  const d = new Date(start);
  while (d <= end) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  return (
    <div className="overflow-x-auto" ref={scrollRef}>
      <div style={{ minWidth: 260 + totalDays * CELL_W + 'px' }}>

        {/* ── Date header ── */}
        <div className="flex sticky top-0 z-20" style={{ background: 'var(--card)' }}>
          <div
            className="flex-shrink-0 flex border-b"
            style={{ width: 260 + 150 + 110 + 'px', borderColor: 'var(--border)' }}
          >
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ width: 260, color: 'var(--muted-foreground)' }}>Task</div>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ width: 150, color: 'var(--muted-foreground)' }}>Dates</div>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ width: 110, color: 'var(--muted-foreground)' }}>Status</div>
          </div>
          <div className="flex border-b relative" style={{ width: totalDays * CELL_W, borderColor: 'var(--border)' }}>
            {dates.map((dt, i) => {
              const isToday   = dt.toDateString() === today.toDateString();
              const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
              const isMon     = dt.getDay() === 1;
              return (
                <div
                  key={i}
                  style={{ width: CELL_W, flexShrink: 0, borderColor: 'var(--border)' }}
                  className={`flex flex-col items-center justify-center py-1 text-center border-r ${isWeekend ? 'opacity-40' : ''}`}
                >
                  {isMon || i === 0 ? (
                    <span className="text-[9px] font-medium" style={{ color: isToday ? 'var(--today-line)' : 'var(--muted-foreground)' }}>
                      {dt.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-[9px]" style={{ color: isToday ? 'var(--today-line)' : 'var(--muted-foreground)', opacity: 0.7 }}>
                      {['S','M','T','W','T','F','S'][dt.getDay()]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Phase rows ── */}
        {data.phases.filter(phase => phaseFilter === 'all' || phase.id === phaseFilter).map(phase => (
          <div key={phase.id}>
            {/* Phase header */}
            <div
              className="flex items-center gap-2 px-3 py-2 border-b"
              style={{ background: 'var(--secondary)', borderColor: 'var(--border)' }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: phase.color }} />
              <span className="text-xs font-bold tracking-wide" style={{ color: phase.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                {phase.name}
              </span>
            </div>

            {/* Task rows */}
            {phase.tasks.filter(task => {
              if (statusFilter === 'all') return true;
              if (statusFilter === 'done') return task.status === 'done';
              if (statusFilter === 'in-progress') return task.status === 'in_progress';
              if (statusFilter === 'not-started') return task.status === 'not_started';
              return true;
            }).map(task => {
              const tStart   = parseDate(task.start);
              const tEnd     = parseDate(task.end);
              const startOff = Math.max(0, daysBetween(start, tStart));
              const dur      = daysBetween(tStart, tEnd) + 1;
              const barLeft  = startOff * CELL_W;
              const barWidth = Math.max(dur * CELL_W - 2, 4);
              const opacity  = task.status === 'done' ? 1 : task.status === 'in_progress' ? 0.85 : 0.5;

              return (
                <div
                  key={task.id}
                  className="flex items-center border-b transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {/* Task info */}
                  <div className="flex-shrink-0 px-3 py-2" style={{ width: 260 }}>
                    <div className="text-[10px] font-mono font-semibold tracking-wider" style={{ color: phase.color, fontFamily: "'DM Mono', monospace" }}>{task.id}</div>
                    <div className="text-xs font-medium mt-0.5 leading-snug" style={{ color: 'var(--foreground)' }}>{task.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{task.role}</div>
                  </div>
                  {/* Dates */}
                  <div className="flex-shrink-0 px-3 py-2 text-[10px] font-mono" style={{ width: 150, color: 'var(--muted-foreground)', fontFamily: "'DM Mono', monospace" }}>
                    {task.start}<br/>→ {task.end}
                  </div>
                  {/* Status */}
                  <div className="flex-shrink-0 px-3 py-2" style={{ width: 110 }}>
                    <StatusBadge status={task.status} />
                  </div>
                  {/* Bar */}
                  <div className="relative flex-shrink-0" style={{ width: totalDays * CELL_W, height: 36 }}>
                    {/* Today line */}
                    {todayOff >= 0 && todayOff <= totalDays && (
                      <div
                        className="absolute top-0 bottom-0 w-px z-10"
                        style={{ left: todayOff * CELL_W, background: 'var(--today-line)', opacity: 0.8 }}
                      />
                    )}
                    {/* Milestone diamonds */}
                    {data.milestones.map(m => {
                      const mOff = daysBetween(start, parseDate(m.date));
                      if (mOff < 0 || mOff > totalDays) return null;
                      return (
                        <div
                          key={m.date}
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 z-10"
                          style={{ left: mOff * CELL_W - 4, background: m.color, opacity: 0.7 }}
                          title={m.label}
                        />
                      );
                    })}
                    {/* Gantt bar */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 rounded flex items-center px-1.5"
                      style={{ left: barLeft, width: barWidth, height: 18, background: phase.color, opacity }}
                    >
                      {barWidth > 55 && (
                        <span className="text-[9px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.92)', fontFamily: "'DM Mono', monospace" }}>
                          {task.id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
