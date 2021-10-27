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
	let dataValue = value;
	if (typeof value == "string") {
	  dataValue = new Date(value.replace(/-/g, "/")).getTime();
	}
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = parseInt(now) - parseInt(dataValue);
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
Vue.filter('dateDiff', function(val) {
	if (val) {
		return clickDateDiff(val);
	} else {
		return "";
	}
});
// 时间距离现在多少天前
Vue.filter('timeFormat', function(val, fmt = 'yyyy-MM-dd hh:mm:ss') {
	if (val) {
		if(typeof val == "string"){
			let timeText = val.replace(/-/g, "/");
			return new Date(timeText).format(fmt);
		} else if(typeof val == "number"){
			return new Date(val).format(fmt);
		}
	} else {
		return "";
	}
});
// #ifdef APP-PLUS
// 文字换行
function drawtext(text, maxWidth) {
	let textArr = text.split("");
	let len = textArr.length;
	// 上个节点
	let previousNode = 0;
	// 记录节点宽度
	let nodeWidth = 0;
	// 文本换行数组
	let rowText = [];
	// 如果是字母，侧保存长度
	let letterWidth = 0;
	// 汉字宽度
	let chineseWidth = 16;
	// otherFont宽度
	let otherWidth = 8;
	for (let i = 0; i < len; i++) {
		if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
			if(letterWidth > 0){
				if(nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
					letterWidth = 0;
				} else {
					nodeWidth += chineseWidth + letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else {
				if(nodeWidth + chineseWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
				}else{
					nodeWidth += chineseWidth;
				}
			}
		} else {
			if(/\n/g.test(textArr[i])){
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 1;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(textArr[i] == "\\" && textArr[i + 1] == "n"){
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 2;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(/[a-zA-Z0-9]/g.test(textArr[i])){
				letterWidth += 1;
				if(nodeWidth + letterWidth * otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i + 1 - letterWidth)
					});
					previousNode = i + 1 - letterWidth;
					nodeWidth = letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else{
				if(nodeWidth + otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = otherWidth;
				}else{
					nodeWidth += otherWidth;
				}
			}
		}
	}
	if (previousNode < len) {
		rowText.push({
			type: "text",
			content: text.substring(previousNode, len)
		});
	}
	return rowText;
}
// 重写app弹窗
uni.showModal = function(options){
	let optionsObj = Object.assign({
		title: "提示",
		content: "自定义内容", 
		align: "center", // 对齐方式 left/center/right
		cancelText: "取消", // 取消按钮的文字
		cancelColor: "#8F8F8F", // 取消按钮颜色
		confirmText: "确定", // 确认按钮文字
		confirmColor: "#1C79D6", // 确认按钮颜色 
		showCancel: true, // 是否显示取消按钮，默认为 true
	}, options);
	// 以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
	const screenWidth = plus.screen.resolutionWidth;
	const screenHeight = plus.screen.resolutionHeight;
	//弹窗容器宽度
	const popupViewWidth = screenWidth * 0.8;
	// 弹窗容器的Padding
	const viewContentPadding = 20;
	
	// 弹窗容器的宽度
	const viewContentWidth = parseInt(popupViewWidth - (viewContentPadding * 2));
	// 描述的列表
	const descriptionList = drawtext(optionsObj.content, viewContentWidth);
	// 弹窗高度
	let popupViewHeight = 168;
	// 弹窗遮罩层
	let maskLayer = new plus.nativeObj.View("maskLayer", { //先创建遮罩层
		top: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)'
	});
	let popupViewContentList = [{
		tag: 'font',
		id: 'title',
		text: optionsObj.title,
		textStyles: {
			size: '18px',
			color: "#333",
			weight: "bold",
			whiteSpace: "normal"
		},
		position: {
			top: viewContentPadding + "px",
			left: viewContentPadding + "px",
			width: viewContentWidth + "px",
			height: "30px",
		}
	}];
	const textHeight = 22;
	let contentTop = 65;
	descriptionList.forEach((item,index) => {
		if(index > 0){
			popupViewHeight += textHeight;
			contentTop += textHeight;
		}
		popupViewContentList.push({
			tag: 'font',
			id: 'content' + index + 1,
			text: item.content,
			textStyles: {
				size: '16px',
				color: "#333",
				lineSpacing: "50%",
				align: optionsObj.align
			},
			position: {
				top: contentTop + "px",
				left: viewContentPadding + "px",
				width: viewContentWidth + "px",
				height: textHeight + "px",
			}
		});
		if(item.type == "break"){
			contentTop += 10;
			popupViewHeight += 10;
		}
	});
	popupViewContentList.push({
		tag: 'rect',
		id: 'lineTop',
		rectStyles: {
			color: "#f1f1f1",
		},
		position: {
			top: contentTop + 50 + "px",
			left: "0px",
			width: "100%",
			height: "1px",
		}
	});
	if(optionsObj.showCancel){
		popupViewContentList.push({
			tag: 'rect',
			id: 'line',
			rectStyles: {
				color: "#f1f1f1",
			},
			position: {
				top: contentTop + 50 + "px",
				left: popupViewWidth / 2 + "px",
				width: "1px",
				height: "50px",
			}
		});
		popupViewContentList.push({
			tag: 'font',
			id: 'cancelText',
			text: optionsObj.cancelText,
			textStyles: {
				size: '16px',
				color: optionsObj.cancelColor,
			},
			position: {
				top: contentTop + 50 + "px",
				left: "0px",
				width: popupViewWidth / 2 + "px",
				height: "50px",
			}
		});
		popupViewContentList.push({
			tag: 'font',
			id: 'confirmText',
			text: optionsObj.confirmText,
			textStyles: {
				size: '16px',
				color: optionsObj.confirmColor,
			},
			position: {
				top: contentTop + 50 + "px",
				left: popupViewWidth / 2 + "px",
				width: popupViewWidth / 2 + "px",
				height: "50px",
			}
		});
	} else {
		popupViewContentList.push({
			tag: 'font',
			id: 'confirmText',
			text: optionsObj.confirmText,
			textStyles: {
				size: '16px',
				color: optionsObj.confirmColor,
			},
			position: {
				top: contentTop + 50 + "px",
				left: "0px",
				width: "100%",
				height: "50px",
			}
		});
	}
	// 弹窗内容
	let popupView = new plus.nativeObj.View("popupView", { //创建底部图标菜单
		tag: "rect",
		top: (screenHeight - popupViewHeight) / 2 + "px",
		left: '10%',
		height: popupViewHeight + "px",
		width: "80%"
	});
	// 绘制白色背景
	popupView.drawRect({
		color: "#FFFFFF",
		radius: "8px"
	}, {
		top: "0px",
		height: popupViewHeight + "px",
	});
	popupView.draw(popupViewContentList);
	popupView.addEventListener("click", function(e) {
		if(optionsObj.showCancel){
			if (e.clientY > popupViewHeight - 50 && e.clientX < popupViewWidth / 2) {
				// 取消
				maskLayer.close();
				popupView.close();
				options.success && options.success({confirm: false, cancel: true});
			} else if(e.clientY > popupViewHeight - 50 && e.clientX > popupViewWidth / 2){
				// 确定
				maskLayer.close();
				popupView.close();
				options.success && options.success({confirm: true, cancel: false});
			}
		} else {
			if (e.clientY > popupViewHeight - 50) {
				// 确定
				maskLayer.close();
				popupView.close();
				options.success && options.success({confirm: true, cancel: false});
			}
		}
	});
	// 显示弹窗
	maskLayer.show();
	popupView.show();
	options.complete && options.complete();
};
// #endif