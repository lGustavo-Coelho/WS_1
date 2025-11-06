
import { create } from 'zustand';
import { Filament, getFilaments, addFilament } from '../services/filamentService';

interface FilamentState {
  filaments: Filament[];
  fetchFilaments: () => Promise<void>;
  addFilament: (filament: Filament) => Promise<void>;
}

export const useFilamentStore = create<FilamentState>((set) => ({
  filaments: [],
  fetchFilaments: async () => {
    const filaments = await getFilaments();
    set({ filaments });
  },
  addFilament: async (filament) => {
    await addFilament(filament);
    const filaments = await getFilaments();
    set({ filaments });
  },
}));
