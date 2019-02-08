import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript';
import autoprefixer from 'autoprefixer';

const babelConfig = {
  presets: [["@babel/preset-env", { "modules": false }], "@babel/preset-react"],
  // presets: ['es2015-rollup', 'react', 'stage-0'],
  // presets: ['react', 'stage-0'],
  plugins: [
    // "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-external-helpers",
    [
      "@babel/plugin-transform-runtime",
      {
        // "polyfill": false,
        "regenerator": true,
      }
    ]
  ],
  runtimeHelpers: true,
  // exclude: 'node_modules/**'
};

export default {
  input: './src/browser/index.ts',
  output: [{
    file: './dist/bundle.browser.js',
    format: 'system',
    sourcemap: true
  }],
  plugins: [
    typescript(),
    postcss({ plugins: [autoprefixer()] }),
    resolve(),
    babel(babelConfig),
    commonjs({
      // namedExports: { 'prop-types': ['oneOfType', 'node', 'func', 'bool', 'number', 'object', 'string'], },
      // exclude: 'node_modules/**',
      // include: [
      //   /node_modules\/prop-types/,
      //   /node_modules\/hoist-non-react-statics/,
      //   /node_modules\/invariant/,
      //   /node_modules\/react-is/,
      //   /node_modules\/warning/,
      // ],
    }),
  ],
  external: [
    '@schirkan/reactron-interfaces',
    'react',
    'react-dom',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-regular-svg-icons',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/react-fontawesome',
    'numeral',
    'moment',
    'moment-timezone'
  ]
};