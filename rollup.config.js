import babel from "rollup-plugin-babel";
import json from '@rollup/plugin-json';
import pkg from './package.json'
import resolve from "@rollup/plugin-node-resolve";

const banner = `\
/**
 * a tool for tree walker v${pkg.version}
 * author by jzendo, publish date: ${new Date().toUTCString()}
 */
`

module.exports = [
  {
    input: "src/index.js",
    output: {
      file: "build/bundle.js",
      name: "MTreeWalker",
      format: "umd",
      banner
    },
    plugins: [
      json(),
      resolve(),
      babel({
        exclude: "node_modules/**"
      })
    ]
  },
  {
    input: "src/index.js",
    output: {
      file: "build/bundle.es.js",
      format: "es",
      banner
    },
    plugins: [
      json()
    ]
  }
]
