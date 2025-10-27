import { validateEmail } from '../utils/email';

const emails = [
  //valid
  'maria@test.com',        
  'luigi@carluccio.it',  
  'john@silva.com.br',
  //invalid    
  'bad@@test',             
  'morgan@gmail',           
];

console.log('Email Validation Test Results');
for (const e of emails) {
  const ok = validateEmail(e);
  console.log(`${e.padEnd(24)} → ${ok ? 'valid' : 'invalid'}`);
}