const configs = {
  coverColor: '#62C0CC80',
  paddingColor: '#62D56E80',
  borderColor: '#DDE64880',
  marginColor: '#FC923580',
  mode: 'margin',
}

chrome.storage.sync.get(['coverColor', 'paddingColor', 'borderColor', 'marginColor', 'mode'], values => {
  if (values.coverColor) configs.coverColor = values.coverColor
  if (values.paddingColor) configs.paddingColor = values.paddingColor
  if (values.borderColor) configs.borderColor = values.borderColor
  if (values.marginColor) configs.marginColor = values.marginColor
  if (values.mode) configs.mode = values.mode

  // store default colors
  chrome.storage.sync.set({ coverColor: configs.coverColor })
  chrome.storage.sync.set({ paddingColor: configs.paddingColor })
  chrome.storage.sync.set({ borderColor: configs.borderColor })
  chrome.storage.sync.set({ marginColor: configs.marginColor })
  chrome.storage.sync.set({ mode: configs.mode })
})

chrome.storage.sync.onChanged.addListener(changes => {
  if (changes.coverColor) configs.coverColor = changes.coverColor.newValue
  if (changes.paddingColor) configs.paddingColor = changes.paddingColor.newValue
  if (changes.borderColor) configs.borderColor = changes.borderColor.newValue
  if (changes.marginColor) configs.marginColor = changes.marginColor.newValue
  if (changes.mode) configs.mode = changes.marginColor.mode
})

export default configs
