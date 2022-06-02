const ApiHelper = require('./util/ApiHelper');

ApiHelper.checkAccountExists('Ben')
	.then(console.log);