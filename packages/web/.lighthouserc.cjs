// 構文上moduleの定義が見つからないのを回避
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/ac6_assemble_tool/'],
      startServerCommand: 'npm run preview',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
