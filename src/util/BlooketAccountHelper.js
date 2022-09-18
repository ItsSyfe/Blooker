const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");

const BlooketCryptoHelper = require("./BlooketCryptoHelper");
const Logger = require("./Logger");

class BlooketAccount {
  constructor() {
    this.email = process.env.BLOOKETEMAIL;
    this.password = process.env.BLOOKETPASSWORD;
    this.session, (this.successfulLogin = false);

    const jar = new CookieJar();
    const accountAxios = axios.create({ jar });
    const accountAxiosCookie = wrapper(accountAxios);

    this.axios = accountAxiosCookie;

	this.axios.interceptors.response.use(res => res, async function(err) {
		const status = err.response ? err.response.status : null;

		if (status === 401) {
			Logger.info(`Blooker Blooket Account session expired, refreshing...`);
			BlooketCryptoHelper._doInitialize();
			await this._doInitialize();
			return this.axios.request(err.config);
		}

		return Promise.reject(err);
	})
  }

  async _initialize() {
    if (!this.initializationPromise) {
      this.initializationPromise = this._doInitialize();
    }
    return this.initializationPromise;
  }

  async _doInitialize() {
    await this._getCookie();
    await this._login();
    await this._verifySession();
  }

  async _getCookie() {
    await this.axios.get("https://id.blooket.com/api/users/check-auth", {
      headers: {
        "X-Blooket-Build": await BlooketCryptoHelper.getBuildId(),
      },
    });
  }

  async _login() {
    await this.axios
      .post(
        "https://id.blooket.com/api/users/login",
        {
          name: await this.email,
          password: await this.password,
        },
        {
          headers: {
            "X-Blooket-Build": await BlooketCryptoHelper.getBuildId(),
            "Content-Type": "text/plain",
          },
        }
      )
      .then((res) => (this.successfulLogin = res.data.success));
  }

  async _verifySession() {
    this.session = await this.axios
      .get("https://id.blooket.com/api/users/verify-session", {
        headers: {
          "X-Blooket-Build": await BlooketCryptoHelper.getBuildId(),
        },
      })
      .then((res) => res.data);
  }

  async _fetchBlooketUserByUsername(username) {
	await this._initialize();

	return await this.axios.get(`https://api.blooket.com/api/users?name=${username}`)
		.then(response => response.data);
  }

  async _fetchBlooketUserById(id) {
	await this._initialize();

	return await this.axios.get(`https://api.blooket.com/api/users?id=${id}`)
		.then(response => response.data);
  }

  async getLoginSuccess() {
    await this._initialize();
    return this.successfulLogin;
  }

  async fetchAccountByUsername(username) {
	return await this._fetchBlooketUserByUsername(username);
  }

  async fetchBlooksByUsername(username) {
	return (await this._fetchBlooketUserByUsername(username)).unlocks || {};
  }

  async multiFetchBlooksByUsername(usernames) {
	return await Promise.all(usernames.map(async username => await this.fetchBlooksByUsername(username)));
  }

  async getUsernameFromId(id) {
	return (await this._fetchBlooketUserById(id)).name;
  }

  async getIdFromUsername(username) {
	return (await this._fetchBlooketUserByUsername(username))._id;
  }

  async doesUserExist(username) {
	await this._initialize();

	return await this.axios.get(`https://api.blooket.com/api/users?name=${username}`)
	.then(res => res.status === 200)
	.catch(err => err.status === 200);
  }

  async getLastGameNameFromUsername(username) {
	const account = await this._fetchBlooketUserByUsername(username);
	return account.gameHistory[account.gameHistory.length - 1].name || '';
  }
}

module.exports = new BlooketAccount();