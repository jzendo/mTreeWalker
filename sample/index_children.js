const data = require('./data_children.json')
const treeWalker = require('../build/bundle')

const outputChildren = items =>
  items.map(({ name }) => `child: "${name}"`)
  .join(', ')

console.log('\n\nOuput:')

treeWalker(data, {
  itemCallback: item => {
    console.log(`* item [name="${item.name}"]`)
  },
  childrenCallback: items => {
    console.log(`- children [count=${items.length} ... ${outputChildren(items)}]`)
  }
})
