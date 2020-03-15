/* global describe, test, expect, jest, beforeEach, afterEach */
import walkTreeWrapper from '../walkTreeWrapper'
import genDOMData from './common/dom'

const isFunc = f => typeof f === 'function'

const fireChildrenCallbackAtTopTest = () => {
  const testCase = fireChildrenCallbackAtTop => {
    const itemCallback = jest.fn()
    const childrenCallback = jest.fn()
    const arr = [1, 2]
    const options = {
      allowedChildrenCallback: () => true,
      itemCallback,
      childrenCallback,
      childrenKey: 'items',
      fireChildrenCallbackAtTop
    }

    test(`fireChildrenCallbackAtTop: ${JSON.stringify(fireChildrenCallbackAtTop)}`, () => {
      walkTreeWrapper(arr, options)()
      expect(itemCallback).toHaveBeenCalledTimes(arr.length)
      expect(childrenCallback).toHaveBeenCalledTimes(fireChildrenCallbackAtTop ? 1 : 0)
    })
  }

  testCase(true)
  testCase(false)
}

const allowedChildrenCallbackTest = () => {
  const testCase = (msg, allowedChildrenCallback, actualValue) => {
    const itemCallback = jest.fn()
    const childrenCallback = jest.fn()
    const arr = [{
      title: 1,
      items: [
        {
          title: 10
        }
      ]
    }, {
      title: 2,
      items: [
        {
          title: 20
        }
      ]
    }]

    const options = {
      allowedChildrenCallback,
      itemCallback,
      childrenCallback,
      childrenKey: 'items',
      fireChildrenCallbackAtTop: false
    }

    test(`${msg}`, () => {
      walkTreeWrapper(arr, options)()
      expect(childrenCallback).toHaveBeenCalledTimes(actualValue)
    })
  }

  testCase('return false after calling allowedChildrenCallback', () => false, 0)
  testCase('return true after calling allowedChildrenCallback', () => true, 2)
  testCase('return false after calling allowedChildrenCallback at first position', (item) => item.title === 2, 1)
  testCase('return false after calling allowedChildrenCallback at last position', (item) => item.title === 1, 1)
}

describe('walkTreeWrapper', () => {
  describe('is returned with null', () => {
    test('invalid parameters', () => {
      expect(walkTreeWrapper(null)).toBeNull()
      expect(walkTreeWrapper(false)).toBeNull()
      expect(walkTreeWrapper(true)).toBeNull()
      expect(walkTreeWrapper(1)).toBeNull()
      expect(walkTreeWrapper({})).toBeNull()
      expect(walkTreeWrapper([])).toBeNull()
    })
  })

  describe('is returned with function', () => {
    test('should be right with no options', () => {
      const r = walkTreeWrapper([1, 2])
      expect(r).not.toBeNull()
      expect(isFunc(r)).toBeTruthy()
    })

    test('should be right with null/undefined items', () => {
      let r = walkTreeWrapper([undefined, undefined])
      expect(r).not.toBeNull()
      expect(isFunc(r)).toBeTruthy()

      r = walkTreeWrapper([null, undefined])
      expect(r).not.toBeNull()
      expect(isFunc(r)).toBeTruthy()
    })
  })

  describe('should be right with options', () => {
    fireChildrenCallbackAtTopTest()
    allowedChildrenCallbackTest()
  })

  describe('should be right with DOM', () => {
    let r

    beforeEach(() => {
      r = genDOMData()
    })

    afterEach(() => {
      r.dispose()
    })

    test('is passed', () => {
      const itemCallback = jest.fn()
      const childrenCallback = jest.fn()

      const result = walkTreeWrapper(r.dom, {
        itemCallback,
        childrenCallback,
        childrenKey: 'children',
        fireChildrenCallbackAtTop: false
      })

      expect(isFunc(result)).toBeTruthy()

      result()
      expect(itemCallback).toHaveBeenCalledTimes(r.nodeCallbackCalledTimes)
      expect(childrenCallback).toHaveBeenCalledTimes(r.childrenCallbackCalledTimes)
    })
  })
})
