/**
 * a tool for tree walker v0.1.1
 * author by jzendo, publish date: Sun, 15 Mar 2020 12:11:58 GMT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MTreeWalker = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  var ensureAllowedChildrenCallback = function ensureAllowedChildrenCallback(options) {
    var key = 'allowedChildrenCallback';

    if (options[key]) {
      return options;
    }
    /* istanbul ignore next */


    if (process.env.NODE_ENV === 'development') {
      console.warn("Use default, please check \"".concat(key, "\" option."));
    }

    return _objectSpread2({}, options, _defineProperty({}, key, function () {
      return true;
    }));
  };

  var ensureIteratorHandler = function ensureIteratorHandler(options) {
    if (options.itemCallback && options.childrenCallback) {
      return options;
    }
    /* istanbul ignore next */


    if (process.env.NODE_ENV === 'development') {
      console.warn('Use default, please check "itemCallback" and "childrenCallback" option.');
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
    /* istanbul ignore next */


    if (process.env.NODE_ENV === 'development') {
      console.warn('Use default, please check "childrenKey" option.');
    }

    return _objectSpread2({}, options, {
      childrenKey: 'children'
    });
  };

  var ensureFireChildrenCallbackAtTop = function ensureFireChildrenCallbackAtTop(options) {
    var key = 'fireChildrenCallbackAtTop';

    if (options[key] !== undefined) {
      return options;
    }
    /* istanbul ignore next */


    if (process.env.NODE_ENV === 'development') {
      console.warn("Use default, please check \"".concat(key, "\" option."));
    }

    return _objectSpread2({}, options, _defineProperty({}, key, true));
  }; // Ensure `options` properties


  var defaultOptions = function defaultOptions(options) {
    var options_ = options || {};
    return _objectSpread2({}, options_, {}, ensureChildrenKey(options_), {}, ensureIteratorHandler(options_), {}, ensureAllowedChildrenCallback(options_), {}, ensureFireChildrenCallbackAtTop(options_));
  };

  var toArray = function toArray(collects) {
    if (Array.isArray(collects)) {
      return collects;
    }

    return Array.prototype.slice.call(collects);
  };

  var itemHandlerWrapper = function itemHandlerWrapper(item, options) {
    return function () {
      options.itemCallback(item, options);
    };
  };

  var walkWrapper = function walkWrapper(itemHandlers, items, options, fireChildrenCallback) {
    return function () {
      if (fireChildrenCallback) options.childrenCallback(items, options);
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

  var canCovertToArray = function canCovertToArray(arrayLikeOrString) {
    // `arrayLikeOrString` legal values:
    //    "string",
    //    arguments
    //    document.getElementsByTagName('div')
    //    [1, 3, 2]
    return arrayLikeOrString && (_typeof(arrayLikeOrString) === 'object' || typeof arrayLikeOrString === 'string') && 'length' in arrayLikeOrString;
  };

  var parseItems = function parseItems(arrayLikeOrString, options) {
    var fireChildrenCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var items = canCovertToArray(arrayLikeOrString) ? toArray(arrayLikeOrString) : null;

    if (items && items.length) {
      var childrenKey = options.childrenKey,
          allowedChildrenCallback = options.allowedChildrenCallback;
      var r = items.map(function (item) {
        var children;

        if (_typeof(item) !== 'object') {
          children = undefined;
        } else {
          children = item[childrenKey];
        }

        return [item ? itemHandlerWrapper(item, options) : null, children && allowedChildrenCallback(item, children, options) ? parseItems(children, options) : null];
      });
      return walkWrapper(r, items, options, fireChildrenCallback);
    }

    return null;
  };

  var walkTreeWrapper = (function (items, options) {
    var currentOptions = defaultOptions(options);
    return parseItems(items, currentOptions, currentOptions.fireChildrenCallbackAtTop);
  });

  function treeWalker(data, options) {
    var walk = walkTreeWrapper(data, options);

    if (walk) {
      console.log('Walking...');
      walk();
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.log('Ignore!');
      }
    }
  }

  return treeWalker;

})));
