<script>
import store from '@/store/index.js';
import socket from '@/config/socket';
// #ifdef H5
import { h5Login } from '@/config/html5Utils';
// #endif
// #ifdef APP-PLUS
import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
// #endif
export default {
	onLaunch: function(e) {
		//取出缓存数据
		store.commit('setCacheData');
		// #ifdef MP-WEIXIN
		if (store.state.userInfo.token) {
			socket.init();
		}
		// #endif
		// #ifdef H5
		if (store.state.userInfo.token) {
			socket.init();
		} else {
			h5Login('force', () => {
				socket.init();
			});
		}
		// #endif
		// #ifdef APP-PLUS
		if (store.state.userInfo.token) {
			socket.init();
		}
		APPUpdate();
		// #endif
	},
	onShow: function(e) {
		// #ifdef MP-WEIXIN
		//获取二维码携带的参数
		let scene = decodeURIComponent(e.query.scene);
		scene = scene.split('&');
		let data = {
			//场景值
			scene: e.scene
		};
		scene.forEach(item => {
			let arr = item.split('=');
			if (arr.length == 2) {
				data[arr[0]] = arr[1];
			}
		});
		store.commit('setChatScenesInfo', Object.assign(e.query, data));
		//小程序更新
		if (uni.getUpdateManager) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate);
			});
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '已经有新版本了哟~',
					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
					showCancel: false
				});
			});
		}
		// #endif
	},
	onHide: function() {}
};
</script>

<style lang="scss">
/* #ifndef APP-NVUE */
@import './style/common.scss';
@import './style/input.scss';
@import './style/table.scss';
page {
	height: 100%;
	background-color: #f5f5f5;
}
/* #endif */

/* #ifdef H5 */
//修复H5底部导航挡住内容bug
uni-app {
	height: auto;
}

//修复H5输入框上下不居中bug
.uni-input-form {
	height: 100%;
}
//去除地图上高德地图标识符
.amap-copyright {
	display: none !important;
}

.amap-logo {
	display: none !important;
}

.amap-ui-control-zoom {
	width: 60upx !important;
}

.amap-ui-control-zoom > * {
	width: 60upx !important;
	height: 60upx !important;
	line-height: 60upx !important;
}

.amap-ui-control-theme-dark {
	display: none !important;
}
/* #endif */
</style>
