import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken, clearToken, getToken } from '../lib/api';
import {
  kilnFromApi, kilnToApi,
  clayFromApi, clayToApi,
  glazeFromApi, glazeToApi,
  oxideFromApi, oxideToApi,
  engobeFromApi, engobeToApi,
  pigmentFromApi, pigmentToApi,
  laborRateFromApi, laborRatesToApi,
  pieceFromApi, pieceInputToApi,
} from '../lib/mappers';
import type {
  Kiln, Clay, Glaze, Oxide, Engobe, Pigment,
  LaborRate, Piece, PieceInput,
} from '../types';

// ─── Auth types ───────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface AppState {
  // Auth
  token:       string | null;
  currentUser: AuthUser | null;
  isLoading:   boolean;

  // Data
  kilns:      Kiln[];
  clays:      Clay[];
  glazes:     Glaze[];
  oxides:     Oxide[];
  engobes:    Engobe[];
  pigments:   Pigment[];
  laborRates: LaborRate[];
  pieces:     Piece[];

  // Calc draft
  calcDraft: Partial<PieceInput>;

  // Auth actions
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;

  // Kiln actions
  addKiln:    (k: Omit<Kiln, 'id'>)  => Promise<void>;
  updateKiln: (k: Kiln)              => Promise<void>;
  deleteKiln: (id: string)           => Promise<void>;

  // Clay actions
  addClay:    (c: Omit<Clay, 'id'>)  => Promise<void>;
  updateClay: (c: Clay)              => Promise<void>;
  deleteClay: (id: string)           => Promise<void>;

  // Glaze actions
  addGlaze:    (g: Omit<Glaze, 'id'>)  => Promise<void>;
  updateGlaze: (g: Glaze)              => Promise<void>;
  deleteGlaze: (id: string)            => Promise<void>;

  // Oxide actions
  addOxide:    (o: Omit<Oxide, 'id'>)  => Promise<void>;
  updateOxide: (o: Oxide)              => Promise<void>;
  deleteOxide: (id: string)            => Promise<void>;

  // Engobe actions
  addEngobe:    (e: Omit<Engobe, 'id'>)  => Promise<void>;
  updateEngobe: (e: Engobe)              => Promise<void>;
  deleteEngobe: (id: string)             => Promise<void>;

  // Pigment actions
  addPigment:    (p: Omit<Pigment, 'id'>)  => Promise<void>;
  updatePigment: (p: Pigment)              => Promise<void>;
  deletePigment: (id: string)              => Promise<void>;

  // Labor rate actions
  updateLaborRate: (rate: LaborRate)       => Promise<void>;

  // Piece actions
  savePiece: (input: PieceInput) => Promise<Piece>;

  // Calc draft
  setCalcDraft:   (patch: Partial<PieceInput>) => void;
  resetCalcDraft: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>((set, get) => ({
  token:       null,
  currentUser: null,
  isLoading:   false,

  kilns:      [],
  clays:      [],
  glazes:     [],
  oxides:     [],
  engobes:    [],
  pigments:   [],
  laborRates: [],
  pieces:     [],
  calcDraft:  {},

  // ── Auth ────────────────────────────────────────────────────────────────────

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.post<any>('/auth/login', { email, password });
      await setToken(data.token);
      set({ token: data.token, currentUser: data.user, isLoading: false });
      await loadAllData();
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.post<any>('/auth/register', { name, email, password });
      await setToken(data.token);
      set({ token: data.token, currentUser: data.user, isLoading: false });
      await loadAllData();
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await clearToken();
    set({
      token: null, currentUser: null,
      kilns: [], clays: [], glazes: [], oxides: [],
      engobes: [], pigments: [], laborRates: [], pieces: [],
      calcDraft: {},
    });
  },

  // ── Kilns ───────────────────────────────────────────────────────────────────

  addKiln: async (k) => {
    const tempId = uid();
    set(s => ({ kilns: [...s.kilns, { ...k, id: tempId }] }));
    try {
      const saved = await api.post<any>('/kilns', kilnToApi(k));
      set(s => ({ kilns: s.kilns.map(x => x.id === tempId ? kilnFromApi(saved) : x) }));
    } catch {
      set(s => ({ kilns: s.kilns.filter(x => x.id !== tempId) }));
    }
  },

  updateKiln: async (k) => {
    const prev = get().kilns.find(x => x.id === k.id);
    set(s => ({ kilns: s.kilns.map(x => x.id === k.id ? k : x) }));
    try {
      const saved = await api.put<any>(`/kilns/${k.id}`, kilnToApi(k));
      set(s => ({ kilns: s.kilns.map(x => x.id === k.id ? kilnFromApi(saved) : x) }));
    } catch {
      if (prev) set(s => ({ kilns: s.kilns.map(x => x.id === k.id ? prev : x) }));
    }
  },

  deleteKiln: async (id) => {
    const prev = get().kilns;
    set(s => ({ kilns: s.kilns.filter(x => x.id !== id) }));
    try {
      await api.delete(`/kilns/${id}`);
    } catch (e) {
      set({ kilns: prev });
      throw e;
    }
  },

  // ── Clays ───────────────────────────────────────────────────────────────────

  addClay: async (c) => {
    const tempId = uid();
    set(s => ({ clays: [...s.clays, { ...c, id: tempId }] }));
    try {
      const saved = await api.post<any>('/clays', clayToApi(c));
      set(s => ({ clays: s.clays.map(x => x.id === tempId ? clayFromApi(saved) : x) }));
    } catch {
      set(s => ({ clays: s.clays.filter(x => x.id !== tempId) }));
    }
  },

  updateClay: async (c) => {
    const prev = get().clays.find(x => x.id === c.id);
    set(s => ({ clays: s.clays.map(x => x.id === c.id ? c : x) }));
    try {
      const saved = await api.put<any>(`/clays/${c.id}`, clayToApi(c));
      set(s => ({ clays: s.clays.map(x => x.id === c.id ? clayFromApi(saved) : x) }));
    } catch {
      if (prev) set(s => ({ clays: s.clays.map(x => x.id === c.id ? prev : x) }));
    }
  },

  deleteClay: async (id) => {
    const prev = get().clays;
    set(s => ({ clays: s.clays.filter(x => x.id !== id) }));
    try {
      await api.delete(`/clays/${id}`);
    } catch (e) {
      set({ clays: prev });
      throw e;
    }
  },

  // ── Glazes ──────────────────────────────────────────────────────────────────

  addGlaze: async (g) => {
    const tempId = uid();
    set(s => ({ glazes: [...s.glazes, { ...g, id: tempId }] }));
    try {
      const saved = await api.post<any>('/glazes', glazeToApi(g));
      set(s => ({ glazes: s.glazes.map(x => x.id === tempId ? glazeFromApi(saved) : x) }));
    } catch {
      set(s => ({ glazes: s.glazes.filter(x => x.id !== tempId) }));
    }
  },

  updateGlaze: async (g) => {
    const prev = get().glazes.find(x => x.id === g.id);
    set(s => ({ glazes: s.glazes.map(x => x.id === g.id ? g : x) }));
    try {
      const saved = await api.put<any>(`/glazes/${g.id}`, glazeToApi(g));
      set(s => ({ glazes: s.glazes.map(x => x.id === g.id ? glazeFromApi(saved) : x) }));
    } catch {
      if (prev) set(s => ({ glazes: s.glazes.map(x => x.id === g.id ? prev : x) }));
    }
  },

  deleteGlaze: async (id) => {
    const prev = get().glazes;
    set(s => ({ glazes: s.glazes.filter(x => x.id !== id) }));
    try {
      await api.delete(`/glazes/${id}`);
    } catch (e) {
      set({ glazes: prev });
      throw e;
    }
  },

  // ── Oxides ──────────────────────────────────────────────────────────────────

  addOxide: async (o) => {
    const tempId = uid();
    set(s => ({ oxides: [...s.oxides, { ...o, id: tempId }] }));
    try {
      const saved = await api.post<any>('/oxides', oxideToApi(o));
      set(s => ({ oxides: s.oxides.map(x => x.id === tempId ? oxideFromApi(saved) : x) }));
    } catch {
      set(s => ({ oxides: s.oxides.filter(x => x.id !== tempId) }));
    }
  },

  updateOxide: async (o) => {
    const prev = get().oxides.find(x => x.id === o.id);
    set(s => ({ oxides: s.oxides.map(x => x.id === o.id ? o : x) }));
    try {
      const saved = await api.put<any>(`/oxides/${o.id}`, oxideToApi(o));
      set(s => ({ oxides: s.oxides.map(x => x.id === o.id ? oxideFromApi(saved) : x) }));
    } catch {
      if (prev) set(s => ({ oxides: s.oxides.map(x => x.id === o.id ? prev : x) }));
    }
  },

  deleteOxide: async (id) => {
    const prev = get().oxides;
    set(s => ({ oxides: s.oxides.filter(x => x.id !== id) }));
    try {
      await api.delete(`/oxides/${id}`);
    } catch (e) {
      set({ oxides: prev });
      throw e;
    }
  },

  // ── Engobes ─────────────────────────────────────────────────────────────────

  addEngobe: async (e) => {
    const tempId = uid();
    set(s => ({ engobes: [...s.engobes, { ...e, id: tempId }] }));
    try {
      const saved = await api.post<any>('/engobes', engobeToApi(e));
      set(s => ({ engobes: s.engobes.map(x => x.id === tempId ? engobeFromApi(saved) : x) }));
    } catch {
      set(s => ({ engobes: s.engobes.filter(x => x.id !== tempId) }));
    }
  },

  updateEngobe: async (e) => {
    const prev = get().engobes.find(x => x.id === e.id);
    set(s => ({ engobes: s.engobes.map(x => x.id === e.id ? e : x) }));
    try {
      const saved = await api.put<any>(`/engobes/${e.id}`, engobeToApi(e));
      set(s => ({ engobes: s.engobes.map(x => x.id === e.id ? engobeFromApi(saved) : x) }));
    } catch {
      if (prev) set(s => ({ engobes: s.engobes.map(x => x.id === e.id ? prev : x) }));
    }
  },

  deleteEngobe: async (id) => {
    const prev = get().engobes;
    set(s => ({ engobes: s.engobes.filter(x => x.id !== id) }));
    try {
      await api.delete(`/engobes/${id}`);
    } catch (e) {
      set({ engobes: prev });
      throw e;
    }
  },

  // ── Pigments ─────────────────────────────────────────────────────────────────

  addPigment: async (p) => {
    const tempId = uid();
    set(s => ({ pigments: [...s.pigments, { ...p, id: tempId }] }));
    try {
      const saved = await api.post<any>('/pigments', pigmentToApi(p));
      set(s => ({ pigments: s.pigments.map(x => x.id === tempId ? pigmentFromApi(saved) : x) }));
    } catch {
      set(s => ({ pigments: s.pigments.filter(x => x.id !== tempId) }));
    }
  },

  updatePigment: async (p) => {
    const prev = get().pigments.find(x => x.id === p.id);
    set(s => ({ pigments: s.pigments.map(x => x.id === p.id ? p : x) }));
    try {
      const saved = await api.put<any>(`/pigments/${p.id}`, pigmentToApi(p));
      set(s => ({ pigments: s.pigments.map(x => x.id === p.id ? pigmentFromApi(saved) : x) }));
    } catch {
      if (prev) set(s => ({ pigments: s.pigments.map(x => x.id === p.id ? prev : x) }));
    }
  },

  deletePigment: async (id) => {
    const prev = get().pigments;
    set(s => ({ pigments: s.pigments.filter(x => x.id !== id) }));
    try {
      await api.delete(`/pigments/${id}`);
    } catch (e) {
      set({ pigments: prev });
      throw e;
    }
  },

  // ── Labor rates ──────────────────────────────────────────────────────────────

  updateLaborRate: async (rate) => {
    const prev = get().laborRates;
    const next = prev.map(r => r.level === rate.level ? rate : r);
    set({ laborRates: next });
    try {
      const saved = await api.put<any[]>('/labor-rates', laborRatesToApi(next));
      set({ laborRates: saved.map(laborRateFromApi) });
    } catch {
      set({ laborRates: prev });
    }
  },

  // ── Pieces ───────────────────────────────────────────────────────────────────

  savePiece: async (input) => {
    const dto = pieceInputToApi(input);
    const saved = await api.post<any>('/pieces', dto);
    const piece = pieceFromApi(saved);
    set(s => ({ pieces: [piece, ...s.pieces] }));
    return piece;
  },

  // ── Calc draft ───────────────────────────────────────────────────────────────

  setCalcDraft:   (patch) => set(s => ({ calcDraft: { ...s.calcDraft, ...patch } })),
  resetCalcDraft: ()      => set({ calcDraft: {} }),
}));

