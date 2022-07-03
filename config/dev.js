require("dotenv").config()

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID_DEV,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET_DEV,
  mongoURI: process.env.MONGO_URI_DEV,
  cookieKey: process.env.COOKIE_KEY_DEV,
};
