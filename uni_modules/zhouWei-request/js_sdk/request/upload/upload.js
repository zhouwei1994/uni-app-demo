import request from "./../core/request.js";
const {
	chooseImage,
	chooseVideo,
	qiniuUpload,
	aliUpload,
	urlUpload
} = require("./utils");
import {
	mergeConfig
} from "./../core/utils.js";
export default class fileUpload extends request {
	constructor(props) {
		// 调用实现父类的构造函数
		super(props);
	}
	//七牛云上传图片
	async qnImgUpload(options = {}) {
		let files;
		try {
			files = await chooseImage(options);
			// 选择完成回调
			options.onSelectComplete && options.onSelectComplete(files);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		}
		if (files) {
			return this.qnFileUpload({
				...options,
				files: files
			});
		}
	}
	//七牛云上传视频
	async qnVideoUpload(options = {}) {
		let files;
		try {
			files = await chooseVideo(options);
			// 选择完成回调
			options.onSelectComplete && options.onSelectComplete(files);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		}
		if (files) {
			return this.qnFileUpload({
				...options,
				files: files
			});
		}
	}

	//七牛云文件上传（支持多张上传）
	async qnFileUpload(options = {}) {
		let requestInfo;
		try {
			// 数据合并
			requestInfo = {
				...this.config,
				...options,
				header: {},
				method: "FILE"
			};
			//请求前回调
			if (this.requestStart) {
				let requestStart = this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					let changekeys = ["load", "files"];
					changekeys.forEach(key => {
						requestInfo[key] = requestStart[key];
					});
				} else {
					throw {
						errMsg: "【request】请求开始拦截器未通过",
						statusCode: 0,
						data: requestInfo.data,
						method: requestInfo.method,
						header: requestInfo.header,
						url: requestInfo.url,
					}
				}
			}
			let requestResult = await qiniuUpload(requestInfo, this.getQnToken);
			return Promise.resolve(requestResult);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		} finally {
			this.requestEnd && this.requestEnd(requestInfo);
		}
	}
	//阿里云上传图片
	async aliImgUpload(options = {}) {
		let files;
		try {
			files = await chooseImage(options);
			// 选择完成回调
			options.onSelectComplete && options.onSelectComplete(files);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		}
		if (files) {
			return this.aliFileUpload({
				...options,
				files: files
			});
		}
	}
	//阿里云上传视频
	async aliVideoUpload(options = {}) {
		let files;
		try {
			files = await chooseVideo(options);
			// 选择完成回调
			options.onSelectComplete && options.onSelectComplete(files);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		}
		if (files) {
			return this.aliFileUpload({
				...options,
				files: files
			});
		}
	}
	//阿里云文件上传（支持多张上传）
	async aliFileUpload(options = {}) {
		let requestInfo;
		try {
			// 数据合并
			requestInfo = {
				...this.config,
				...options,
				header: {},
				method: "FILE"
			};
			//请求前回调
			if (this.requestStart) {
				let requestStart = this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					let changekeys = ["load", "files"];
					changekeys.forEach(key => {
						requestInfo[key] = requestStart[key];
					});
				} else {
					throw {
						errMsg: "【request】请求开始拦截器未通过",
						statusCode: 0,
						data: requestInfo.data,
						method: requestInfo.method,
						header: requestInfo.header,
						url: requestInfo.url,
					}
				}
			}
			let requestResult = await aliUpload(requestInfo, this.getAliToken);
			return Promise.resolve(requestResult);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		} finally {
			this.requestEnd && this.requestEnd(requestInfo);
		}
	}
	//本地服务器图片上传
	async urlImgUpload() {
		let options = {};
		if (arguments[0]) {
			if (typeof(arguments[0]) == "string") {
				options.url = arguments[0];
			} else if (typeof(arguments[0]) == "object") {
				options = Object.assign(options, arguments[0]);
			}
		}
		if (arguments[1] && typeof(arguments[1]) == "object") {
			options = Object.assign(options, arguments[1]);
		}
		try {
			options.files = await chooseImage(options);
			// 选择完成回调
			options.onSelectComplete && options.onSelectComplete(options.files);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		}
		if (options.files) {
			return this.urlFileUpload(options);
		}
	}
	//本地服务器上传视频
	async urlVideoUpload() {
		let options = {};
		if (arguments[0]) {
			if (typeof(arguments[0]) == "string") {
				options.url = arguments[0];
			} else if (typeof(arguments[0]) == "object") {
				options = Object.assign(options, arguments[0]);
			}
		}
		if (arguments[1] && typeof(arguments[1]) == "object") {
			options = Object.assign(options, arguments[1]);
		}
		try {
			options.files = await chooseVideo(options);
			// 选择完成回调
			options.onSelectComplete && options.onSelectComplete(options.files);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		}
		if (options.files) {
			return this.urlFileUpload(options);
		}
	}
	//本地服务器文件上传方法
	async urlFileUpload() {
		let requestInfo = {
			method: "FILE"
		};
		if (arguments[0]) {
			if (typeof(arguments[0]) == "string") {
				requestInfo.url = arguments[0];
			} else if (typeof(arguments[0]) == "object") {
				requestInfo = Object.assign(requestInfo, arguments[0]);
			}
		}
		if (arguments[1] && typeof(arguments[1]) == "object") {
			requestInfo = Object.assign(requestInfo, arguments[1]);
		}
		if (!requestInfo.url && this.defaultUploadUrl) {
			requestInfo.url = this.defaultUploadUrl;
		}
		if (!requestInfo.name && this.defaultFileName) {
			requestInfo.name = this.defaultFileName;
		}
		// 请求数据
		// 是否运行过请求开始钩子
		let runRequestStart = false;
		try {
			if (!requestInfo.url) {
				throw {
					errMsg: "【request】文件上传缺失数据url",
					statusCode: 0,
					data: requestInfo.data,
					method: requestInfo.method,
					header: requestInfo.header,
					url: requestInfo.url,
				}
			}
			// 数据合并
			requestInfo = mergeConfig(this, requestInfo);
			// 代表之前运行到这里
			runRequestStart = true;
			//请求前回调
			if (this.requestStart) {
				let requestStart = this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					let changekeys = ["data", "header", "isPrompt", "load", "isFactory", "files"];
					changekeys.forEach(key => {
						requestInfo[key] = requestStart[key];
					});
				} else {
					throw {
						errMsg: "【request】请求开始拦截器未通过",
						statusCode: 0,
						data: requestInfo.data,
						method: requestInfo.method,
						header: requestInfo.header,
						url: requestInfo.url,
					}
				}
			}
			let requestResult = await urlUpload(requestInfo, this.dataFactory);
			return Promise.resolve(requestResult);
		} catch (err) {
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		} finally {
			if (runRequestStart) {
				this.requestEnd && this.requestEnd(requestInfo);
			}
		}
	}
}
