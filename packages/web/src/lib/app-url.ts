const basePath = 'ac6_assemble_tool'

export function appUrl(...paths: string[]): string {
  // Use relative path to avoid hardcoding domains
  return resolve('/', basePath, '/', ...paths)
}

export function publicPath(...paths: string[]): string {
  return resolve('/', basePath, '/', ...paths)
}

function resolve(...paths: string[]): string {
  return paths.join('/').replaceAll(/\/+/g, '/')
}
