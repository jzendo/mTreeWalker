/* global describe, test, expect, jest */
import defaultOptions from '../defaultOptions'

const hasOwn = (o, p) => {
  if (!o || p === undefined || p === null) return false
  return Object.prototype.hasOwnProperty.call(o, p)
}

const DEFAULT_FIELDS = [
  'childrenKey',
  'allowedChildrenCallback',
  'itemCallback',
  'childrenCallback',
  'fireChildrenCallbackAtTop'
]

const hasFields = (o, fields = DEFAULT_FIELDS) => {
  return Boolean(fields.reduce((r, f) => {
    return r & (hasOwn(o, f) ? 1 : 0)
  }, 1))
}

describe('defaultOptions', () => {
  test('no parameter', () => {
    const result = defaultOptions()
    expect(result).not.toBeNull()
    expect(hasFields(result)).toBeTruthy()
  })

  test('"itemCallback" and "childrenCallback" parameters', () => {
    const itemCallback = jest.fn()

    const result = defaultOptions({
      itemCallback
    })

    expect(result).not.toBeNull()
    expect(result.itemCallback === itemCallback).toBeFalsy()
  })
})
