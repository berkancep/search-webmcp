import { useEffect, useRef, useState } from 'react';
import { initialState, validatePatch } from '../server/search.mjs';
import type { State, Result } from './types';

function readURL(): State {
  try {
    const p = Object.fromEntries(new URLSearchParams(location.search));
    const o: Record<string, unknown> = { ...p };
    for (const k of ['page', 'maxPrice']) if (k in o) o[k] = Number(o[k]);
    return { ...initialState, ...validatePatch(o) };
  } catch {
    return { ...initialState };
  }
}

export function useSearch() {
  const [state, setState] = useState<State>(readURL);
  const [data, setData] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(state.q);
  const [price, setPrice] = useState(state.maxPrice?.toString() || '');
  const current = useRef(state);
  const serial = useRef(0);
  const active = useRef<AbortController | null>(null);
  const latest = useRef<Result | null>(null);
  async function run(next: State, write = true) {
    validatePatch(next);
    const id = ++serial.current;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    current.current = next;
    setState(next);
    setQuery(next.q);
    setPrice(next.maxPrice?.toString() || '');
    setBusy(true);
    setError('');
    if (write) {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(next))
        if (
          v !== null &&
          v !== '' &&
          v !== initialState[k as keyof typeof initialState]
        )
          p.set(k, String(v));
      history.pushState(null, '', location.pathname + (p.size ? '?' + p : ''));
    }
    try {
      const res = await fetch(
        '/api/search?state=' + encodeURIComponent(JSON.stringify(next)),
        { signal: controller.signal },
      );
      const result = await res.json();
      if (!res.ok) throw Error(result.error);
      if (id !== serial.current)
        return { error: 'Yeni arama tarafından geçersiz kılındı.' };
      latest.current = result;
      setData(result);
      return result;
    } catch (e) {
      if (id !== serial.current)
        return { error: 'Yeni arama tarafından geçersiz kılındı.' };
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      return { error: message };
    } finally {
      if (id === serial.current) setBusy(false);
    }
  }
  useEffect(() => {
    void run(current.current, false);
    const pop = () => void run(readURL(), false);
    addEventListener('popstate', pop);
    return () => {
      removeEventListener('popstate', pop);
      active.current?.abort();
    };
  }, []);
  const patch = (p: Partial<State>) =>
    run({ ...current.current, ...p, page: p.page ?? 1 });
  const clearFilters = (
    fields: ('color' | 'size' | 'maxPrice')[] = ['color', 'size', 'maxPrice'],
  ) =>
    patch(
      Object.fromEntries(
        fields.map((field) => [field, field === 'maxPrice' ? null : '']),
      ),
    );
  return {
    state,
    data,
    busy,
    error,
    query,
    setQuery,
    price,
    setPrice,
    current,
    latest,
    run,
    patch,
    clearFilters,
  };
}
