import { spawnSync } from 'node:child_process'

spawnSync('npm', ['run', 'sync'], { stdio: 'inherit' })
