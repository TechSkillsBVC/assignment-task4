import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    // Before running your 'json-server', get your computer's IP address and
    // update your baseURL to `http://your_ip_address_here:3333` and then run:
    // `npx json-server --watch db.json --port 3333 --host your_ip_address_here`
    //
    // To access your server online without running json-server locally,
    // you can set your baseURL to:
    // `https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
    //
    // To use `my-json-server`, make sure your `db.json` is located at the repo root.

    baseURL: 'http://10.0.0.119:3333',
});

export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {

    //  return api.post(`/login`, { email, password }); 
    
    
    // NOTE:
// The login functionality may not work correctly due to potential issues 
// with how the passwords are being stored or hashed. Specifically:
// - The stored password hash might be incorrectly generated or stored in the database.
// - The hashing process used for comparing the entered password might not match the stored hash.
// - Ensure that the password is being hashed before storing and that the hash comparison logic 
//   (using bcrypt.compare()) is working as expected.
// - If passwords are stored incorrectly (e.g., plain text or with an incorrect hashing algorithm), 
//   the authentication will always fail because the entered password won't match the hashed version in the database.
// - Double-check the password hashing function (bcrypt.hash) during user registration and ensure it is consistent 
//   with how it is compared during login (bcrypt.compare).



    return api.get(`/users`, { params: {email, password }});
};
