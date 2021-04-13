// #ifdef APP-PLUS
import {
	judgePermission
} from './permission'
// #endif
import Vue from 'vue';
// 身份证格式校验
export const checkIdCard = function(sIdCard) {
	//Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码
	let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		Xi = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
		Pi = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54,
			61, 62, 63, 64, 65, 71, 81, 82, 91
		],
		checkStatus = 0;
	// 检查身份证长度
	if(sIdCard.length == 18){
		checkStatus += 1;
	}
	//检验输入的省份编码是否有效
	if(checkStatus >= 1){
		let p2 = sIdCard.substr(0, 2);
		for (let i = 0; i < Pi.length; i++) {
			if (Pi[i] == p2) {
				checkStatus += 1;
			}
		}
	}
	//检验18位身份证号码出生日期是否有效
	//parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。
	if(checkStatus >= 2){
		 let year = parseFloat(sIdCard.substr(6, 4));
		 let month = parseFloat(sIdCard.substr(10, 2));
		 let day = parseFloat(sIdCard.substr(12, 2));
		 let checkDay = new Date(year, month - 1, day);
		 let nowDay = new Date();
		 if (1900 <= year && year <= nowDay.getFullYear() && month == (checkDay.getMonth() + 1) && day == checkDay
		 	.getDate()) {
		 	checkStatus += 1;
		 } 
	}
	//检验校验码是否有效  
	if(checkStatus >= 3){
		let aIdCard = sIdCard.split("");
		let sum = 0;
		for (let j = 0; j < Wi.length; j++) {
			sum += Wi[j] * aIdCard[j]; //线性加权求和  
		}
		let index = sum % 11; //求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配  
		if (Xi[index] == aIdCard[17].toUpperCase()) {
			checkStatus += 1;
		}
	}
	if (checkStatus == 4) {
		return true;
	} else {
		return false;
	}
};
/**
 * 时间转换为XX前
 */
export const clickDateDiff = function(value) {
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = parseInt(now) - parseInt(value);
	if (diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + '月前';
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + '周前';
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + '天前';
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + '小时前';
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + '分钟前';
	} else {
		result = '刚刚';
	}
	return result;
};
/**
 * 时间戳转换为想要的时间格式
 */
