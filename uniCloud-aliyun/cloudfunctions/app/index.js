'use strict';
const app = require('uni-cloud-router');              // vk-unicloud 工具包
app.init(require('./config.js'));
exports.main = async (event, context) => {
	return await app.router({ event, context });
};
