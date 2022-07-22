/* eslint-disable no-undef */
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

class Helper {
	constructor() {
		this.buildId = null;
		this.secret = null;
		this.cryptoKey = null;
	}

	async _initialize() {
		if (!this.initializationPromise) {
			this.initializationPromise = this._doInitialize();
		}
		return this.initializationPromise;
	}

	async _doInitialize() {
		await this._initializeConfig();
		await this._initializeCryptoKey();
	}

	async _initializeConfig() {
		const buildConfig = await this._getBuildConfig();
		this.buildId = buildConfig.buildId;
		this.secret = buildConfig.secret;
	}

	async _initializeCryptoKey() {
		this.cryptoKey = await this._importKey(this.secret);
	}

	async _importKey(key) {
		return await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', (new TextEncoder).encode(key)), {
			name: 'AES-GCM',
		}, false, ['encrypt', 'decrypt']);
	}

	async _getBuildConfig() {
		const response = await axios.get('https://dashboard.blooket.com/api/config').then(res => res.data);
		const scripts = await response.match(/<script src=".{59,67}">/g).slice(1);

		return new Promise(resolve => {
			scripts.forEach(async (script) => {
				const scriptContent = await axios.get(`https://dashboard.blooket.com/${script.split('"')[1]}`).then(res => res.data);
				if (/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(scriptContent) && /\(new TextEncoder\)\.encode\("(.+?)"\)/.test(scriptContent)) {
					resolve({
						buildId: scriptContent.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)[0],
						secret: scriptContent.match(/\(new TextEncoder\)\.encode\("(.+?)"\)/)[1],
					});
				}
			});
		});
	}

	async encrypt(string) {
		await this._initialize();

		const encoded = await (new TextEncoder).encode(JSON.stringify(string));
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encrypted = await crypto.subtle.encrypt({
			name: 'AES-GCM',
			iv,
		}, await this.cryptoKey, encoded);
		return Buffer.from(Array.from(iv).map(char => String.fromCharCode(char)).join('') + Array.from(new Uint8Array(encrypted)).map(char => String.fromCharCode(char)).join(''), 'binary').toString('base64');
	}

	async decrypt(encoded) {
		await this._initialize();

		const string = Buffer.from(encoded, 'base64').toString('binary');
		const iv = Uint8Array.from(string.slice(0, 12)
			.split('')
			.map(char => char.charCodeAt(0)));
		const cipher = string.slice(12);
		const decrypted = await crypto.subtle.decrypt({
			name: 'AES-GCM',
			iv,
		}, await this.cryptoKey, Uint8Array.from(cipher.split('')
			.map(char => char.charCodeAt(0))));
		return (new TextDecoder).decode(decrypted);
	}

	async getBuildId() {
		await this._initialize();
		return this.buildId;
	}

	async getSecret() {
		await this._initialize();
		return this.secret;
	}

	async getCryptoKey() {
		await this._initialize();
		return this.cryptoKey;
	}
}

module.exports = new Helper();