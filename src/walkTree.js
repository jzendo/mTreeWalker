import defaultOptions from './defaultOptions.js'

const toArray = collects => {
  if (Array.isArray(collects)) { return collects }

  return Array.prototype.slice.call(collects)
}

const itemHandlerWrapper = (item, options) => () => {
  options.itemCallback(item, options)
}

const iteratorWrapper = (itemHandlers, items, options) => () => {
  options.childrenCallback(items, options)

  const { childrenKey } = options

  itemHandlers.forEach(([itemHandler, childrenHandler], i) => {
    if (itemHandler) itemHandler()
    if (childrenHandler) childrenHandler(items[i][childrenKey], options)
  })
}

const parseItems = (items, options) => {
  if (items && items.length) {
    const { childrenKey, allowedChildrenCallback } = options
    items = toArray(items)
    const r = items.map(item => {
      const { [childrenKey]: children } = item || {}

      return [
        item ? itemHandlerWrapper(item, options) : null,
        children && allowedChildrenCallback(item, children, options) ? parseItems(children, options) : null
      ]
    })

    return iteratorWrapper(r, items, options)
  }

  return null
}

export default (items, options) => {
  options = defaultOptions(options)
  return parseItems(items, options)
}
