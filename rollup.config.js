import del from 'rollup-plugin-delete'
import copy from 'rollup-plugin-copy'
import csso from 'csso'

const contentScript = {
  input: './src/contentScript/index.js',
  output: {
    file: 'dist/contentScript.js',
    format: 'iife',
  },
  plugins: [
    del({ targets: 'dist/*' }),
    copy({
      targets: [
        {
          src: 'src/contentScript/index.css',
          dest: 'dist',
          rename: 'contentScript.css',
          transform: content => csso.minify(content).css,
        },
      ],
    }),
  ],
}

export default contentScript
