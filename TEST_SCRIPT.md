# Invalid Email Bug

**Goal:**  
Confirm that some valid emails are being marked invalid on login

## Steps
1. Open the app in Expo Go.  
2. Try logging in with:
   - `luigi@carluccio.it` - invalid 
   - `john@silva.com.br`- Iinvalid 
   - `mario@test.com` - accepted
3. emails with shorter or multi-part domains fail

---

## Result
validation only allows `.com` type endings

## Note
likely caused by the regex in `validateEmail()`
