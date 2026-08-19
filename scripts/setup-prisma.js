#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const prismaClientPackagePath = path.join(__dirname, '..', 'node_modules', '@prisma', 'client')
const generatedClientPath = path.join(__dirname, '..', 'node_modules', '.pnpm')

// Find the @prisma/client version directory in pnpm store
let prismaPath = null
if (fs.existsSync(generatedClientPath)) {
  const pnpmDirs = fs.readdirSync(generatedClientPath)
  const prismaDir = pnpmDirs.find(d => d.startsWith('@prisma+client@'))

  if (prismaDir) {
    const generatedDir = path.join(generatedClientPath, prismaDir, 'node_modules', '.prisma')
    prismaPath = generatedDir
  }
}

// If pnpm path not found, try workspace .prisma/client
if (!prismaPath && fs.existsSync(path.join(__dirname, '..', 'node_modules', '.prisma', 'client'))) {
  prismaPath = path.join(__dirname, '..', 'node_modules', '.prisma')
}

if (prismaPath && fs.existsSync(prismaPath)) {
  const symlinkPath = path.join(prismaClientPackagePath, '.prisma')

  // Remove existing symlink or directory
  if (fs.existsSync(symlinkPath)) {
    try {
      const stat = fs.lstatSync(symlinkPath)
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(symlinkPath)
      } else {
        fs.rmSync(symlinkPath, { recursive: true, force: true })
      }
    } catch (e) {
      console.warn('Could not remove existing .prisma path:', e.message)
    }
  }

  // Create symlink
  try {
    // Resolve absolute path for symlink target
    const absolutePrismaPath = path.resolve(prismaPath)
    fs.symlinkSync(absolutePrismaPath, symlinkPath, 'dir')
    console.log('✓ Prisma client symlink created')
  } catch (e) {
    console.warn('Could not create Prisma symlink:', e.message)
  }
}
