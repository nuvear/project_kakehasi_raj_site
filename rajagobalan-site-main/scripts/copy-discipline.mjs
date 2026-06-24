/**
 * Copies apps/discipline-app/* dist/discipline/ after Vite build.
 * Phase 1: path-based app at https://www.rajagobalan.com/discipline/
 */
import { cpSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'apps', 'discipline-app')
const dest = join(root, 'dist', 'discipline')

if (!existsSync(src)) {
  console.error('copy-discipline: missing', src)
  process.exit(1)
}
mkdirSync(join(root, 'dist'), { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('copy-discipline: copied', src, '→', dest)
