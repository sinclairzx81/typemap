import * as Fs from 'node:fs'

// ------------------------------------------------------------------
// Benchmark
// ------------------------------------------------------------------
export async function benchmark(target = 'target/benchmark') {
  await shell(`hammer run benchmark/index.ts --dist ${target}`)
}
// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
export async function clean() {
  await folder('target').delete()
}
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
export async function start() {
  await shell('hammer run example/index.ts --dist target/example')
}

// -------------------------------------------------------------------------------
// Format
// -------------------------------------------------------------------------------
export async function format() {
  await shell('prettier --no-semi --single-quote --print-width 240 --trailing-comma all --write test src benchmark example/index.ts')
}

// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
export async function test(filter = '') {
  await shell(`hammer build ./test/index.ts --dist target/test --platform node`)
  await shell(`mocha target/test/index.js -g "${filter}"`)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export async function build_check(target = 'target/build') {
  const { version } = JSON.parse(Fs.readFileSync('package.json', 'utf8'))
  await shell(`cd ${target} && attw sinclair-typebox-remix-${version}.tgz --ignore-rules unexpected-module-syntax`)
}
export async function build(target = 'target/build') {
  await test()
  await clean()
  await shell(`tsc -p src/tsconfig.json --outDir ${target} --declaration`)
  await folder(target).add('package.json')
  await folder(target).add('readme.md')
  await folder(target).add('license')
  await shell(`cd ${target} && npm pack`)
  await build_check(target)
}
// -------------------------------------------------------------
// Publish
// -------------------------------------------------------------
export async function publish(otp, target = 'target/build') {
  const { version } = JSON.parse(Fs.readFileSync('package.json', 'utf8'))
  if(version.includes('-dev')) throw Error(`package version should not include -dev specifier`)
  await shell(`cd ${target} && npm publish sinclair-typebox-remix-${version}.tgz --access=public --otp ${otp}`)
  await shell(`git tag ${version}`)
  await shell(`git push origin ${version}`)
}
// -------------------------------------------------------------
// Publish-Dev
// -------------------------------------------------------------
export async function publish_dev(otp, target = 'target/build') {
  const { version } = JSON.parse(Fs.readFileSync(`${target}/package.json`, 'utf8'))
  if(!version.includes('-dev')) throw Error(`development package version should include -dev specifier`)
  await shell(`cd ${target} && npm publish sinclair-typebox-remix-${version}.tgz --access=public --otp ${otp} --tag dev`)
}