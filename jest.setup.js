// Path: jest.config.js
require("@testing-library/jest-dom");
const IntlPolyfill = require("intl");
global.Intl = IntlPolyfill;
