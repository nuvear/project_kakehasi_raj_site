import type { Status } from '@/lib/projectData';

// Uses CSS variables defined in index.css for both dark and light theme support.
// Colours are also colour-blind safe (sky blue / amber / grey — no pure red/green pair).
const CONFIG: Record<Status, { label: string; bgAlpha: string; varName: string }> = {
  done:        { label: '✓ Done',        bgAlpha: '0.15', varName: '--status-done' },
  in_progress: { label: '⟳ In Progress', bgAlpha: '0.15', varName: '--status-progress' },
  not_started: { label: '○ Not Started', bgAlpha: '0.10', varName: '--status-pending' },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        background: `color-mix(in srgb, var(${c.varName}) ${Math.round(parseFloat(c.bgAlpha) * 100)}%, transparent)`,
        color: `var(${c.varName})`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: `var(${c.varName})` }}
      />
      {c.label}
    </span>
  );
}
