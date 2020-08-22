const fs = require('fs')
const childProcess = require('child_process')
const cwd = process.cwd()

let timeout = null

if (process.argv.includes('--watch')) {
  fs.watch('src', { recursive: true }, debounceBuild)
  fs.watch('images', { recursive: true }, debounceBuild)
  fs.watch('manifest.json', debounceBuild)
}
debounceBuild()

function debounceBuild() {
  console.log('changed')
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    build()
  }, 200)
}

function build() {
  console.clear()

  process.chdir(cwd)
  childProcess.execSync('rm -rf dist')

  // static files, contentScript
  childProcess.execSync('yarn build', handleChildProcess)

  // browserAction
  process.chdir('src/browser-action')
  childProcess.execSync(
    process.argv.includes('--watch') ? 'yarn build --mode development' : 'yarn build',
    handleChildProcess,
  )

  console.log('')
  console.log('Waiting for changes...')
}

function handleChildProcess(error, stdout, stderr) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
}
