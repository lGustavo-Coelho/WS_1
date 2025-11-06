import { Knex } from 'knex';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('users').del();
  await knex('settings').del();

  // Insert default admin user
  await knex('users').insert({
    id: 'user-admin-001',
    email: 'admin@3dmanagement.local',
    password_hash: hashPassword('admin123'),
    name: 'Administrator',
    role: 'admin',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Insert default settings
  await knex('settings').insert({
    id: 'settings-default',
    currency: 'BRL',
    language: 'pt-BR',
    energy_cost_per_kwh: 0.75,
    labor_cost_per_hour: 50.0,
    default_profit_margin: 40.0,
    company_name: '3D Management',
    company_email: 'contato@3dmanagement.local',
    updated_at: new Date().toISOString(),
  });

  console.log('Seeds completed successfully');
}
