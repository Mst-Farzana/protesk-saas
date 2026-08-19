import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'prisma/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // 🚨 Prisma 7 এ এটা MUST
  earlyAccess: true,

  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  // ✅ datasource.url রাখুন — db push এর জন্য লাগবে
  datasource: {
    url: process.env.DIRECT_URL,
  },

  // ✅ migrate.url রাখুন — migrate dev এর জন্য লাগবে
  migrate: {
    url: process.env.DIRECT_URL,
  },
});
