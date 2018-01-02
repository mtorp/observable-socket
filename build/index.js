// @see http://desmonding.me/2016/12/24/use-rollup-api-to-build-multiple-bundles.html
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')

const env = process.env.NODE_ENV

const rollupConfig = {
  input: 'src/index.js',
  external: [
    'debug',
    'rxjs/Observable',
    'rxjs/Rx',
    'rxjs/add/observable/fromEvent',
    'rxjs/add/operator/take'
  ]
}

const uglifyConfig = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    warnings: false
  }
}

const plugins = [
  resolve({ jsnext: true, main: true, module: true }),
  commonjs(),
  babel({ exclude: 'node_modules/**' }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env)
  })
]

// @see https://github.com/ReactiveX/RxJS#es6-via-npm
if (process.env.BABEL_ENV === 'observableonly') {
  // cjs
  rollup
    .rollup(Object.assign({}, rollupConfig, { plugins: plugins }))
    .then(bundle => {
      bundle.write({
        format: 'cjs',
        file: 'dist/cjs/bind.js',
        sourcemap: true
      })
    })

  // esm
  rollup
    .rollup(Object.assign({}, rollupConfig, { plugins: plugins }))
    .then(bundle => {
      bundle.write({
        format: 'es',
        file: 'dist/esm/bind.js',
        sourcemap: true
      })
    })
} else {
  // UMD
  rollup
    .rollup(Object.assign({}, rollupConfig, { plugins: plugins }))
    .then(function (bundle) {
      bundle.write({
        file: 'dist/umd/index.js',
        format: 'umd',
        name: 'ObservableSocket',
        sourcemap: true,
        globals: {
          'debug': 'debug',
          'rxjs/Rx': 'Rx'
        }
      })
    })

  // UMD.min
  rollup
    .rollup(Object.assign({}, rollupConfig, { plugins: [...plugins, uglify(uglifyConfig)] }))
    .then(bundle => {
      bundle.write({
        file: 'dist/umd/index.min.js',
        format: 'umd',
        name: 'ObservableSocket',
        sourcemap: true,
        globals: {
          'debug': 'debug',
          'rxjs/Rx': 'Rx'
        }
      })
    })

  // cjs
  rollup
    .rollup(Object.assign({}, rollupConfig, { plugins: plugins }))
    .then(bundle => {
      bundle.write({
        format: 'cjs',
        file: 'dist/cjs/index.js',
        sourcemap: true
      })
    })

  // esm
  rollup
    .rollup(Object.assign({}, rollupConfig, { plugins: plugins }))
    .then(bundle => {
      bundle.write({
        format: 'es',
        file: 'dist/esm/index.js',
        sourcemap: true
      })
    })
}
