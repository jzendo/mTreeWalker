/* global describe, test, expect, jest */
import treeWalker from '../index'
describe('index', () => {
  test('no parameter', () => {
    const fn = jest.fn()
    const catchFn = jest.fn()

    try {
      treeWalker()
      fn()
    } catch (e) {
      catchFn()
    }

    expect(fn).toHaveBeenCalledTimes(1)
    expect(catchFn).toHaveBeenCalledTimes(0)
  })

  test('no parameter', () => {
    const itemCallback = jest.fn()
    const childrenCallback = jest.fn()

    treeWalker([2, 1, {
      title: 3,
      items: [
        1, 2
      ]
    }], {
      itemCallback,
      childrenCallback,
      childrenKey: 'items',
      fireChildrenCallbackAtTop: false
    })

    expect(itemCallback).toHaveBeenCalled()
    expect(childrenCallback).toHaveBeenCalledTimes(1)
  })
})
