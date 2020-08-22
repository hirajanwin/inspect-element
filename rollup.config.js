import del from 'rollup-plugin-delete'
import copy from 'rollup-plugin-copy'

const contentScript = {
  input: './src/contentScript/index.js',
  output: {
    file: 'dist/content-script/index.js',
    format: 'iife',
  },
  plugins: [
    del({
      targets: ['dist/manifest.json', 'dist/images', 'dist/content-script'],
    }),
    copy({
      targets: [
        {
          src: 'manifest.json',
          dest: 'dist',
        },
        {
          src: 'images/',
          dest: 'dist',
        },
      ],
    }),
  ],
}

export default [contentScript]
