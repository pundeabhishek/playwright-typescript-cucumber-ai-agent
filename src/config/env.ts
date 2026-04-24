// Loads environment-driven configuration so URLs, users, and secrets are not
// hardcoded inside tests or page objects.
import * as dotenv from 'dotenv';
import path from 'path';
import { projectRoot } from './project-root';

dotenv.config({ path: path.join(projectRoot, '.env') });

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com/',
  // 'https://opensource-demo.orangehrmlive.com/web/index.php/',
  username: process.env.DEMO_USERNAME ?? 'Admin',
  password: process.env.DEMO_PASSWORD ?? 'admin123'
};