//时间戳转换为时间 format('yyyy-MM-dd hh:mm:ss')
//时间格式转换
Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[
				k]).substr(("" + o[k]).length)));
	return fmt;
}
// 保存图片
let settingWritePhotosAlbum = false;
export const saveImg = function(url, callback) {
	if (url) {
		// #ifdef MP-WEIXIN
		if (settingWritePhotosAlbum) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						uni.showLoading({
							title: '正在下载'
						});
						uni.downloadFile({
							url: url,
							success: data => {
								if (data.statusCode == 200) {
									uni.saveImageToPhotosAlbum({
										filePath: data.tempFilePath,
										success: () => {
											uni.hideLoading();
											callback && callback();
											uni.showToast({
												title: '保存成功'
											});
										},
										fail(e) {
											uni.hideLoading();
											tip({
												title: '下载失败，错误原因：' + e
													.errMsg,
												icon: "none"
											});
										}
									});
								} else {
									uni.hideLoading();
									uni.showToast({
										title: '下载失败',
										icon: "none"
									});
								}
							},
							fail(e) {
								uni.hideLoading();
								uni.showToast({
									title: '下载失败，错误原因：' + e.errMsg,
									icon: "none"
								});
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: '请先在设置页面打开“保存相册”使用权限',
							confirmText: '去设置',
							cancelText: '算了',
							success: data => {
								if (data.confirm) {
									uni.openSetting();
								}
							}
						});
					}
				}
			});
		} else {
			settingWritePhotosAlbum = true;
			uni.authorize({
				scope: 'scope.writePhotosAlbum',
				success: () => {
					uni.showLoading({
						title: '正在下载'
					});
					uni.downloadFile({
						url: url,
						success: data => {
							if (data.statusCode == 200) {
								uni.saveImageToPhotosAlbum({
									filePath: data.tempFilePath,
									success: () => {
										uni.hideLoading();
										callback && callback();
										uni.showToast({
											title: '保存成功'
										});
									},
									fail(e) {
										uni.hideLoading();
										tip({
											title: '下载失败，错误原因：' + e.errMsg,
											icon: "none"
										});
									}
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '下载失败',
									icon: "none"
								});
							}
						},
						fail(e) {
							uni.hideLoading();
							uni.showToast({
								title: '下载失败，错误原因：' + e.errMsg,
								icon: "none"
							});
						}
					});
				}
			});
		}
		// #endif
		// #ifdef H5
		uni.showLoading({
			title: '正在下载'
		});
		uni.downloadFile({
			url: url,
			success: data => {
				uni.hideLoading();
				if (data.statusCode == 200) {
					callback && callback();
					window.open(data.tempFilePath);
				} else {
					uni.showToast({
						title: '下载失败',
						icon: "none"
					});
				}
			},
			fail(e) {
				uni.hideLoading();
				uni.showToast({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
		// #ifdef APP-PLUS
		uni.showLoading({
			title: '正在下载'
		});
		uni.saveImageToPhotosAlbum({
			filePath: url,
			success: () => {
				uni.hideLoading();
				callback && callback();
				uni.showToast({
					title: '保存成功'
				});
			},
			fail(e) {
				uni.hideLoading();
				uni.showToast({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
	} else {
		uni.showToast({
			title: '未找到图片',
			icon: 'none'
		});
	}
};
// 保存视频
function tip(data) {
	setTimeout(() => {
		uni.showToast(data);
	}, 500);
}
export const saveVideo = function(url, callback) {
	if (url) {
		// #ifdef MP-WEIXIN
		if (settingWritePhotosAlbum) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						// let urlArr = url.split("/");
						// let updateUrl = urlArr[urlArr.length - 1];
						// let  filePath = wx.env.USER_DATA_PATH + '/' + updateUrl;
						uni.showLoading({
							title: '正在下载'
						});
						uni.downloadFile({
							url: url,
							// filePath: filePath,
							success: data => {
								if (data.statusCode == 200) {
									uni.saveVideoToPhotosAlbum({
										filePath: data.tempFilePath,
										success: () => {
											uni.hideLoading();
											callback && callback();
											tip({
												title: '保存成功'
											});
										},
										fail(e) {
											uni.hideLoading();
											tip({
												title: '下载失败，错误原因：' + e
													.errMsg,
												icon: "none"
											});
										}
									});
								} else {
									uni.hideLoading();
									tip({
										title: '下载失败',
										icon: "none"
									});
								}
							},
							fail(e) {
								uni.hideLoading();
								tip({
									title: '下载失败，错误原因：' + e.errMsg,
									icon: "none"
								});
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: '请先在设置页面打开“保存相册”使用权限',
							confirmText: '去设置',
							cancelText: '算了',
							success: data => {
								if (data.confirm) {
									uni.openSetting();
								}
							}
						});
					}
				}
			});
		} else {
			settingWritePhotosAlbum = true;
			uni.authorize({
				scope: 'scope.writePhotosAlbum',
				success: () => {
					// let urlArr = url.split("/");
					// let updateUrl = urlArr[urlArr.length - 1];
					// let filePath = wx.env.USER_DATA_PATH + '/' + updateUrl;
					uni.showLoading({
						title: '正在下载'
					});
					uni.downloadFile({
						url: url,
						// filePath: filePath,
						success: data => {
							if (data.statusCode == 200) {
								uni.saveVideoToPhotosAlbum({
									filePath: data.tempFilePath,
									success: () => {
										uni.hideLoading();
										callback && callback();
										tip({
											title: '保存成功'
										});
									},
									fail(e) {
										console.log("-----------------2", e);
										uni.hideLoading();
										tip({
											title: '下载失败，错误原因：' + e.errMsg,
											icon: "none"
										});
									}
								});
							} else {
								uni.hideLoading();
								tip({
									title: '下载失败，错误原因：' + data.errMsg,
									icon: "none"
								});
							}
						},
						fail(e) {
							uni.hideLoading();
							tip({
								title: '下载失败，错误原因：' + e.errMsg,
								icon: "none"
							});
						}
					});
				}
			});
		}
		// #endif
		// #ifdef H5
		uni.showLoading({
			title: '正在下载'
		});
		uni.downloadFile({
			url: url,
			success: data => {
				uni.hideLoading();
				if (data.statusCode == 200) {
					callback && callback();
					window.open(data.tempFilePath);
				} else {
					tip({
						title: '下载失败',
						icon: "none"
					});
				}
			},
			fail(e) {
				uni.hideLoading();
				tip({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
		// #ifdef APP-PLUS
		uni.showLoading({
			title: '正在下载'
		});
		uni.saveVideoToPhotosAlbum({
			filePath: url,
			success: () => {
				uni.hideLoading();
				callback && callback();
				tip({
					title: '保存成功'
				});
			},
			fail(e) {
				uni.hideLoading();
				tip({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
	} else {
		tip({
			title: '未找到视频',
			icon: 'none'
		});
	}
};
// 微信小程序获取定位权限判断
function wxAppletsLocation(successCallback, errCallback) {
	uni.getSetting({
		success: res => {
			if (res.authSetting['scope.userLocation']) {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						successCallback(res);
					},
					fail: (err) => {
						console.log("位置信息错误", err);
						errCallback("位置信息获取失败");
					}
				});
			} else {
				errCallback("“位置信息”未授权");
				uni.showModal({
					title: '提示',
					content: '请先在设置页面打开“位置信息”使用权限',
					confirmText: '去设置',
					cancelText: '再逛会',
					success: res => {
						if (res.confirm) {
							uni.openSetting();
						}
					}
				});
			}
		}
	});
}
// 获取地址信息
let locationAuthorize = true;
export const getAppWxLatLon = function(successCallback, errCallback) {
	const _this = this;
	// #ifdef MP
	if (locationAuthorize) {
		uni.authorize({
			scope: 'scope.userLocation',
			success: () => {
				wxAppletsLocation(successCallback, errCallback);
				locationAuthorize = false;
			},
			fail: () => {
				locationAuthorize = false;
			}
		});
	} else {
		wxAppletsLocation(successCallback, errCallback);
	}
	// #endif
	// #ifdef APP-PLUS
	judgePermission("location", function(result) {
		if (result == 1) {
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					// store.commit("setCurrentAddress", {
					// 	latitude: res.latitude,
					// 	longitude: res.longitude
					// });
					successCallback(res);
				},
				fail: (err) => {
					console.log("位置信息错误", err);
					errCallback("位置信息获取失败");
				}
			});
		}
	});
	// #endif
}

//金额过滤
Vue.filter('money', function(val) {
	console.log(val);
	if (val) {
		let value = Math.round(parseFloat(val) * 100) / 100;
		let valMoney = value.toString().split(".");
		if (valMoney.length == 1) {
			value = value.toString() + ".00";
			return value;
		}
		if (valMoney.length > 1) {
			if (valMoney[1].length < 2) {
				value = value.toString() + "0";
			}
			return value;
		}
		return value;
	} else {
		return "0.00";
	}
});
//时间格式化
Vue.filter('timeFormat', function(val, fmt = 'yyyy-MM-dd hh:mm:ss') {
	if (val) {
		return new Date(val).format(fmt);
	} else {
		return "";
	}
});
