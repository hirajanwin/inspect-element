// Find and return the hovered element based on the inspect mode.
export function findHoveredElement(event, inspectMode) {

  if (inspectMode === 'normal') return event.target
  if (inspectMode === 'paddingAndMargin') {
    
    const scope = getPaddingAndMargin(event.target)
    const node = event.target.getBoundingClientRect()
    const cursorX = event.clientX
    const cursorY = event.clientY
    iterateNode(event.target)
  
    // // ===margin===
    // // 上
    // if ((node.top - scope.margin.top) < cursorY && cursorY < node.top) {
    //   console.log(true)
    // }
    // // 下
    // if (node.bottom < cursorY && cursorY < (node.bottom + scope.margin.bottom)) {
    //   console.log(true)
    // }
    // // 左
    // if ((node.left - scope.margin.left) < cursorX && cursorX < node.left) {
    //   console.log(true)
    // }
    // // 右
    // if ( node.right < cursorX && cursorX < (node.right + scope.margin.right)) {
    //   console.log(true)
    // }
  
    // // ===padding===
    // // top
    // if (node.top < cursorY && cursorY < (node.top + scope.padding.top)) {
    //   console.log('paddingTop')
    // }
    // // bottom
    // if ((node.bottom - scope.padding.bottom) < cursorY && cursorY < node.bottom) {
    //   console.log('paddingbottom')
    // }
    // // left
    // if (node.left < cursorX && cursorX < (node.left + scope.padding.left)) {
    //   console.log('paddingleft')
    // }
    // // right
    // if ((node.right - scope.padding.right) < cursorX && cursorX < node.right) {
    //   console.log('paddingright')
    // }
  }

}

// get padding and margin
function getPaddingAndMargin(node) {
  return {
    margin: {
      top: parseInt(window.getComputedStyle(node).marginTop.replace(/[^0-9]/ig, ''), 10),
      left: parseInt(window.getComputedStyle(node).marginLeft.replace(/[^0-9]/ig, ''), 10),
      right: parseInt(window.getComputedStyle(node).marginRight.replace(/[^0-9]/ig, ''), 10),
      bottom: parseInt(window.getComputedStyle(node).marginBottom.replace(/[^0-9]/ig, ''), 10),
    },
    padding: {
      top: parseInt(window.getComputedStyle(node).paddingTop.replace(/[^0-9]/ig, ''), 10),
      left: parseInt(window.getComputedStyle(node).paddingLeft.replace(/[^0-9]/ig, ''), 10),
      right: parseInt(window.getComputedStyle(node).paddingRight.replace(/[^0-9]/ig, ''), 10),
      bottom: parseInt(window.getComputedStyle(node).paddingBottom.replace(/[^0-9]/ig, ''), 10),
    }
  }
}

function iterateNode (paraentNode) {
  for (let node in paraentNode) {
    if (calcMarginScope(paraentNode.children[index])) return paraentNode.children[index]
    if (index === paraentNode.children.length - 1) iterateNode(paraentNode.children[0])
  }
  
  if (paraentNode.length === 0) {
    console.log('end')
    return
  }
  
}

function calcMarginScope (node) {
  console.log('calcMarginScope')
}