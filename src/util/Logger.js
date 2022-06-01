const config = require('../config.json');

function log(logtype, str) {
	const date_ob = new Date();
	const date = ('0' + date_ob.getDate()).slice(-2);
	const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
	const year = date_ob.getFullYear();
	const hours = date_ob.getHours();
	const minutes = date_ob.getMinutes();
	const seconds = date_ob.getSeconds();

	console.log(`${year}-${month}-${date} ${hours}:${minutes}:${seconds} ${logtype}  - ${str}`);
}

exports.info = (str) => {
	const logtype = '\u001b[34mINFO\u001b[0m';
	log(logtype, str);
};

exports.error = (str) => {
	const logtype = '\u001b[31mERROR\u001b[0m';
	log(logtype, str);
};

exports.debug = (str) => {
	const logtype = '\u001b[35mDEBUG\u001b[0m';
	if (config.debug) log(logtype, str);
};