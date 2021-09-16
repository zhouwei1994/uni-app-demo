const qiniuUploader = require("./qiniuUploader");
const aliUploader =  require('./aliUploader');  
//七牛云上传文件命名
export const randomChar = function(l, url = "") {
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
//图片选择
export const chooseImage = function(data) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: data.count || 9, //默认9
			sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: data.sourceType || ['album', 'camera'], //从相册选择
			success: function(res) {
				for (var i = 0; i < res.tempFiles.length; i++) {
					res.tempFiles[i].fileType = "image"
				}
				resolve(res.tempFiles);
			},
			fail: err => {
				reject({
					errMsg: err.errMsg, 
					errCode: err.errCode, 
					statusCode: 0,
				});
			}
		});
	});
}
//视频选择
export const chooseVideo = function(data) {
	return new Promise((resolve, reject) => {
		uni.chooseVideo({
			sourceType: data.sourceType || ['album', 'camera'], //从相册选择
			compressed: data.compressed || false, //是否压缩所选的视频源文件，默认值为 true，需要压缩。
			maxDuration: data.maxDuration || 60, //拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。
			camera: data.camera || 'back', //'front'、'back'，默认'back'
			success: function(res) {
				let files = [{
					path: res.tempFilePath,
					fileType: "video"
				}];
				// #ifdef APP-PLUS || H5 || MP-WEIXIN
				files[0].duration = res.duration;
				files[0].size = res.size;
				files[0].height = res.height;
				files[0].width = res.width;
				// #endif
				// #ifdef H5
				files[0].name = res.name;
				// #endif
				resolve(files);
			},
			fail: err => {
				reject({
					errMsg: err.errMsg, 
					errCode: err.errCode, 
					statusCode: 0,
				});
			}
		});
	});
}
// 七牛云上传
export const qiniuUpload = function(requestInfo, getQnToken) {
	return new Promise((resolve, reject) => {
		if (Array.isArray(requestInfo.files)) {
			let len = requestInfo.files.length;
			let fileList = new Array;
			if (getQnToken) {
				getQnToken(qnRes => {
					/*
					 *接口返回参数：
					 *visitPrefix:访问文件的域名
					 *token:七牛云上传token
					 *folderPath:上传的文件夹
					 *region: 地区 默认为：SCN
					 */
                    let prefixLen = qnRes.visitPrefix.length;
                    if(qnRes.visitPrefix.charAt(prefixLen - 1) == '/'){
                        qnRes.visitPrefix = qnRes.visitPrefix.substring(0, prefixLen - 1)
                    }
					uploadFile(0);

					function uploadFile(i) {
						let item = requestInfo.files[i];
						let updateUrl = randomChar(10, qnRes.folderPath);
						let fileData = {
							fileIndex: i,
							files: requestInfo.files,
							...item
						};
						if (item.name) {
							fileData.name = item.name;
							let nameArr = item.name.split(".");
							updateUrl += "." + nameArr[nameArr.length - 1];
						}
						// 交给七牛上传
						qiniuUploader.upload(item.path || item, (res) => {
							fileData.url = res.imageURL;
							requestInfo.onEachUpdate && requestInfo.onEachUpdate({
								url: res.imageURL,
								...fileData
							});
							fileList.push(res.imageURL);
							if (len - 1 > i) {
								uploadFile(i + 1);
							} else {
								resolve(fileList);
							}
						}, (error) => {
							reject(error);
						}, {
							region: qnRes.region || 'SCN', //地区
							domain: qnRes.visitPrefix, // bucket 域名，下载资源时用到。
							key: updateUrl,
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
				reject({
					errMsg: "请添加七牛云回调方法：getQnToken",
					statusCode: 0
				});
			}
		} else {
			reject({
				errMsg: "files 必须是数组类型",
				statusCode: 0
			});
		};
	});
}
// 阿里云oss上传
export const aliUpload = function(requestInfo, getAliToken) {
	return new Promise((resolve, reject) => {
		if (Array.isArray(requestInfo.files)) {
			let len = requestInfo.files.length;
			let fileList = new Array;
			if (getAliToken) {
				getAliToken(aliRes => {
					/*
					 *接口返回参数：
					 *visitPrefix:访问文件的域名
					 *folderPath:上传的文件夹
					 *accessKeyId: 您的oss的访问ID
					 *accessKeySecret: 您的oss的访问密钥
					 * timeout: 签名过期时间（毫秒）
					 */
					let aliyunOssKey = aliUploader({
						accessKeyId: aliRes.accessKeyId,
						accessKeySecret: aliRes.accessKeySecret,
						timeout: aliRes.timeout
					});
                    let prefixLen = aliRes.visitPrefix.length;
                    if(aliRes.visitPrefix.charAt(prefixLen - 1) == '/'){
                        aliRes.visitPrefix = aliRes.visitPrefix.substring(0, prefixLen - 1)
                    }
					uploadFile(0);

					function uploadFile(i) {
						let item = requestInfo.files[i];
						let updateUrl = randomChar(10, aliRes.folderPath);
						let fileData = {
							fileIndex: i,
							files: requestInfo.files,
							...item
						};
						if (item.name) {
							fileData.name = item.name;
							let nameArr = item.name.split(".");
							updateUrl += "." + nameArr[nameArr.length - 1];
						}
						if (item.path) {
							let nameArr = item.path.split(".");
							updateUrl += "." + nameArr[nameArr.length - 1];
						}
						uni.uploadFile({
						  url: aliRes.visitPrefix, // 开发者服务器的URL。
						  filePath: item.path,
						  name: 'file', // 必须填file。
						  formData: {
						    key: updateUrl,
						    policy: aliyunOssKey.policy,
						    OSSAccessKeyId: aliyunOssKey.accessKeyId,
						    signature: aliyunOssKey.signature,
						  },
						  success: (res) => {
						    if (res.statusCode === 204) {
								fileData.url = aliRes.visitPrefix + "/" + updateUrl;
								requestInfo.onEachUpdate && requestInfo.onEachUpdate({
									url: fileData.url,
									...fileData
								});
								fileList.push(fileData.url);
								if (len - 1 > i) {
									uploadFile(i + 1);
								} else {
									resolve(fileList);
								}
						    } else {
								reject(res);
							}
						  },
						  fail: err => {
						    reject(err);
						  }
						});
					}
				});
			} else {
				reject({
					errMsg: "请添加阿里云回调方法：getAliToken",
					statusCode: 0
				});
			}
		} else {
			reject({
				errMsg: "files 必须是数组类型",
				statusCode: 0
			});
		};
	});
}
// 服务器URL上传
export const urlUpload = function(requestInfo, dataFactory) {
	return new Promise((resolve, reject) => {
		// 本地文件上传去掉默认Content-Type
		if (requestInfo.header['Content-Type']) {
			delete requestInfo.header['Content-Type'];
		}
		// 本地文件上传去掉默认Content-Type
		if (requestInfo.header['content-type']) {
			delete requestInfo.header['content-type'];
		}
		if (Array.isArray(requestInfo.files)) {
			// #ifdef APP-PLUS || H5
			let files = [];
			let fileData = {
				files: requestInfo.files,
				name: requestInfo.name || "file"
			};
			requestInfo.files.forEach(item => {
                let fileInfo = {
                    name: requestInfo.name || "file",
                };
                if(item.path){
                    fileInfo.uri = item.path;
                } else {
                    fileInfo.file = item;
                }
				files.push(fileInfo);
			});
			let config = {
				url: requestInfo.url,
				files: files,
				header: requestInfo.header, //加入请求头
				success: (response) => {
					//是否用外部的数据处理方法
					if (requestInfo.isFactory && dataFactory) {
						//数据处理
						dataFactory({
							...requestInfo,
							response: response,
						}).then(data => {
							requestInfo.onEachUpdate && requestInfo.onEachUpdate({
								data: data,
								...fileData
							});
							resolve(data);
						},err => {
							reject(err);
						});
					} else {
						requestInfo.onEachUpdate && requestInfo.onEachUpdate({
							data: response,
							...fileData
						});
						resolve(response);
					}
				},
				fail: (err) => {
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
				let item = requestInfo.files[i];
				let fileData = {
					fileIndex: i,
					files: requestInfo.files,
					...item
				};
				let config = {
					url: requestInfo.url,
					filePath: item.path,
					header: requestInfo.header, //加入请求头
					name: requestInfo.name || "file",
					success: (response) => {
						//是否用外部的数据处理方法
						if (requestInfo.isFactory && dataFactory) {
							//数据处理
							dataFactory({
								...requestInfo,
								response: response,
							}).then(data => {
								fileList.push(data);
								requestInfo.onEachUpdate && requestInfo.onEachUpdate({
									data: data,
									...fileData
								});
								if (len <= i) {
									resolve(fileList);
								} else {
									fileUpload(i + 1);
								}
							},err => {
								reject(err);
							});
						} else {
							requestInfo.onEachUpdate && requestInfo.onEachUpdate({
								data: response,
								...fileData
							});
							fileList.push(response);
							if (len <= i) {
								resolve(fileList);
							} else {
								fileUpload(i + 1);
							}
						}
					},
					fail: (err) => {
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
			reject({
				errMsg: "files 必须是数组类型",
				statusCode: 0
			});
		}
	});
}
