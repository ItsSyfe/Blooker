const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
require('dotenv').config();

const BlooketHelper = require('./BlooketHelper');

class Client {
	constructor() {
		this.email = process.env.BLOOKETEMAIL;
		this.password = process.env.BLOOKETPASSWORD;

		const jar = new CookieJar();
		const axiosInstance = axios.create({
			jar,
		});

		const axiosInstanceCookie = wrapper(axiosInstance);
		this.axios = axiosInstanceCookie;
	}

	async _doInitialize() {
		await this._initializeAuth();
	}

	async _initialize() {
		if (!this.initializationPromise) {
			this.initializationPromise = this._doInitialize();
		}
		return this.initializationPromise;
	}

	async _initializeAuth() {
		await this.axios.get('https://api.blooket.com/api/users/check-auth', {
			headers: {
				'X-Blooket-Build': await BlooketHelper.getBuildId(),
			},
		});

		await this.axios.post('https://api.blooket.com/api/users/login', await BlooketHelper.encrypt({
			name: this.email,
			password: this.password,
		}), {
			headers: {
				'X-Blooket-Build': await BlooketHelper.getBuildId(),
				'Content-Type': 'text/plain',
			},
		});
	}

	async getAccountFromUsername(username) {
		await this._initialize();

		return await this.axios.get(`https://api.blooket.com/api/users?name=${username}`)
			.then(response => response.data);
	}

	async getBlooksFromUsername(username) {
		await this._initialize();

		const account = await this.getAccountFromUsername(username);
		return Object.keys(account.data.unlocks);
	}
}

module.exports = new Client();