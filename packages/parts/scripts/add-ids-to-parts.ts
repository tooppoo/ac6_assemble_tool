/**
 * 全パーツファイルにIDを自動追加するスクリプト
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { categoryToCode } from './generate-part-id'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface FileConfig {
  filename: string
  category: string
  definePattern: RegExp
}

const FILES: FileConfig[] = [
  {
    filename: 'booster.ts',
    category: 'booster',
    definePattern: /defineBooster\(\{/g,
  },
  {
    filename: 'generators.ts',
    category: 'generator',
    definePattern: /defineGenerator\(\{/g,
  },
  { filename: 'cores.ts', category: 'core', definePattern: /defineCore\(\{/g },
  { filename: 'arms.ts', category: 'arms', definePattern: /defineArms\(\{/g },
  { filename: 'heads.ts', category: 'head', definePattern: /defineHead\(\{/g },
  { filename: 'legs.ts', category: 'legs', definePattern: /defineLegs/g },
  { filename: 'arm-units.ts', category: 'arm-unit', definePattern: /name: '/g },
  {
    filename: 'back-units.ts',
    category: 'back-unit',
    definePattern: /name: '/g,
  },
]

function addIdsToFile(filepath: string, config: FileConfig): void {
  const content = fs.readFileSync(filepath, 'utf-8')
  const code = categoryToCode(config.category)

  // idフィールドが既に存在するかチェック
  if (content.includes(`id: '${code}`)) {
    console.log(`Skipping ${path.basename(filepath)} - IDs already present`)
    return
  }

  let counter = 1
  const updatedContent = content.replace(
    config.definePattern,
    (match) => {
      const id = `${code}${String(counter).padStart(3, '0')}`
      counter++
      return `${match}\n  id: '${id}',`
    },
  )

  fs.writeFileSync(filepath, updatedContent, 'utf-8')
  console.log(`✓ Added ${counter - 1} IDs to ${path.basename(filepath)}`)
}

function main() {
  const srcDir = path.join(__dirname, '..', 'src')

  for (const config of FILES) {
    const filepath = path.join(srcDir, config.filename)
    if (fs.existsSync(filepath)) {
      try {
        addIdsToFile(filepath, config)
      } catch (error) {
        console.error(`Error processing ${config.filename}:`, error)
      }
    } else {
      console.warn(`File not found: ${filepath}`)
    }
  }
}

main()
