
import db from '../db';

export interface Filament {
  id?: number;
  type: string;
  color: string;
  quantity: number;
  price: number;
}

export const getFilaments = () => db<Filament>('filaments').select();

export const addFilament = (filament: Filament) => db<Filament>('filaments').insert(filament);
