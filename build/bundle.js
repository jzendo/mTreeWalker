/**
 * a tool for tree walker v0.1.0
 * author by jzendo, publish date: Mon, 10 Feb 2020 14:41:24 GMT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MTreeWalker = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var ctor = function ctor() {};

  var ensureIteratorHandler = function ensureIteratorHandler(options) {
    if (options.itemCallback && options.childrenCallback) {
      return options;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Use default callback, pleas check "itemCallback" and "childrenCallback" option.');
    }

    return _objectSpread2({}, options, {
      itemCallback: ctor,
      childrenCallback: ctor
    });
  };

  var ensureChildrenKey = function ensureChildrenKey(options) {
    if (options.childrenKey) {
      return options;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Use default children key, pleas check "childrenKey" option.');
    }

    return _objectSpread2({}, options, {
      childrenKey: 'children'
    });
  }; // Ensure `options` properties


  var defaultOptions = function defaultOptions(options) {
    var options_ = options || {};
    return _objectSpread2({}, options_, {}, ensureChildrenKey(options_), {}, ensureIteratorHandler(options_));
  };

  var itemHandlerWrapper = function itemHandlerWrapper(item, options) {
    return function () {
      options.itemCallback(item, options);
    };
  };

  var iteratorWrapper = function iteratorWrapper(itemHandlers, items, options) {
    return function () {
      options.childrenCallback(items, options);
      var childrenKey = options.childrenKey;
      itemHandlers.forEach(function (_ref, i) {
        var _ref2 = _slicedToArray(_ref, 2),
            itemHandler = _ref2[0],
            childrenHandler = _ref2[1];

        if (itemHandler) itemHandler();
        if (childrenHandler) childrenHandler(items[i][childrenKey], options);
      });
    };
  };

  var parseItems = function parseItems(items, options) {
    if (items && items.length) {
      var childrenKey = options.childrenKey;
      var r = items.map(function (item) {
        var _ref3 = item || {},
            children = _ref3[childrenKey];

        return [item ? itemHandlerWrapper(item, options) : null, children ? parseItems(children, options) : null];
      });
      return iteratorWrapper(r, items, options);
    }

    return null;
  };

  var walkTree = (function (items, options) {
    options = defaultOptions(options);
    return parseItems(items, options);
  });

  function treeWalker(data, options) {
    return walkTree(data, options)();
  }

  return treeWalker;

})));
