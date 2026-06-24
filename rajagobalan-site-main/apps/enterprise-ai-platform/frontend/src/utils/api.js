// API client for the AI Transformation Command Center
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BASE = `${API_BASE}/api`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return options.responseType === 'blob' ? res.blob() : res.json();
}

// ─── Projects ───
export const getProjects = (companyId) =>
  request(`${BASE}/projects?company_id=${companyId}`);

export const createProject = (data) =>
  request(`${BASE}/projects`, { method: 'POST', body: JSON.stringify(data) });

export const updateProject = (id, data) =>
  request(`${BASE}/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProject = (id) =>
  request(`${BASE}/projects/${id}`, { method: 'DELETE' });

// ─── Discovery ───
export const generateDiscovery = (data) =>
  request(`${BASE}/discovery/generate`, { method: 'POST', body: JSON.stringify(data) });

// ─── Maturity ───
export const submitMaturityAssessment = (data) =>
  request(`${BASE}/maturity/assess`, { method: 'POST', body: JSON.stringify(data) });

export const getMaturityResults = (companyId) =>
  request(`${BASE}/maturity/${companyId}`);

// ─── ROI ───
export const simulateROI = (data) =>
  request(`${BASE}/roi/simulate`, { method: 'POST', body: JSON.stringify(data) });

// ─── Architecture ───
export const generateArchitecture = (data) =>
  request(`${BASE}/architecture/generate`, { method: 'POST', body: JSON.stringify(data) });

// ─── Roadmap ───
export const generateRoadmap = (data) =>
  request(`${BASE}/roadmap/generate`, { method: 'POST', body: JSON.stringify(data) });

// ─── Wardley ───
export const generateWardley = (data) =>
  request(`${BASE}/wardley/generate`, { method: 'POST', body: JSON.stringify(data) });

// ─── Slides ───
export const exportSlides = (data) =>
  request(`${BASE}/slides/export`, { method: 'POST', body: JSON.stringify(data), responseType: 'blob' });

// ─── Health ───
export const checkHealth = () =>
  request(`${BASE}/health`);
