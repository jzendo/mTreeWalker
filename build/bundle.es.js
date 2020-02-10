const ctor = () => {};

const ensureIteratorHandler = options => {
  if (options.itemCallback && options.childrenCallback) {
    return options
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Use default callback, pleas check "itemCallback" and "childrenCallback" option.`);
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
    console.warn(`Use default children key, pleas check "childrenKey" option.`);
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
  }
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
    const { childrenKey } = options;

    const r = items.map(item => {
      let { [childrenKey]: children } = item || {};

      return [
        item ? itemHandlerWrapper(item, options) : null,
        children ? parseItems(children, options) : null
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
  return walkTree(data, options)()
}

export default treeWalker;
