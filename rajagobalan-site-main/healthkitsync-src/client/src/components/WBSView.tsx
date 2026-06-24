import type { ProjectData } from '@/hooks/useProjectData';
import type { Phase, Task } from '@/lib/projectData';
import StatusBadge from './StatusBadge';

interface Props {
  data: ProjectData;
}

export default function WBSView({ data }: Props) {
  return (
    <div className="p-6 space-y-10">
      {data.phases.map((phase: Phase) => (
        <div key={phase.id}>
          {/* Phase title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: phase.color }} />
            <h2
              className="text-base font-bold tracking-tight"
              style={{ color: phase.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {phase.name}
            </h2>
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--muted-foreground)', fontFamily: "'DM Mono', monospace" }}
            >
              {phase.tasks.length} tasks
            </span>
          </div>

          {/* Task grid */}
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {phase.tasks.map((task: Task) => {
              const progress = task.status === 'done' ? 100 : task.status === 'in_progress' ? 40 : 0;
              return (
                <div
                  key={task.id}
                  className="rounded-xl p-4 border transition-colors"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div
                        className="text-[10px] font-semibold tracking-wider mb-1"
                        style={{ color: phase.color, fontFamily: "'DM Mono', monospace" }}
                      >
                        {task.id}
                      </div>
                      <div
                        className="text-sm font-semibold leading-snug"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {task.name}
                      </div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{task.role}</span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--muted-foreground)', opacity: 0.7, fontFamily: "'DM Mono', monospace" }}
                    >
                      {task.start} → {task.end}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, background: phase.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
