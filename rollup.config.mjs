"use strict";
// import clear from "rollup-plugin-clear";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true,
  },

  plugins: [
    // clear({targets: ["dist"]}),
    resolve({rootDir: "src"}),
    commonjs(),
    // terser({keep_classnames: true, keep_fnames: true, compress: false}),
    typescript({tsconfig: "./tsconfig.json"}),
  ],
};
