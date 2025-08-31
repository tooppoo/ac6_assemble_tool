const protocol = 'https://'
const domain = 'ac6-assemble-tool.philomagi.dev'

export function appUrl(...paths: string[]): string {
  return protocol + resolve(domain, '/', ...paths)
}

export function publicPath(...paths: string[]): string {
  return resolve('/', ...paths)
}

function resolve(...paths: string[]): string {
  return paths.join('/').replaceAll(/\/+/g, '/')
}
