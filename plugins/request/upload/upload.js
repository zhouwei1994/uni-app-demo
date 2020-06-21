import request from "./../core/request.js";
const {
	chooseImage,
	chooseVideo,
	qiniuUpload,
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
		} catch (err) {
			return Promise.reject(err);
			this.requestError && this.requestError(err);
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
		} catch (err) {
			return Promise.reject(err);
			this.requestError && this.requestError(err);
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
	//本地服务器图片上传
	async urlImgUpload(url = '', options = {}) {
		let files;
		try {
			files = await chooseImage(options);
		} catch (err) {
			return Promise.reject(err);
			this.requestError && this.requestError(err);
		}
		if (files) {
			return this.urlFileUpload(url, {
				...options,
				files: files
			});
		}
	}
	//本地服务器上传视频
	async urlVideoUpload(url = '', options = {}) {
		let files;
		try {
			files = await chooseVideo(options);
		} catch (err) {
			return Promise.reject(err);
			this.requestError && this.requestError(err);
		}
		if (files) {
			return this.urlFileUpload(url, {
				...options,
				files: files
			});
		}
	}
	//本地服务器文件上传方法
	async urlFileUpload(url = '',options = {}) {
		// 请求数据
		let requestInfo,
			// 是否运行过请求开始钩子
			runRequestStart = false;
		try {
			if (!url) {
				throw {
					errMsg: "【request】文件上传缺失数据url",
					statusCode: 0
				}
			}
			// 数据合并
			requestInfo = mergeConfig(this, {
				...options,
				url: url,
				method: "FILE"
			});
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
					}
				}
			}
			let requestResult = await urlUpload(requestInfo, this.dataFactory);
			return Promise.resolve(requestResult);
		} catch (err){
			this.requestError && this.requestError(err);
			return Promise.reject(err);
		} finally {
			if(runRequestStart){
				this.requestEnd && this.requestEnd(requestInfo);
			}
		}
	}
}
