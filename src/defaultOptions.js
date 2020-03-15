
const ctor = () => {}

const ensureAllowedChildrenCallback = options => {
  const key = 'allowedChildrenCallback'

  if (options[key]) {
    return options
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Use default, please check "${key}" option.`)
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

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn('Use default, please check "itemCallback" and "childrenCallback" option.')
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

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn('Use default, please check "childrenKey" option.')
  }

  return {
    ...options,
    childrenKey: 'children'
  }
}

const ensureFireChildrenCallbackAtTop = options => {
  const key = 'fireChildrenCallbackAtTop'

  if (options[key] !== undefined) {
    return options
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Use default, please check "${key}" option.`)
  }

  return {
    ...options,
    [key]: true
  }
}

const composeOptions = (...fns) => {
  return fns.reduce((prev, current) => {
    return options => current(prev(options))
  })
}

// Ensure `options` properties
const defaultOptions = options => {
  const options_ = options || {}

  const composedOptions = composeOptions(
    ensureChildrenKey,
    ensureIteratorHandler,
    ensureAllowedChildrenCallback,
    ensureFireChildrenCallbackAtTop
  )(options_)

  return {
    ...options_,
    ...composedOptions
  }
}

export default defaultOptions
