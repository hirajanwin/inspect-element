import { findHoveredElement } from './find-element'
import { appendCoverElement, removeCoverElement } from './cover-element'

const isKeyCombinationActive = () => {
  return event.metaKey
}
const onMousemove = event => {
  if (!event || !event.target || event.target === document || isKeyCombinationActive(event) === false) {
    removeCoverElement()
    return
  }

  const target = findHoveredElement(event)

  if (event && event.target && event.target.dataset && event.target.dataset.inspectElement) {
    // remove covered element first if move mouse over it
    removeCoverElement()

    requestAnimationFrame(() => {
      appendCoverElement(target)
    })
  } else {
    appendCoverElement(target)
  }
}

// appendStyleNode()
window.removeEventListener('mousemove', onMousemove)
window.addEventListener('mousemove', onMousemove)
