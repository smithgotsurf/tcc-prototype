import { useState, useCallback } from "react";
import { SEED_ESTIMATES } from "./data";

const STORAGE_KEY = "tcc-estimates";

function loadEstimates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveEstimates(estimates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates));
}

export default function useEstimates() {
  const [estimates, setEstimates] = useState(() => loadEstimates() || SEED_ESTIMATES);

  const persist = useCallback((next) => {
    setEstimates(next);
    saveEstimates(next);
  }, []);

  const addEstimate = useCallback((est) => {
    persist([est, ...estimates]);
  }, [estimates, persist]);

  const updateEstimate = useCallback((updated) => {
    const next = estimates.map(e => e.id === updated.id ? updated : e);
    persist(next);
  }, [estimates, persist]);

  const getEstimate = useCallback((id) => {
    return estimates.find(e => e.id === id) || null;
  }, [estimates]);

  const nextId = useCallback(() => {
    const year = new Date().getFullYear();
    const nums = estimates
      .map(e => e.id)
      .filter(id => id.startsWith(`EST-${year}-`))
      .map(id => parseInt(id.split("-")[2], 10))
      .filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `EST-${year}-${String(next).padStart(3, "0")}`;
  }, [estimates]);

  const resetData = useCallback(() => {
    persist(SEED_ESTIMATES);
  }, [persist]);

  return { estimates, addEstimate, updateEstimate, getEstimate, nextId, resetData };
}
