export const config = () => ({
  db: {
    uri: process.env.DB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  email: {
    host: process.env.EMAIL_HOST,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  }
});
