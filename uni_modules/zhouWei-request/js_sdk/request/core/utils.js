// 获取合并的数据
export const mergeConfig = function(_this, options) {
	//判断url是不是链接
	let urlType = /^(http|https):\/\//.test(options.url);
	let config = Object.assign({
		timeout: _this.timeout
	}, _this.config, options);
	if (options.method == "FILE") {
		config.url = urlType ? options.url : _this.fileUrl + options.url;
	} else {
		config.url = urlType ? options.url : _this.baseUrl + options.url;
	}
	//请求头
	if (options.header) {
		config.header = Object.assign({}, _this.header, options.header);
	} else {
		config.header = Object.assign({}, _this.header);
	}
	return config;
}
// 请求
export const dispatchRequest = function(requestInfo) {
	return new Promise((resolve, reject) => {
		let requestAbort = true;
		let requestData = {
			url: requestInfo.url,
			header: requestInfo.header, //加入请求头
			success: (res) => {
				requestAbort = false;
				resolve(res);
			},
			fail: (err) => {
				requestAbort = false;
				if(err.errMsg == "request:fail abort"){
					reject({
						errMsg: "请求超时，请重新尝试",
						statusCode: 0,
					});
				} else {
					reject(err);
				}
			}
		};
		//请求类型
		if (requestInfo.method) {
			requestData.method = requestInfo.method;
		}
		if (requestInfo.data) {
			requestData.data = requestInfo.data;
		}
		// #ifdef MP-WEIXIN || MP-ALIPAY
		if (requestInfo.timeout) {
			requestData.timeout = requestInfo.timeout;
		}
		// #endif
		if (requestInfo.dataType) {
			requestData.dataType = requestInfo.dataType;
		}
		// #ifndef APP-PLUS || MP-ALIPAY
		if (requestInfo.responseType) {
			requestData.responseType = requestInfo.responseType;
		}
		// #endif
		// #ifdef H5
		if (requestInfo.withCredentials) {
			requestData.withCredentials = requestInfo.withCredentials;
		}
		// #endif
		let requestTask = uni.request(requestData);
		setTimeout(() => {
			if(requestAbort){
				requestTask.abort();
			}
		}, requestInfo.timeout)
	})
}
// jsonp请求
export const jsonpRequest = function(requestInfo) {
	return new Promise((resolve, reject) => {
		let dataStr = '';
		Object.keys(requestInfo.data).forEach(key => {
			dataStr += key + '=' + requestInfo.data[key] + '&';
		});
		//匹配最后一个&并去除
		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
		}
		requestInfo.url = requestInfo.url + '?' + dataStr;
		let callbackName = "callback" + Math.ceil(Math.random() * 1000000);
		// #ifdef H5
		window[callbackName] = function(data) {
			resolve(data);
		}
		let script = document.createElement("script");
		script.src = requestInfo.url + "&callback=" + callbackName;
		document.head.appendChild(script);
		// 及时删除，防止加载过多的JS
		document.head.removeChild(script);
		// #endif
	});
}