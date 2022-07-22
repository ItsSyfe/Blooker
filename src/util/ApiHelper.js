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

		this.axios.interceptors.response.use(response => response, async function(error) {
			const status = error.response ? error.response.status : null;

			if (status == 401) {
				await BlooketHelper._doInitialize();
				await this._doInitialize();
				return this.axios.request(error.config);
			}

			return Promise.reject(error);
		});
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
		return account.unlocks;
	}

	async getLastGameNameFromUsername(username) {
		await this._initialize();

		const account = await this.getAccountFromUsername(username);
		return account.gameHistory[account.gameHistory.length - 1].name;
	}

	async checkAccountExists(username) {
		await this._initialize();

		const resStatus = await this.axios.get(`https://api.blooket.com/api/users?name=${username}`)
			.then(response => response.status == 200)
			.catch(function(error) {
				if (error.response) {
					return error.response.status == 200;
				}
			});
		return resStatus;
	}
}

module.exports = new Client();