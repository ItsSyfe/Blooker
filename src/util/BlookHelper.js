const axios = require('axios');

class ApiHelper {
	constructor() {
		const axiosInstance = axios.create();

		this.axios = axiosInstance;
		this.json = null;
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
		this.json = res.data;
	}

	async getBlookInfo(blook) {
		await this._initialize();
		return this.json.blooks[blook];
	}

	async getAllObtainableBlookNames() {
		await this._initialize();
		return this.json.obtainable;
	}

	async getAllEventBlookNames() {
		await this._initialize();
		return this.json.eventBlooks;
	}

	async getAllBlookNamesWithRarity(rarity) {
		await this._initialize();
		return this.json.obtainableRarities[rarity];
	}

	async getBox(name) {
		await this._initialize();
		return Object.values(this.json.boxes).filter(box => box.boxName.replace(/\s/g, "").toLowerCase() === name.replace(/\s/g, "").toLowerCase())[0] || null;
	}

	async getAllBoxes() {
		await this._initialize();
		return this.json.boxes;
	}

	async getBlookByName(name) {
		await this._initialize();
		const blookName = Object.keys(this.json.blooks).filter(blookName => blookName.replace(/\s/g, "").toLowerCase() === name.replace(/\s/g, "").toLowerCase())[0];
		return { ...this.json.blooks[blookName], name: blookName } || null;
	}

	async getFullBlookName(shortName) {
		await this._initialize();
		return Object.keys(this.json.blooks).filter(blook => blook.replace(/\s/g, "").toLowerCase() === shortName)[0];
	}

	async obtainableBlookCount() {
		await this._initialize();
		return this.json.obtainableBlooks;
	}
}

module.exports = new ApiHelper();