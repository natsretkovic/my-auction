import { writeFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const targetPath = './src/environments/environment.ts';

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env variables are missing!');
}

const envConfigFile = `
export const environment = {
  production: false,
  supabaseUrl: '${supabaseUrl}',
  supabaseAnonKey: '${supabaseAnonKey}'
};
`;

writeFileSync(targetPath, envConfigFile);
console.log(`Environment file generated at ${targetPath}`);
