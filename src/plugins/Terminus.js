const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Replace the path with your Terminus session path.
const TERMINUS_SESSION_PATH = path.resolve(process.env.HOME, '.terminus/cache/session');
let terminusToken = '';
if (fs.existsSync(TERMINUS_SESSION_PATH)) {
  terminusToken = JSON.parse(fs.readFileSync(TERMINUS_SESSION_PATH).toString()).session;
}

const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'Terminus/2.4.1',
  'Authorization': `Bearer ${terminusToken}`,
};

const axiosBase = axios.create({
  baseURL: 'https://terminus.pantheon.io/api',
  method: 'GET',
  headers
});

exports.request = async (url, options) => axiosBase.request(url, options);
