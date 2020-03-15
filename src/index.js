import walkTree from './walkTree'

export default function treeWalker (data, options) {
  const parser = walkTree(data, options)

  if (parser) {
    console.log('Walking...')
    parser()
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.log('Skip walking!')
    }
  }
}
