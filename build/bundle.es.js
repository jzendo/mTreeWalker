/**
 * a tool for tree walker v0.1.0
 * author by jzendo, publish date: Sun, 15 Mar 2020 05:24:57 GMT
 */

const ctor = () => {};

const ensureAllowedChildrenCallback = options => {
  const key = 'allowedChildrenCallback';

  if (options[key]) {
    return options
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Use default callback, pleas check "${key}" option.`);
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

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Use default callback, pleas check "itemCallback" and "childrenCallback" option.');
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

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Use default children key, pleas check "childrenKey" option.');
  }

  return {
    ...options,
    childrenKey: 'children'
  }
};

// Ensure `options` properties
const defaultOptions = options => {
  const options_ = options || {};

  return {
    ...options_,
    ...ensureChildrenKey(options_),
    ...ensureIteratorHandler(options_),
    ...ensureAllowedChildrenCallback(options_)
  }
};

const toArray =  collects => {
  if (Array.isArray(collects))
    return collects

  return Array.prototype.slice.call(collects)
};

const itemHandlerWrapper = (item, options) => () => {
  options.itemCallback(item, options);
};

const iteratorWrapper = (itemHandlers, items, options) => () => {
  options.childrenCallback(items, options);

  const { childrenKey } = options;

  itemHandlers.forEach(([itemHandler, childrenHandler], i) => {
    if (itemHandler) itemHandler();
    if (childrenHandler) childrenHandler(items[i][childrenKey], options);
  });
};

const parseItems = (items, options) => {
  if (items && items.length) {
    const { childrenKey, allowedChildrenCallback } = options;
    items = toArray(items);
    const r = items.map(item => {
      const { [childrenKey]: children } = item || {};

      return [
        item ? itemHandlerWrapper(item, options) : null,
        children && allowedChildrenCallback(item, children, options) ? parseItems(children, options) : null
      ]
    });

    return iteratorWrapper(r, items, options)
  }

  return null
};

var walkTree = (items, options) => {
  options = defaultOptions(options);
  return parseItems(items, options)
};

function treeWalker (data, options) {
  const parser = walkTree(data, options);

  if (parser) {
    console.log('Walking...');
    parser();
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.log('Skip walking!');
    }
  }
}

export default treeWalker;
