/**
 * a tool for tree walker v0.1.1
 * author by jzendo, publish date: Sun, 15 Mar 2020 13:45:55 GMT
 */

const ctor = () => {};

const ensureAllowedChildrenCallback = options => {
  const key = 'allowedChildrenCallback';

  if (options[key]) {
    return options
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Use default, please check "${key}" option.`);
  }

  return {
    ...options,
    [key]: () => true
  }
};

const ensureIteratorHandler = options => {
  if (options.itemCallback && options.childrenCallback) {
    return options
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn('Use default, please check "itemCallback" and "childrenCallback" option.');
  }

  return {
    ...options,
    itemCallback: ctor,
    childrenCallback: ctor
  }
};

const ensureChildrenKey = options => {
  if (options.childrenKey) {
    return options
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn('Use default, please check "childrenKey" option.');
  }

  return {
    ...options,
    childrenKey: 'children'
  }
};

const ensureFireChildrenCallbackAtTop = options => {
  const key = 'fireChildrenCallbackAtTop';

  if (options[key] !== undefined) {
    return options
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Use default, please check "${key}" option.`);
  }

  return {
    ...options,
    [key]: true
  }
};

const composeOptions = (...fns) => {
  return fns.reduce((prev, current) => {
    return options => current(prev(options))
  })
};

// Ensure `options` properties
const defaultOptions = options => {
  const options_ = options || {};

  const composedOptions = composeOptions(
    ensureChildrenKey,
    ensureIteratorHandler,
    ensureAllowedChildrenCallback,
    ensureFireChildrenCallbackAtTop
  )(options_);

  return {
    ...options_,
    ...composedOptions
  }
};

const toArray = collects => {
  if (Array.isArray(collects)) { return collects }

  return Array.prototype.slice.call(collects)
};

const itemHandlerWrapper = (item, options) => () => {
  options.itemCallback(item, options);
};

const walkWrapper = (itemHandlers, items, options, fireChildrenCallback) => () => {
  if (fireChildrenCallback) options.childrenCallback(items, options);

  const { childrenKey } = options;

  itemHandlers.forEach(([itemHandler, childrenHandler], i) => {
    if (itemHandler) itemHandler();
    if (childrenHandler) childrenHandler(items[i][childrenKey], options);
  });
};

const canCovertToArray = arrayLikeOrString => {
  // `arrayLikeOrString` legal values:
  //    "string",
  //    arguments
  //    document.getElementsByTagName('div')
  //    [1, 3, 2]
  return arrayLikeOrString &&
    (typeof arrayLikeOrString === 'object' || typeof arrayLikeOrString === 'string') &&
    ('length' in arrayLikeOrString)
};

const isValidItemValue = item => item !== null && item !== undefined;

const parseItems = (arrayLikeOrString, options, fireChildrenCallback = true) => {
  const items = canCovertToArray(arrayLikeOrString) ? toArray(arrayLikeOrString) : null;

  if (items && items.length) {
    const { childrenKey, allowedChildrenCallback } = options;
    const r = items.map(item => {
      let children;

      if (item === null || typeof item !== 'object') {
        children = undefined;
      } else {
        children = item[childrenKey];
      }

      const itemCallback = isValidItemValue(item) ? itemHandlerWrapper(item, options) : null;

      const childrenCallback =
        // 1). valid item value
        isValidItemValue(children) &&
        // 2). Allowed item by user hooker
        allowedChildrenCallback(item, children, options)
          ? parseItems(children, options)
          : null;

      return [itemCallback, childrenCallback]
    });

    return walkWrapper(r, items, options, fireChildrenCallback)
  }

  return null
};

var walkTreeWrapper = (items, options) => {
  const currentOptions = defaultOptions(options);
  return parseItems(items, currentOptions, currentOptions.fireChildrenCallbackAtTop)
};

function treeWalker (data, options) {
  const walk = walkTreeWrapper(data, options);

  if (walk) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'development') {
      console.log('Walking...');
    }

    walk();
  } else {
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'development') {
      console.log('Ignore!');
    }
  }
}

export default treeWalker;
