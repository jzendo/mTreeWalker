import walkTreeWrapper from './walkTreeWrapper'

export default function treeWalker (data, options) {
  const walk = walkTreeWrapper(data, options)

  if (walk) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'development') {
      console.log('Walking...')
    }

    walk()
  } else {
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'development') {
      console.log('Ignore!')
    }
  }
}
