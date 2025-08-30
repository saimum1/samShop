// import { Auth0Client } from '@auth0/nextjs-auth0/server';

// export const auth0 = new Auth0Client({
//   authorizationParameters: {
//     scope: process.env.AUTH0_SCOPE,  // e.g., "openid profile email"
//     audience: process.env.AUTH0_AUDIENCE,  // e.g., "https://your-api-id.auth0.com/api/v2/"
//   },
// });


import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  baseURL: process.env.APP_BASE_URL,  
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,  // e.g., "openid profile email"
    // audience: process.env.AUTH0_AUDIENCE, 
  },
});