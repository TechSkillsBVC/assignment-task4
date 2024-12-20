/// <reference types="jest" />

declare namespace jest {
    interface Matchers<R> {
        toHaveStyle: (style: object) => R;
        toBeEnabled: () => R;
        toBeVisible: () => R;
        toBeDisabled: () => R;
        toHaveTextContent: (text: string) => R;
        toHaveProp: (propName: string, propValue?: any) => R;
    }
}

declare const jest: typeof import('@jest/globals').jest;
declare const expect: typeof import('@jest/globals').expect;
declare const test: typeof import('@jest/globals').test;
declare const describe: typeof import('@jest/globals').describe;
declare const beforeEach: typeof import('@jest/globals').beforeEach;
declare const afterEach: typeof import('@jest/globals').afterEach;
declare const beforeAll: typeof import('@jest/globals').beforeAll;
declare const afterAll: typeof import('@jest/globals').afterAll;
