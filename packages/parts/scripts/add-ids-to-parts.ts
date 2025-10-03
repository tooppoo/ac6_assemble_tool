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
  { filename: 'booster.ts', category: 'booster', definePattern: /defineBooster\(\{/g },
  { filename: 'generators.ts', category: 'generator', definePattern: /defineGenerator\(\{/g },
  { filename: 'cores.ts', category: 'core', definePattern: /defineCore\(\{/g },
  { filename: 'arms.ts', category: 'arms', definePattern: /defineArms\(\{/g },
  { filename: 'heads.ts', category: 'head', definePattern: /defineHead\(\{/g },
  { filename: 'legs.ts', category: 'legs', definePattern: /defineLegs/g },
  { filename: 'arm-units.ts', category: 'arm-unit', definePattern: /name: '/g },
  { filename: 'back-units.ts', category: 'back-unit', definePattern: /name: '/g },
]

function addIdsToFile(filepath: string, category: string): void {
  const content = fs.readFileSync(filepath, 'utf-8')
  const code = categoryToCode(category)

  // idフィールドが既に存在するかチェック
  if (content.includes(`id: '${code}`)) {
    console.log(`Skipping ${path.basename(filepath)} - IDs already present`)
    return
  }

  let counter = 1
  const updatedContent = content.replace(/(\s+)(name: ')/g, (match, spaces, namePrefix) => {
    const id = `${code}${String(counter).padStart(3, '0')}`
    counter++
    return `${spaces}id: '${id}',\n${spaces}${namePrefix}`
  })

  fs.writeFileSync(filepath, updatedContent, 'utf-8')
  console.log(`✓ Added ${counter - 1} IDs to ${path.basename(filepath)}`)
}

function main() {
  const srcDir = path.join(__dirname, '..', 'src')

  for (const { filename, category } of FILES) {
    const filepath = path.join(srcDir, filename)
    if (fs.existsSync(filepath)) {
      try {
        addIdsToFile(filepath, category)
      } catch (error) {
        console.error(`Error processing ${filename}:`, error)
      }
    } else {
      console.warn(`File not found: ${filepath}`)
    }
  }
}

main()
