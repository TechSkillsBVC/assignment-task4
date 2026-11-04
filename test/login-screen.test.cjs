const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/utils/index.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const jwtDecode = (token) => {
    const payload = token.split('.')[1];
    if (!payload) throw new Error('Invalid token');
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
};
const sandbox = {
    exports: {},
    require(name) {
        if (name === 'expo-constants') return { __esModule: true, default: {} };
        if (name === 'jwt-decode') return { __esModule: true, default: jwtDecode };
        if (name === 'react-native') return { Platform: { OS: 'ios' } };
        if (name === 'react-native-maps') return {};
        throw new Error(`Unexpected dependency: ${name}`);
    },
};
vm.runInNewContext(compiled, sandbox);

const { shouldNavigateToEventsMap, validateLoginCredentials } = sandbox.exports;

test('validates login email and password independently', () => {
    const valid = validateLoginCredentials('  Alex+tag@Example.COM  ', 'password123');
    assert.equal(valid.emailIsValid, true);
    assert.equal(valid.passwordIsValid, true);
    assert.equal(valid.isValid, true);

    const invalidEmail = validateLoginCredentials('not-an-email', 'password123');
    assert.equal(invalidEmail.emailIsValid, false);
    assert.equal(invalidEmail.passwordIsValid, true);
    assert.equal(invalidEmail.isValid, false);

    const invalidPassword = validateLoginCredentials('alex@example.com', 'short');
    assert.equal(invalidPassword.emailIsValid, true);
    assert.equal(invalidPassword.passwordIsValid, false);
    assert.equal(invalidPassword.isValid, false);
});

test('navigates only when both the cached token and user are available', () => {
    assert.equal(shouldNavigateToEventsMap(true, { id: 'user-1' }), true);
    assert.equal(shouldNavigateToEventsMap(false, { id: 'user-1' }), false);
    assert.equal(shouldNavigateToEventsMap(true, undefined), false);
});
