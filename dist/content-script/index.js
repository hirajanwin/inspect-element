(function () {
  'use strict';

  let mode = 'content';
  chrome.storage.sync.get(['mode'], ({ mode: _mode }) => {
    if (_mode) mode = _mode;
  });
  chrome.storage.sync.onChanged.addListener(changes => {
    if (changes.mode && changes.mode.newValue) mode = changes.mode.newValue;
  });

  // Find and return the hovered element based on the inspect mode.
  function findHoveredElement(event) {
    if (mode === 'content') return event.target

    const element = isInElement(event, event.target);
    if (element) return element

    return event.target
  }

  const isInElement = (event, element) => {
    const children = element.children;
    if (children.length) {
      for (const child of Array.from(children)) {
        const element = isInElement(event, child);
        if (element) return element
      }
    }

    const computedStyle = getComputedStyle(element);
    const boundingClientRect = element.getBoundingClientRect();

    const boundingMarginRect = getBoundingMarginRect(computedStyle, boundingClientRect);
    const inMarginRect = isInRect(event, boundingMarginRect);
    if (inMarginRect === false) return null

    const boundingBorderRect = getBoundingBorderRect(computedStyle, boundingClientRect);
    const inBorderRect = isInRect(event, boundingBorderRect);
    if (inBorderRect === false) return element

    // not found
    return null
  };

  const isInRect = (event, rect) => {
    const clientY = event.clientY;
    const clientX = event.clientX;
    return clientY > rect.top && clientX < rect.right && clientY < rect.bottom && clientX > rect.left
  };

  const getBoundingBorderRect = (computedStyle, boundingClientRect) => {
    let top = boundingClientRect.top;
    let right = boundingClientRect.right;
    let bottom = boundingClientRect.bottom;
    let left = boundingClientRect.left;

    if (computedStyle.boxSizing === 'content-box') {
      top -= parseInt(computedStyle.paddingTop, 10);
      right += parseInt(computedStyle.paddingRight, 10);
      bottom += parseInt(computedStyle.paddingBottom, 10);
      left -= parseInt(computedStyle.paddingLeft, 10);

      top -= parseInt(computedStyle.borderTopWidth, 10);
      right += parseInt(computedStyle.borderRightWidth, 10);
      bottom += parseInt(computedStyle.borderBottomWidth, 10);
      left -= parseInt(computedStyle.borderLeftWidth, 10);
    }

    return {
      top,
      right,
      bottom,
      left,
      x: left,
      y: top,
      height: bottom - top,
      width: right - left,
    }
  };

  const getBoundingMarginRect = (computedStyle, boundingClientRect) => {
    let top = boundingClientRect.top;
    let right = boundingClientRect.right;
    let bottom = boundingClientRect.bottom;
    let left = boundingClientRect.left;

    top -= parseInt(computedStyle.marginTop, 10);
    right += parseInt(computedStyle.marginRight, 10);
    bottom += parseInt(computedStyle.marginBottom, 10);
    left -= parseInt(computedStyle.marginLeft, 10);

    if (computedStyle.boxSizing === 'content-box') {
      top -= parseInt(computedStyle.paddingTop, 10);
      right += parseInt(computedStyle.paddingRight, 10);
      bottom += parseInt(computedStyle.paddingBottom, 10);
      left -= parseInt(computedStyle.paddingLeft, 10);

      top -= parseInt(computedStyle.borderTopWidth, 10);
      right += parseInt(computedStyle.borderRightWidth, 10);
      bottom += parseInt(computedStyle.borderBottomWidth, 10);
      left -= parseInt(computedStyle.borderLeftWidth, 10);
    }

    return {
      top,
      right,
      bottom,
      left,
      x: left,
      y: top,
      height: bottom - top,
      width: right - left,
    }
  };

  const configs = {
    coverColor: '#62C0CC80',
    paddingColor: '#62D56E80',
    borderColor: '#DDE64880',
    marginColor: '#FC923580',
    mode: 'margin',
  };

  chrome.storage.sync.get(['coverColor', 'paddingColor', 'borderColor', 'marginColor', 'mode'], values => {
    if (values.coverColor) configs.coverColor = values.coverColor;
    if (values.paddingColor) configs.paddingColor = values.paddingColor;
    if (values.borderColor) configs.borderColor = values.borderColor;
    if (values.marginColor) configs.marginColor = values.marginColor;
    if (values.mode) configs.mode = values.mode;

    // store default colors
    chrome.storage.sync.set({ coverColor: configs.coverColor });
    chrome.storage.sync.set({ paddingColor: configs.paddingColor });
    chrome.storage.sync.set({ borderColor: configs.borderColor });
    chrome.storage.sync.set({ marginColor: configs.marginColor });
    chrome.storage.sync.set({ mode: configs.mode });
  });

  chrome.storage.sync.onChanged.addListener(changes => {
    if (changes.coverColor) configs.coverColor = changes.coverColor.newValue;
    if (changes.paddingColor) configs.paddingColor = changes.paddingColor.newValue;
    if (changes.borderColor) configs.borderColor = changes.borderColor.newValue;
    if (changes.marginColor) configs.marginColor = changes.marginColor.newValue;
    if (changes.mode) configs.mode = changes.marginColor.mode;
  });

  // all use the content box to compute top, width, etc.

  const setCoverStyle = (element, computedStyle, boundingClicentRect) => {
    element.style.backgroundColor = configs.coverColor;
    element.style.top = getContentTop(computedStyle, boundingClicentRect) + 'px';
    element.style.left = getContentLeft(computedStyle, boundingClicentRect) + 'px';
    element.style.height = getContentHeight(computedStyle, boundingClicentRect) + 'px';
    element.style.width = getContentWidth(computedStyle, boundingClicentRect) + 'px';
  };

  const setPaddingStyle = (element, computedStyle, boundingClicentRect) => {
    element.style.top = getContentTop(computedStyle, boundingClicentRect) - getPaddingTop(computedStyle) + 'px';
    element.style.left = getContentLeft(computedStyle, boundingClicentRect) - getPaddingLeft(computedStyle) + 'px';
    element.style.height = getContentHeight(computedStyle, boundingClicentRect) + 'px';
    element.style.width = getContentWidth(computedStyle, boundingClicentRect) + 'px';
    element.style.borderColor = configs.paddingColor;
    element.style.borderTopWidth = getPaddingTop(computedStyle) + 'px';
    element.style.borderRightWidth = getPaddingRight(computedStyle) + 'px';
    element.style.borderBottomWidth = getPaddingBottom(computedStyle) + 'px';
    element.style.borderLeftWidth = getPaddingLeft(computedStyle) + 'px';
  };

  const setBorderStyle = (element, computedStyle, boundingClicentRect) => {
    element.style.top =
      getContentTop(computedStyle, boundingClicentRect) -
      getPaddingTop(computedStyle) -
      getBorderTopWidth(computedStyle) +
      'px';
    element.style.left =
      getContentLeft(computedStyle, boundingClicentRect) -
      getPaddingLeft(computedStyle) -
      getBorderLeftWidth(computedStyle) +
      'px';
    element.style.height =
      getContentHeight(computedStyle, boundingClicentRect) +
      getPaddingTop(computedStyle) +
      getPaddingBottom(computedStyle) +
      'px';
    element.style.width =
      getContentWidth(computedStyle, boundingClicentRect) +
      getPaddingRight(computedStyle) +
      getPaddingLeft(computedStyle) +
      'px';
    element.style.borderColor = configs.borderColor;
    element.style.borderTopWidth = getBorderTopWidth(computedStyle) + 'px';
    element.style.borderRightWidth = getBorderRightWidth(computedStyle) + 'px';
    element.style.borderBottomWidth = getBorderBottomWidth(computedStyle) + 'px';
    element.style.borderLeftWidth = getBorderLeftWidth(computedStyle) + 'px';
  };

  const setMarginStyle = (element, computedStyle, boundingClicentRect) => {
    element.style.top =
      getContentTop(computedStyle, boundingClicentRect) -
      getPaddingTop(computedStyle) -
      getBorderTopWidth(computedStyle) -
      getMarginTop(computedStyle) +
      'px';
    element.style.left =
      getContentLeft(computedStyle, boundingClicentRect) -
      getPaddingLeft(computedStyle) -
      getBorderLeftWidth(computedStyle) -
      getMarginLeft(computedStyle) +
      'px';
    element.style.height =
      getContentHeight(computedStyle, boundingClicentRect) +
      getPaddingTop(computedStyle) +
      getPaddingBottom(computedStyle) +
      getBorderTopWidth(computedStyle) +
      getBorderBottomWidth(computedStyle) +
      'px';
    element.style.width =
      getContentWidth(computedStyle, boundingClicentRect) +
      getPaddingRight(computedStyle) +
      getPaddingLeft(computedStyle) +
      getBorderRightWidth(computedStyle) +
      getBorderLeftWidth(computedStyle) +
      'px';
    element.style.borderColor = configs.marginColor;
    element.style.borderTopWidth = getMarginTop(computedStyle) + 'px';
    element.style.borderRightWidth = getMarginRight(computedStyle) + 'px';
    element.style.borderBottomWidth = getMarginBottom(computedStyle) + 'px';
    element.style.borderLeftWidth = getMarginLeft(computedStyle) + 'px';
  };

  const createElement = id => {
    const element = document.createElement('DIV');
    setCommonStyle(element, id);
    return element
  };

  const setCommonStyle = (element, id) => {
    element.dataset['inspectElement'] = 'inspectElement';
    element.id = `inspect-element-${id}`;
    element.style.position = 'fixed';
    element.style.zIndex = 9999;
    element.style.pointerEvents = 'none';
    element.style.backgroundColor = 'transparent';
    element.style.borderStyle = 'solid';
    element.style.borderWidth = '0px';
    element.style.borderColor = 'transparent';
    element.style.boxSizing = 'content-box';
  };

  const getContentTop = (computedStyle, boundingClicentRect) => {
    return boundingClicentRect.top + getPaddingTop(computedStyle) + getBorderTopWidth(computedStyle)
  };

  const getContentRight = (computedStyle, boundingClicentRect) => {
    return boundingClicentRect.right - getPaddingRight(computedStyle) - getBorderRightWidth(computedStyle)
  };

  const getContentBottom = (computedStyle, boundingClicentRect) => {
    return boundingClicentRect.bottom - getPaddingBottom(computedStyle) - getBorderBottomWidth(computedStyle)
  };

  const getContentLeft = (computedStyle, boundingClicentRect) => {
    return boundingClicentRect.left + getPaddingLeft(computedStyle) + getBorderLeftWidth(computedStyle)
  };

  const getContentWidth = (computedStyle, boundingClicentRect) => {
    return getContentRight(computedStyle, boundingClicentRect) - getContentLeft(computedStyle, boundingClicentRect)
  };

  const getContentHeight = (computedStyle, boundingClicentRect) => {
    return getContentBottom(computedStyle, boundingClicentRect) - getContentTop(computedStyle, boundingClicentRect)
  };

  const getPaddingTop = computedStyle => {
    return Math.max(parseInt(computedStyle.paddingTop, 10), 0)
  };
  const getPaddingRight = computedStyle => {
    return Math.max(parseInt(computedStyle.paddingRight, 10), 0)
  };
  const getPaddingBottom = computedStyle => {
    return Math.max(parseInt(computedStyle.paddingBottom, 10), 0)
  };
  const getPaddingLeft = computedStyle => {
    return Math.max(parseInt(computedStyle.paddingLeft, 10), 0)
  };

  const getBorderTopWidth = computedStyle => {
    return Math.max(parseInt(computedStyle.borderTopWidth, 10), 0)
  };
  const getBorderRightWidth = computedStyle => {
    return Math.max(parseInt(computedStyle.borderRightWidth, 10), 0)
  };
  const getBorderBottomWidth = computedStyle => {
    return Math.max(parseInt(computedStyle.borderBottomWidth, 10), 0)
  };
  const getBorderLeftWidth = computedStyle => {
    return Math.max(parseInt(computedStyle.borderLeftWidth, 10), 0)
  };

  const getMarginTop = computedStyle => {
    return Math.max(parseInt(computedStyle.marginTop, 10), 0)
  };
  const getMarginRight = computedStyle => {
    return Math.max(parseInt(computedStyle.marginRight, 10), 0)
  };
  const getMarginBottom = computedStyle => {
    return Math.max(parseInt(computedStyle.marginBottom, 10), 0)
  };
  const getMarginLeft = computedStyle => {
    return Math.max(parseInt(computedStyle.marginLeft, 10), 0)
  };

  const coverElements = {
    cover: createElement('cover'),
    padding: createElement('padding'),
    border: createElement('border'),
    margin: createElement('margin'),
  };

  // Append cover element to body
  const appendCoverElement = target => {
    // throw Error('Not yet implemented.')

    for (const element of Object.values(coverElements))
      if (document.body.contains(element) === false) document.body.appendChild(element);

    const computedStyle = window.getComputedStyle(target);
    const boundingClicentRect = target.getBoundingClientRect();

    setCoverStyle(coverElements.cover, computedStyle, boundingClicentRect);
    setPaddingStyle(coverElements.padding, computedStyle, boundingClicentRect);
    setBorderStyle(coverElements.border, computedStyle, boundingClicentRect);
    setMarginStyle(coverElements.margin, computedStyle, boundingClicentRect);
  };

  const removeCoverElement = () => {
    for (const element of Object.values(coverElements)) {
      try {
        document.body.removeChild(element);
      } catch (error) {
        // ignore
      }
    }
  };

  const isKeyCombinationActive = event => {
    return event.metaKey
  };
  const onMousemove = event => {
    if (!event || !event.target || event.target === document || isKeyCombinationActive(event) === false) {
      removeCoverElement();
      return
    }

    const target = findHoveredElement(event);

    if (event && event.target && event.target.dataset && event.target.dataset.inspectElement) {
      // remove covered element first if move mouse over it
      removeCoverElement();

      requestAnimationFrame(() => {
        appendCoverElement(target);
      });
    } else {
      appendCoverElement(target);
    }
  };

  // appendStyleNode()
  window.removeEventListener('mousemove', onMousemove);
  window.addEventListener('mousemove', onMousemove);

  window.removeEventListener('keyup', removeCoverElement);
  window.addEventListener('keyup', removeCoverElement);

}());
