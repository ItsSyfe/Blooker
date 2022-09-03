const axios = require('axios');

class ApiHelper {
	constructor() {
		const axiosInstance = axios.create();

		this.axios = axiosInstance;
		this.blooks = null;
	}

	async _doInitialize() {
		await this._initializeFetchJson();
	}

	async _initialize() {
		if (!this.initializationPromise) {
			this.initializationPromise = this._doInitialize();
		}
		return this.initializationPromise;
	}

	async _initializeFetchJson() {
		const res = await this.axios.get('https://undercovergoose.github.io/blooket-src/blooks.json');
		this.blooks = res.data;
	}

	async getBlooks() {
		await this._initialize();
		return this.blooks.obtainable;
	}

	async getBlooksByRarity(rarity) {
		await this._initialize();
		return await Array.from(this.blooks.obtainableRarities[rarity]);
	}

	async getBlook(name) {
		await this._initialize();
		return this.blooks.blooks[name];
	}

	async getBox(id) {
		await this._initialize();
		return this.blooks.boxes[id];
	}

	async getAllBoxes() {
		await this._initialize();
		return this.blooks.boxes;
	}

	async getFullBlookName(shortName) {
		await this._initialize();
		return Object.keys(this.blooks.blooks).filter(blook => blook.replace(/\s/g, "").toLowerCase() === shortName)[0];
	}
}

module.exports = new ApiHelper();