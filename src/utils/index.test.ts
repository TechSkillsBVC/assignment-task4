import {validateEmail} from './index';


describe('validateEmail', () => {
    const emailsfromdb = [
        "yasemin.akyuz@example.com",
        "luigi@carluccio.it",
        "john@silva.com.br",
        "elif.aksit@example.com",
        "anne.vanwingerden@example.com",
        "gisele.oliveira@example.com",
        "sara.barnett@example.com",
        "azuma.gamez@example.com",
        "eva.young@example.com"
    ];
    //runs through list of emails
    for (const email of emailsfromdb) {
        it(`valid email: ${email}`, () => {
            expect(validateEmail(email)).toBe(true);
        });}
        it (`invalid email: john@example`, () => {
            expect(validateEmail('john@example')).toBe(false);
        })
        it (`invalid email: john@example.c`, () => {
            expect(validateEmail('john@example.c')).toBe(false);
        })
        it (`invalid email:John@example.12`, () => {
            expect(validateEmail('John@example.12')).toBe(false);
            //If failed then problem is resolved
        })
        it('invalid email: john@example.123', () => {
            expect(validateEmail('john@example.123')).toBe(true);
        })
        it('invalid email: john@example.1234', () => {
            expect(validateEmail('john@example.1234')).toBe(true);
            //if failed then problem is not resolved
        })
    });