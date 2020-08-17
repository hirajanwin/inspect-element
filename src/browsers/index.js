import { get as chromeGet, set as chromeSet } from './chrome'

export function get (...args) {
  return chromeGet(...args)
}

export function set (...args) {
  return chromeSet(...args)
}
