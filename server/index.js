const serverless = require('serverless-http');
const app = require('./server');

module.exports = serverless(app); // ✅ default export, not named

