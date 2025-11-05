// API service helper for MagicScool frontend.
//
// This module centralizes API request logic. It resolves the base URL
// using environment variables in a way that supports multiple
// deployment scenarios: Vite env, global window override and
// fallback to localhost during development. Feel free to extend
// these methods (e.g. add auth headers) as your frontend grows.

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && window.__API_BASE_URL) ||
  'http://localhost:5000/api';

async function request(method, url, data = undefined) {
  const opts = { method, headers: {} };
  if (data !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }
  const resp = await fetch(`${API_BASE_URL}${url}`, opts);
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.error || resp.statusText);
  }
  return resp.json();
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url) => request('DELETE', url),
};

export default api;