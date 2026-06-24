import { useState, useEffect } from 'react';
import type { Phase, Milestone, TeamRole } from '@/lib/projectData';

export interface ProjectData {
  projectStart: string;
  projectEnd: string;
  today: string;
  phases: Phase[];
  milestones: Milestone[];
  teamRoles: TeamRole[];
  lastUpdated?: string;
}

const DEFAULT: ProjectData = {
  projectStart: '2026-04-01',
  projectEnd: '2026-05-26',
  today: '2026-04-01',
  phases: [],
  milestones: [],
  teamRoles: [],
  lastUpdated: undefined,
};

export function useProjectData() {
  const [data, setData] = useState<ProjectData>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/tasks.json')
      .then(r => r.json())
      .then((json: ProjectData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { data, loading };
}
