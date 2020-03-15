import jsdom from 'jsdom'
import html from './dom.html'

const { JSDOM } = jsdom

let document
let testElement
let nodeCallbackCalledTimes
let childrenCallbackCalledTimes

function toArray (iteratable) {
  return Array.from(iteratable)
}

function getChildNodeCount (testElement) {
  let count = 0

  const children = toArray(testElement.children)

  if (children.length) count += 1

  children.forEach(element => {
    count += getChildNodeCount(element)
  })

  return count
}

function getAllElementsUnderElement (element) {
  return toArray(element.getElementsByTagName('*'))
}

function getCount (testElement) {
  if (nodeCallbackCalledTimes === undefined) {
    // Including root element is meant that should +1.
    nodeCallbackCalledTimes = getAllElementsUnderElement(testElement).length + 1
    childrenCallbackCalledTimes = getChildNodeCount(testElement)
  }

  return [nodeCallbackCalledTimes, childrenCallbackCalledTimes]
}

const dispose = () => {
  if (testElement) testElement.parentNode.removeChild(testElement)
  document = testElement = nodeCallbackCalledTimes = childrenCallbackCalledTimes = undefined
}

export default () => {
  if (!testElement) {
    const dom = new JSDOM(html)
    document = dom.window.document
    testElement = document.querySelector('#root')
    ;[nodeCallbackCalledTimes, childrenCallbackCalledTimes] = getCount(testElement)
  }

  return {
    dom: [testElement],
    nodeCallbackCalledTimes,
    childrenCallbackCalledTimes,
    dispose
  }
}
