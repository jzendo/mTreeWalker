// Node
const html = require('./data_dom')
const treeWalker = require('../build/bundle')
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const dom = new JSDOM(html)
const document = dom.window.document;

console.log('\n\nData source:\n')
console.log(html)

const outputChildren = items =>
  items.map(({ dataset }) => {
    return `child: "${dataset['title']}"`
  })
  .join(', ')

console.log('\n\nOuput:\n')

const rootEle = document.querySelector('#root')

treeWalker([ rootEle ], {
  itemCallback: element => {
    console.log(`* item [name="${element.dataset['title']}"]`)
  },
  childrenCallback: childElements => {
    console.log(`- children [count=${childElements.length} ... ${outputChildren(childElements)}]`)
  }
})
