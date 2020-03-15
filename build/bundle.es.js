/**
 * a tool for tree walker v0.1.1
 * author by jzendo, publish date: Sun, 15 Mar 2020 12:11:58 GMT
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

// Ensure `options` properties
const defaultOptions = options => {
  const options_ = options || {};

  return {
    ...options_,
    ...ensureChildrenKey(options_),
    ...ensureIteratorHandler(options_),
    ...ensureAllowedChildrenCallback(options_),
    ...ensureFireChildrenCallbackAtTop(options_)
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

const parseItems = (arrayLikeOrString, options, fireChildrenCallback = true) => {
  const items = canCovertToArray(arrayLikeOrString) ? toArray(arrayLikeOrString) : null;

  if (items && items.length) {
    const { childrenKey, allowedChildrenCallback } = options;
    const r = items.map(item => {
      let children;

      if (typeof item !== 'object') {
        children = undefined;
      } else {
        children = item[childrenKey];
      }

      return [
        item ? itemHandlerWrapper(item, options) : null,
        children && allowedChildrenCallback(item, children, options) ? parseItems(children, options) : null
      ]
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
    console.log('Walking...');
    walk();
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.log('Ignore!');
    }
  }
}

export default treeWalker;
