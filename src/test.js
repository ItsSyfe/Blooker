const ApiHelper = require('./util/ApiHelper');

ApiHelper.getBlooksFromUsername('bob')
	.then((res) => {
		console.log(res.data);
	});