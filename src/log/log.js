const pino = require('pino');
const dayjs = require('dayjs');

const LOG = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

module.exports = LOG;