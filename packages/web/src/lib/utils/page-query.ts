import { page } from "$app/state"

export const withPageQuery = () =>{
  if (typeof window === 'undefined') {
    return ''
  }
  else {
    return page.url.search
  }
}
