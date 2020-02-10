import walkTree from './generateTreeParser'

export default function treeWalker (data, options) {
  return walkTree(data, options)()
}
