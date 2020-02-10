import defaultOptions from './defaultOptions.js'

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
    const { childrenKey } = options

    const r = items.map(item => {
      const { [childrenKey]: children } = item || {}

      return [
        item ? itemHandlerWrapper(item, options) : null,
        children ? parseItems(children, options) : null
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
