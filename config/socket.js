import base from '@/config/baseUrl';
import store from '@/store';
class socket {
	constructor(options) {
		//地址
		this.socketUrl = base.socketUrl;
		this.socketStart = false;
		this.monitorSocketError();
		this.monitorSocketClose();
		this.socketReceive();
	}
	init(callback) {
		const _this = this;
		if (base.socketUrl) {
			if(this.socketStart){
				console.log('webSocket已经启动了');
			}else{
				uni.connectSocket({
					url: this.socketUrl,
					method: 'GET'
				});
				uni.onSocketOpen((res) => {
					this.socketStart = true;
					callback && callback();
					console.log('WebSocket连接已打开！');
				});
				setTimeout(() => {
					_this.getHeartbeat();
				}, 5000);
			}
		}else{
			console.log('config/baseUrl socketUrl为空');
		}
	}
	//Socket给服务器发送消息
	send(data, callback) {
		const _this = this;
		if (store.state.userInfo.uid) {
			data.userUid = store.state.userInfo.uid;
		}
		console.log(data);
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: () => {
				callback && callback(true);
			},
			fail: () => {
				callback && callback(false);
			}
		});
	}
	//Socket接收服务器发送过来的消息
	socketReceive() {
		const _this = this;
		uni.onSocketMessage(function(res) {
			let data = JSON.parse(res.data);
			console.log('收到服务器内容：', data);
			_this.acceptMessage && _this.acceptMessage(data);
		});
	}
	//关闭Socket
	closeSocket() {
		uni.closeSocket();
		_this.socketStart = false;
	}
	//监听Socket关闭
	monitorSocketClose() {
		const _this = this;
		uni.onSocketClose(function(res) {
			console.log('WebSocket 已关闭！');
			_this.socketStart = false;
			setTimeout(function() {
				_this.init();
			}, 3000);
		});
	}
	//监听Socket错误
	monitorSocketError() {
		const _this = this;
		uni.onSocketError(function(res) {
			_this.socketStart = false;
			console.log('WebSocket连接打开失败，请检查！');
		});
	}
	//心跳
	getHeartbeat() {
		const _this = this;
		this.send({
			type: "心跳",
			userUid: store.state.userInfo.userUid
		}, (val) => {
			setTimeout(() => {
				if (val) {
					_this.getHeartbeat();
				} else {
					_this.init();
				}
			}, 10000);
		});
	}
};
const mySocket = new socket();
export default mySocket;
