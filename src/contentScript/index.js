import { appendStyleNode } from './style'
import { findHoveredElement } from './find-element'
import { appendCoverElement } from './cover-element'

function onMousemove(event) {
  const inspectMode = 'paddingAndMargin'
  const hoveredElement = findHoveredElement(event, inspectMode)
  // appendCoverElement(hoveredElement)
}

// appendStyleNode()
window.removeEventListener('mousemove', onMousemove)
window.addEventListener('mousemove', onMousemove)
