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

const { formatAMPM, formatEventCount, isTokenExpired, shouldNavigateToEventsMap, validateEmail } = sandbox.exports;
const encodeToken = (payload) => {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `header.${encodedPayload}.signature`;
};

test('accepts plus-addressed email and long domain suffixes', () => {
    assert.equal(validateEmail('alex+tag@example.museum'), true);
    assert.equal(validateEmail('  Alex+tag@Example.COM  '), true);
    assert.equal(validateEmail('alex@example.c'), false);
    assert.equal(validateEmail('alex example@example.com'), false);
});

test('formats 24-hour times as a 12-hour clock', () => {
    assert.equal(formatAMPM(new Date(2026, 0, 1, 13, 7)), '1:07 pm');
    assert.equal(formatAMPM(new Date(2026, 0, 1, 0, 0)), '12:00 am');
    assert.equal(formatAMPM(new Date(2026, 0, 1, 12, 0)), '12:00 pm');
});

test('treats malformed, missing-expiry, and expired tokens as expired', () => {
    assert.equal(isTokenExpired('not-a-token'), true);
    assert.equal(isTokenExpired(encodeToken({ sub: 'user' })), true);
    assert.equal(isTokenExpired(encodeToken(null)), true);
    assert.equal(isTokenExpired(encodeToken({ exp: 'tomorrow' })), true);
    assert.equal(isTokenExpired(encodeToken({ exp: 1 })), true);
    assert.equal(isTokenExpired(encodeToken({ exp: Math.floor(Date.now() / 1000) + 3600 })), false);
});

