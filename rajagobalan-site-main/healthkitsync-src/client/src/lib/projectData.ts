// Task data is loaded from /tasks.json (public/tasks.json)
// To update task statuses or add tasks, edit tasks.json — no code change needed.

export type Status = 'done' | 'in_progress' | 'not_started';

export interface Task {
  id: string;
  name: string;
  role: string;
  start: string;
  end: string;
  status: Status;
  depends?: string[];
}

export interface Phase {
  id: string;
  name: string;
  shortName: string;
  color: string;
  tasks: Task[];
}

export interface Milestone {
  date: string;
  label: string;
  color: string;
}

export interface TeamRole {
  name: string;
  desc: string;
}

export interface ProjectData {
  projectStart: string;
  projectEnd: string;
  today: string;
  phases: Phase[];
  milestones: Milestone[];
  teamRoles: TeamRole[];
}

export function parseDate(s: string): Date {
  return new Date(s + 'T00:00:00');
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
