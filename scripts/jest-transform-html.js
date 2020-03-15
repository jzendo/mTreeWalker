// jest-transform-html, by jzendo

const crypto = require('crypto')
const htmlMinifier = require('html-minifier')

const tidyContent = function (content) {
  let tidied = content
  try {
    tidied = htmlMinifier.minify(tidied, {
      // collapseWhitespace: true,
      removeEmptyAttributes: true,
      removeComments: true
    })
  } catch (err) {
    tidied = content
  }

  return tidied
}

module.exports = {
  getCacheKey (fileData, filename, configString) {
    return crypto
      .createHash('md5')
      .update('\0', 'utf8')
      .update(fileData)
      .update('\0', 'utf8')
      .update(filename)
      .update('\0', 'utf8')
      .update(configString)
      .update('\0', 'utf8')
      .digest('hex')
  },
  process (src, filePath) {
    let content = src
    content = tidyContent(content)
    return `module.exports = ${JSON.stringify(content)};`
  }
}
