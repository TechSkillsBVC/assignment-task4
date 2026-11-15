/// <reference types="jest" />

import {
    sanitizeEmail,
    validateEmail,
    formatBytes,
    castToNumber,
    formatAMPM,
    addHours,
} from './index';

describe('Email Utility Tests', () => {
    test('should remove spaces and convert email to lowercase', () => {
        expect(sanitizeEmail('  TEST@Example.COM  ')).toBe('test@example.com');
    });

    test('should accept a valid .com email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });

    test('should reject an empty email', () => {
        expect(validateEmail('')).toBe(false);
    });

    test('should accept a valid Canadian .ca email', () => {
        expect(validateEmail('test@example.ca')).toBe(true);
    });

    test('should accept Luigi Carluccio email', () => {
        expect(validateEmail('luigi@carluccio.it')).toBe(true);
    });

    test('should accept John Silva email', () => {
        expect(validateEmail('john@silva.com.br')).toBe(true);
    });

    test('should reject an email without @', () => {
        expect(validateEmail('testexample.com')).toBe(false);
    });

    test('should reject an email without domain extension', () => {
        expect(validateEmail('test@example')).toBe(false);
    });

    test('should accept an email with leading and trailing spaces', () => {
        expect(validateEmail('  test@example.com  ')).toBe(true);
    });
});

describe('General Utility Tests', () => {
    test('should format bytes correctly', () => {
        expect(formatBytes(1024)).toBe('1 KB');
    });

    test('should return 0 Bytes for zero', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });

    test('should convert text to a number', () => {
        expect(castToNumber('123')).toBe(123);
    });

    test('should format one megabyte correctly', () => {
        expect(formatBytes(1024 * 1024)).toBe('1 MB');
    });

    test('should format one gigabyte correctly', () => {
        expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });

    test('should return 0 Bytes for negative zero', () => {
        expect(formatBytes(-0)).toBe('0 Bytes');
    });

    test('should format date time in AM/PM format', () => {
        const date = new Date(2026, 10, 9, 14, 30);
        expect(formatAMPM(date)).toBe('2:30 pm');
    });

    test('should add hours to a given date', () => {
        const date = new Date(2026, 10, 9, 10, 0);
        const result = addHours(date, 2);

        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(0);
    });
});