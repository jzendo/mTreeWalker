import defaultOptions from './defaultOptions.js'

const toArray = collects => {
  if (Array.isArray(collects)) { return collects }

  return Array.prototype.slice.call(collects)
}

const itemHandlerWrapper = (item, options) => () => {
  options.itemCallback(item, options)
}

const walkWrapper = (itemHandlers, items, options, fireChildrenCallback) => () => {
  if (fireChildrenCallback) options.childrenCallback(items, options)

  const { childrenKey } = options

  itemHandlers.forEach(([itemHandler, childrenHandler], i) => {
    if (itemHandler) itemHandler()
    if (childrenHandler) childrenHandler(items[i][childrenKey], options)
  })
}

const canCovertToArray = arrayLikeOrString => {
  // `arrayLikeOrString` legal values:
  //    "string",
  //    arguments
  //    document.getElementsByTagName('div')
  //    [1, 3, 2]
  return arrayLikeOrString &&
    (typeof arrayLikeOrString === 'object' || typeof arrayLikeOrString === 'string') &&
    ('length' in arrayLikeOrString)
}

const isValidItemValue = item => item !== null && item !== undefined

const parseItems = (arrayLikeOrString, options, fireChildrenCallback = true) => {
  const items = canCovertToArray(arrayLikeOrString) ? toArray(arrayLikeOrString) : null

  if (items && items.length) {
    const { childrenKey, allowedChildrenCallback } = options
    const r = items.map(item => {
      let children

      if (item === null || typeof item !== 'object') {
        children = undefined
      } else {
        children = item[childrenKey]
      }

      const itemCallback = isValidItemValue(item) ? itemHandlerWrapper(item, options) : null

      const childrenCallback =
        // 1). valid item value
        isValidItemValue(children) &&
        // 2). Allowed item by user hooker
        allowedChildrenCallback(item, children, options)
          ? parseItems(children, options)
          : null

      return [itemCallback, childrenCallback]
    })

    return walkWrapper(r, items, options, fireChildrenCallback)
  }

  return null
}

export default (items, options) => {
  const currentOptions = defaultOptions(options)
  return parseItems(items, currentOptions, currentOptions.fireChildrenCallbackAtTop)
}
