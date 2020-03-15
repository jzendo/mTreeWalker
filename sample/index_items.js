// Node
const data = require('./data_items.json')
const treeWalker = require('../build/bundle')

const outputChildren = items =>
  items.map(({ name }) => `child: "${name}"`)
  .join(', ')

console.log('\n\nData source:\n')
console.log(JSON.stringify(data, null, 2))

console.log('\n\nOuput:\n')

treeWalker(data, {
  childrenKey: 'items',
  itemCallback: item => {
    console.log(`* item [name="${item.name}"]`)
  },
  childrenCallback: items => {
    console.log(`- children [count=${items.length} ... ${outputChildren(items)}]`)
  }
})
