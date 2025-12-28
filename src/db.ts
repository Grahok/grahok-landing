import { PrismaClient } from './generated/prisma/client.js'

import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3'
const adapter = new PrismaBetterSQLite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