// ─── Load all data from API ────────────────────────────────────────────────────

async function loadAllData() {
  const keys = ['kilns', 'clays', 'glazes', 'oxides', 'engobes', 'pigments', 'labor-rates', 'pieces'] as const;
  const paths = [
    '/kilns', '/clays', '/glazes', '/oxides', '/engobes', '/pigments',
    '/labor-rates', '/pieces?limit=20',
  ];

  const results = await Promise.allSettled(paths.map(p => api.get<any>(p)));

  results.forEach((r, i) => {
    if (r.status === 'rejected') console.warn(`[loadAllData] ${paths[i]} failed:`, r.reason);
  });

  const val = (i: number) => results[i].status === 'fulfilled' ? (results[i] as any).value : null;

  const kilns      = val(0);
  const clays      = val(1);
  const glazes     = val(2);
  const oxides     = val(3);
  const engobes    = val(4);
  const pigments   = val(5);
  const laborRates = val(6);
  const piecesRaw  = val(7);

  useStore.setState({
    ...(kilns      && { kilns:      (kilns      as any[]).map(kilnFromApi)      }),
    ...(clays      && { clays:      (clays      as any[]).map(clayFromApi)      }),
    ...(glazes     && { glazes:     (glazes     as any[]).map(glazeFromApi)     }),
    ...(oxides     && { oxides:     (oxides     as any[]).map(oxideFromApi)     }),
    ...(engobes    && { engobes:    (engobes    as any[]).map(engobeFromApi)    }),
    ...(pigments   && { pigments:   (pigments   as any[]).map(pigmentFromApi)   }),
    ...(laborRates && { laborRates: (laborRates as any[]).map(laborRateFromApi) }),
    ...(piecesRaw  && { pieces: (Array.isArray(piecesRaw) ? piecesRaw : (piecesRaw?.items ?? piecesRaw?.data ?? [])).map(pieceFromApi) }),
  });
}

// ─── Hydrate on app startup ────────────────────────────────────────────────────

export async function hydrateStore() {
  const token = await getToken();
  if (!token) return;

  try {
    useStore.setState({ token, isLoading: true });
    const user = await api.get<any>('/users/me');
    useStore.setState({ currentUser: user, isLoading: false });
    await loadAllData();
  } catch {
    await clearToken();
    useStore.setState({ token: null, currentUser: null, isLoading: false });
  }
}
