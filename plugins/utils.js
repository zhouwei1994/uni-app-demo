// #ifdef APP-PLUS
import { judgePermission } from './permission'
// #endif
/**
 * 时间转换为XX前
 */
export const clickDateDiff = function (value) {
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
Date.prototype.format = function (fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz 
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
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
// 保存图片
let settingWritePhotosAlbum = false;
export const saveImg = function(url,callback) {
	if (url) {
		// #ifdef MP-WEIXIN
		if (settingWritePhotosAlbum) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						uni.downloadFile({
							url: url,
							success: data => {
								if (data.statusCode == 200) {
									uni.saveImageToPhotosAlbum({
										filePath: data.tempFilePath,
										success: () => {
											callback && callback();
											uni.showToast({
												title: '保存成功'
											});
										}
									});
								}
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
					uni.downloadFile({
						url: url,
						success: data => {
							if (data.statusCode == 200) {
								uni.saveImageToPhotosAlbum({
									filePath: data.tempFilePath,
									success: () => {
										callback && callback();
										uni.showToast({
											title: '保存成功'
										});
									}
								});
							}
						}
					});
				}
			});
		}
		// #endif
		// #ifdef H5
		uni.downloadFile({
			url: url,
			success: data => {
				if (data.statusCode == 200) {
					callback && callback();
					window.open(data.tempFilePath);
				}
			}
		});
		// #endif
		// #ifdef APP-PLUS
		uni.saveImageToPhotosAlbum({
			filePath: url,
			success: () => {
				callback && callback();
				uni.showToast({
					title: '保存成功'
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
export const saveVideo = function(url,callback) {
	if (url) {
		// #ifdef MP-WEIXIN
		if (settingWritePhotosAlbum) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						uni.downloadFile({
							url: url,
							success: data => {
								if (data.statusCode == 200) {
									uni.saveVideoToPhotosAlbum({
										filePath: data.tempFilePath,
										success: () => {
											callback && callback();
											uni.showToast({
												title: '保存成功'
											});
										}
									});
								}
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
					uni.downloadFile({
						url: url,
						success: data => {
							if (data.statusCode == 200) {
								uni.saveVideoToPhotosAlbum({
									filePath: data.tempFilePath,
									success: () => {
										callback && callback();
										uni.showToast({
											title: '保存成功'
										});
									}
								});
							}
						}
					});
				}
			});
		}
		// #endif
		// #ifdef H5
		uni.downloadFile({
			url: url,
			success: data => {
				if (data.statusCode == 200) {
					callback && callback();
					window.open(data.tempFilePath);
				}
			}
		});
		// #endif
		// #ifdef APP-PLUS
		uni.saveVideoToPhotosAlbum({
			filePath: url,
			success: () => {
				callback && callback();
				uni.showToast({
					title: '保存成功'
				});
			}
		});
		// #endif
	} else {
		uni.showToast({
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