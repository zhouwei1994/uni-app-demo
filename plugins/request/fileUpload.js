import request from "./request.js";
const qiniuUploader = require("./qiniuUploader");
export default class fileUpload extends request {
	constructor(props) {
		// 调用实现父类的构造函数
		super(props);
	}
	//七牛云上传图片
	qnImgUpload(data = {}, options = {}) {
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album', 'camera'], //从相册选择
				success: function(res) {
					_this.qnFileUpload({
						files: res.tempFiles,
						...data
					}, options).then(resolve, reject);
				}
			});
		});
	}
	//七牛云上传文件命名
	randomChar(l, url = "") {
		const x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
		let tmp = "";
		let time = new Date();
		for (let i = 0; i < l; i++) {
			tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
		}
		return (
			"file/" +
			url +
			time.getTime() +
			tmp
		);
	}
	//七牛云文件上传（支持多张上传）
	qnFileUpload(data = {}, options = {}) {
		const _this = this;
		let requestInfo = {
			...data,
			...this.config,
			...options,
			header: {},
			method: "FILE"
		};
		return new Promise((resolve, reject) => {
			//请求前回调
			if (_this.requestStart) {
				let requestStart = _this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.load = requestStart.load;
					requestInfo.files = requestStart.files;
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					reject({
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					return;
				}
			}
			if (Array.isArray(requestInfo.files)) {
				let len = requestInfo.files.length;
				let imageList = new Array;
				if(_this.getQnToken){
					_this.getQnToken(qnRes => {
						/*
						 *接口返回参数：
						 *visitPrefix:访问文件的域名
						 *token:七牛云上传token
						 *folderPath:上传的文件夹
						 *region: 地区 默认为：SCN
						 */
						uploadFile(0);
						function uploadFile(i) {
							let fileData = {
								fileIndex: i,
								files: requestInfo.files,
								size: requestInfo.files[i].size
							};
							// #ifdef H5
							fileData.name = requestInfo.files[i].name;
							fileData.type = requestInfo.files[i].type;
							// #endif
							// 交给七牛上传
							qiniuUploader.upload(requestInfo.files[i].path, (res) => {
								fileData.url = res.imageURL;
								requestInfo.onEachUpdate && requestInfo.onEachUpdate({
									url: res.imageURL,
									...fileData
								});
								imageList.push(res.imageURL);
								if (len - 1 > i) {
									uploadFile(i + 1);
								} else {
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "request:ok",
										statusCode: 200,
										data: imageList
									});
									resolve(imageList);
								}
							}, (error) => {
								console.log('error: ' + error);
								//请求完成回调
								_this.requestEnd && _this.requestEnd(requestInfo, error);
								reject(error)
							}, {
								region: qnRes.region || 'SCN', //地区
								domain: qnRes.visitPrefix, // bucket 域名，下载资源时用到。
								key: _this.randomChar(8, qnRes.folderPath),
								uptoken: qnRes.token, // 由其他程序生成七牛 uptoken
								uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
							}, (res) => {
								console.log(requestInfo);
								requestInfo.onProgressUpdate && requestInfo.onProgressUpdate(Object.assign({}, fileData, res));
								// console.log('上传进度', res.progress)
								// console.log('已经上传的数据长度', res.totalBytesSent)
								// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
							});
						}
					});
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请添加七牛云回调方法：getQnToken",
						statusCode: 0
					});
					reject({
						errMsg: "请添加七牛云回调方法：getQnToken",
						statusCode: 0
					});
					return;
				}
			} else {
				//请求完成回调
				_this.requestEnd && _this.requestEnd(requestInfo, {
					errMsg: "files 必须是数组类型",
					statusCode: 0
				});
				reject({
					errMsg: "files 必须是数组类型",
					statusCode: 0
				});
			};
		});

	}
	//本地服务器图片上传
	urlImgUpload(url = '', data = {}, options = {}) {
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album', 'camera'], //从相册选择
				success: function(res) {
					_this.urlFileUpload(url, {
						...data,
						files: res.tempFiles
					}, options).then(resolve, reject);
				}
			});
		});
	}
	//本地服务器文件上传方法
	urlFileUpload(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault({
			...data,
			url: url,
			method: "FILE"
		}, options);
		const _this = this;
		return new Promise((resolve, reject) => {
			//请求前回调
			if (_this.requestStart) {
				let requestStart = _this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.data = requestStart.data;
					requestInfo.header = requestStart.header;
					requestInfo.isPrompt = requestStart.isPrompt;
					requestInfo.load = requestStart.load;
					requestInfo.isFactory = requestStart.isFactory;
					requestInfo.files = requestStart.files;
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					reject({
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					return;
				}
			}
			// 本地文件上传去掉默认Content-Type
			if(requestInfo.header['Content-Type']){
				delete requestInfo.header['Content-Type'];
			}
			if (Array.isArray(requestInfo.files)) {
				// #ifdef APP-PLUS || H5
				let files = [];
				let fileData = {
					files: requestInfo.files,
					name: requestInfo.name || "file"
				};
				requestInfo.files.forEach(item => {
					files.push({
						uri: item.path,
						name: requestInfo.name || "file"
					});
				});
				let config = {
					url: requestInfo.url,
					files: files,
					header: requestInfo.header, //加入请求头
					success: (response) => {
						if (typeof(response.data) == "string") {
							response.data = JSON.parse(response.data);
						}
						//是否用外部的数据处理方法
						if (requestInfo.isFactory && _this.dataFactory) {
							//数据处理
							_this.dataFactory({
								...requestInfo,
								response: response,
								resolve: function(data) {
									requestInfo.onEachUpdate && requestInfo.onEachUpdate({
										data: data,
										...fileData
									});
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "request:ok",
										statusCode: 200,
										data: data
									});
									resolve(data);
								},
								reject: function(err) {
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "数据工厂返回错误",
										statusCode: 0,
										data: err
									});
									reject(err);
								}
							});
						} else {
							requestInfo.onEachUpdate && requestInfo.onEachUpdate({
								data: response,
								...fileData
							});
							//请求完成回调
							_this.requestEnd && _this.requestEnd(requestInfo, response);
							resolve(response);
						}
					},
					fail: (err) => {
						//请求完成回调
						_this.requestEnd && _this.requestEnd(requestInfo, err);
						reject(err);
					}
				};
				if (requestInfo.data) {
					config.formData = requestInfo.data;
				}
				const uploadTask = uni.uploadFile(config);
				uploadTask.onProgressUpdate(res => {
					requestInfo.onProgressUpdate && requestInfo.onProgressUpdate(Object.assign({}, fileData, res));
				});
				// #endif
				// #ifdef MP
				const len = requestInfo.files.length - 1;
				let fileList = new Array;
				fileUpload(0);

				function fileUpload(i) {
					let fileData = {
						fileIndex: i,
						files: requestInfo.files,
						size: requestInfo.files[i].size
					};
					// #ifdef H5
					fileData.name = requestInfo.files[i].name;
					fileData.type = requestInfo.files[i].type;
					// #endif
					let config = {
						url: requestInfo.url,
						filePath: requestInfo.files[i].path,
						header: requestInfo.header, //加入请求头
						name: requestInfo.name || "file",
						success: (response) => {
							if (typeof(response.data) == "string") {
								response.data = JSON.parse(response.data);
							}
							//是否用外部的数据处理方法
							if (requestInfo.isFactory && _this.dataFactory) {
								//数据处理
								_this.dataFactory({
									...requestInfo,
									response: response,
									resolve: function(data) {
										requestInfo.onEachUpdate && requestInfo.onEachUpdate({
											data: data,
											...fileData
										});
										fileList.push(data);
										if (len <= i) {
											//请求完成回调
											_this.requestEnd && _this.requestEnd(requestInfo, {
												errMsg: "request:ok",
												statusCode: 200,
												data: fileList
											});
											resolve(fileList);
										} else {
											fileUpload(i + 1);
										}
									},
									reject: function(err) {
										//请求完成回调
										_this.requestEnd && _this.requestEnd(requestInfo, {
											errMsg: "数据工厂返回错误",
											statusCode: 0,
											data: err
										});
										reject(err);
									}
								});
							} else {
								requestInfo.onEachUpdate && requestInfo.onEachUpdate({
									data: response,
									...fileData
								});
								fileList.push(response);
								if (len <= i) {
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "request:ok",
										statusCode: 200,
										data: fileList
									});
									resolve(fileList);
								} else {
									fileUpload(i + 1);
								}
							}
						},
						fail: (err) => {
							//请求完成回调
							_this.requestEnd && _this.requestEnd(requestInfo, err);
							reject(err);
						}
					};
					if (requestInfo.data) {
						config.formData = requestInfo.data;
					}
					const uploadTask = uni.uploadFile(config);
					uploadTask.onProgressUpdate(res => {
						requestInfo.onProgressUpdate && requestInfo.onProgressUpdate(Object.assign({}, fileData, res));
					});
				}
				// #endif
			} else {
				//请求完成回调
				_this.requestEnd && _this.requestEnd(requestInfo, {
					errMsg: "files 必须是数组类型",
					statusCode: 0
				});
				reject({
					errMsg: "files 必须是数组类型",
					statusCode: 0
				})
			}
		});
	}
}
