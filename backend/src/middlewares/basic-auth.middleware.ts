import expressBasicAuth from 'express-basic-auth';

export const basicAuthMiddleware = expressBasicAuth({
  users: {
    [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD,
  },
  challenge: true,
});
