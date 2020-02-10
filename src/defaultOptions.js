
const ctor = () => {}

const ensureAllowedChildrenCallback = options => {
  const key = 'allowedChildrenCallback'

  if (options[key]) {
    return options
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Use default callback, pleas check "${key}" option.`)
  }

  return {
    ...options,
    [key]: () => true
  }
}

const ensureIteratorHandler = options => {
  if (options.itemCallback && options.childrenCallback) {
    return options
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Use default callback, pleas check "itemCallback" and "childrenCallback" option.')
  }

  return {
    ...options,
    itemCallback: ctor,
    childrenCallback: ctor
  }
}

const ensureChildrenKey = options => {
  if (options.childrenKey) {
    return options
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Use default children key, pleas check "childrenKey" option.')
  }

  return {
    ...options,
    childrenKey: 'children'
  }
}

// Ensure `options` properties
const defaultOptions = options => {
  const options_ = options || {}

  return {
    ...options_,
    ...ensureChildrenKey(options_),
    ...ensureIteratorHandler(options_),
    ...ensureAllowedChildrenCallback(options_)
  }
}

export default defaultOptions
