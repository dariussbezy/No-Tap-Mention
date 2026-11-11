const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

test('username taps do nothing, avatar taps still work, and cleanup restores the original action', () => {
 let mentions = 0, profiles = 0;
 const handlers = { handleTapUsername: () => ++mentions, handleTapAvatar: () => ++profiles };
 const original = handlers.handleTapUsername;
 const cleanups = [];
 const modules = {
  '@valenced/modules/finders': { getModules: (filter, callback) => {
   if (filter === 'handleTapUsername') callback(handlers);
   else callback({ prototype: handlers });
   return () => {};
  } },
  '@valenced/modules/finders/filters': { withProps: prop => prop },
  '@valenced/patcher': { instead: (target, key, replacement) => {
   const previous = target[key];
   target[key] = replacement;
   return () => { target[key] = previous; };
  } },
 };
 const source = fs.readFileSync(new URL('../plugins/NTM/js/index.ts', require('node:url').pathToFileURL(__filename)), 'utf8');
 const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
 const exports = {};
 vm.runInNewContext(js, { exports, plugin: value => value, require: name => modules[name] });
 exports.default.start({ cleanup: fn => cleanups.push(fn), plugin: { startedLate: false } });
 handlers.handleTapUsername({ userId: '123' });
 assert.equal(mentions, 0);
 assert.equal(profiles, 0);
 handlers.handleTapAvatar();
 assert.equal(profiles, 1);
 cleanups.reverse().forEach(fn => fn());
 assert.equal(handlers.handleTapUsername, original);
 handlers.handleTapUsername();
 assert.equal(mentions, 1);
});
