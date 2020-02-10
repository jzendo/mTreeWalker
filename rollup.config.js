import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import json from '@rollup/plugin-json';

module.exports = [
  {
    input: "src/index.js",
    output: {
      file: "build/bundle.js",
      name: "MTreeWalker",
      format: "umd"
    },
    plugins: [
      json(),
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      })
    ]
  },
  {
    input: "src/index.js",
    output: {
      file: "build/bundle.es.js",
      format: "es"
    },
    plugins: [
      json()
    ]
  }
]
