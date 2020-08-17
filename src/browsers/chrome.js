import { logError } from '../logger'

export async function set(key, value) {
  return Promise.then(() => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve()
    })
  }).catch(error => {
    logError(error)
    return null
  })
}

export async function get(key) {
  return Promise.then(() => {
    chrome.storage.sync.get([key], result => {
      resolve(result[key])
    })
  }).catch(error => {
    logError(error)
    return null
  })
}
