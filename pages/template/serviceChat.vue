<template>
	<view>
		<nav-bar :title="title">
			<!-- <view slot="right" class="shop">店铺</view> -->
		</nav-bar>
		<!-- 聊天记录显示 -->
		<scroll-view class="chatRoomBox" :class="{ show: featuresShow }" :scroll-into-view="toView" scroll-y="true" @click="closeFeatures"
		 @scrolltoupper="loadChatHistory">
			<view class="chatRoomListBox">
				<view class="no_more_data" v-if="noMoreData">没有更多消息了</view>
				<view class="chatRoomlist" v-for="(item, index) of chatMsgList" :key="index" :id="'view' + index">
					<view class="chat_time">{{ item.messageTime }}</view>
					<!-- 设置自己消息|对方的消息 -->
					<view class="chatInfo" :class="[item.self ? 'chatRight' : 'chatLeft']">
						<!-- 用户头像 -->
						<image mode="aspectFill" v-if="item.self" class="chatuserImg" :src="userInfo.headImg || 'http://qn.kemean.cn/upload/202007/08/default_head_img.png'"></image>
						<image mode="aspectFill" v-else class="chatuserImg" :src="item.userImg || 'http://qn.kemean.cn/upload/202007/08/default_head_img.png'"></image>
						<view class="chatContentBox">
							<!-- 用户昵称 -->
							<view class="userName">{{ item.self ? userInfo.nickName : item.userNickName }}</view>
							<view class="chatContent">
								<!-- 文字消息 -->
								<view class="chatText" v-if="item.contentType == 'txt'">
									<view v-for="(childItem, childIndex) of item.content" :key="childIndex">
										<image v-if="childItem.type == 'img'" :src="childItem.url"></image>
										<text v-else>{{ childItem }}</text>
									</view>
								</view>

								<!-- 图片消息 -->
								<image @click="onPreviewImg(item.content)" class="chatImages" mode="aspectFit" v-else-if="item.contentType == 'img'"
								 :src="item.content"></image>
								<!-- 语音消息 -->
								<view class="chatText chatVoice" v-else-if="item.contentType == 'voice'">
									<text>2"</text>
									<!-- <image mode="aspectFit" src="/static/icon/voiceAnimation.gif"></image> -->
								</view>
								<!-- 消息发送中动画 -->
								<!-- <image class="loadState load" v-if="item.loadState == 1100" src="/static/icon/load2.png"></image> -->
								<!-- 消息发送失败动画 -->
								<!-- <image class="loadState failure" v-if="item.loadState == 1200" @click="onSendFailure" src="/static/icon/failure.png"></image> -->
								<!-- <text class="unread" v-if="item.send_type == 1 && item.msg_status == 0">未读</text>
								<text class="haveRead" v-if="item.send_type == 1 && item.msg_status == 1">已读</text> -->
							</view>
							<!-- <view class="prompt"></view> -->
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 发送聊天 -->
		<view class="chatSendBox">
			<view class="chatMessageBox" @click="closeFeatures">
				<!-- 输入框 -->
				<view class="inputBox"><input confirm-hold="true" v-model="sendValue" confirm-type="send" @confirm="onSendText" /></view>
				<button type="primary" class="emojis" @click.stop="featuresOpen('emojis')"></button>
				<button type="primary" class="more" @click.stop="featuresOpen('features')" v-if="!showSendBut"></button>
				<button type="primary" class="sendMsg" @click="onSendText" v-if="showSendBut">发送</button>
			</view>

			<view class="emojis_box" v-if="featuresShow == 'emojis'">
				<scroll-view scroll-y="true" class="emojis_list_box">
					<view>
						<image v-for="(item, index) of emojisViewList" :key="index" :src="item.url" @click="onAddEmojis(item)" mode="aspectFit"></image>
					</view>
				</scroll-view>
			</view>
			<view class="features_box" v-if="featuresShow == 'features'">
				<view class="features_list" @click="onUploadImg">
					<view class="features_img">
						<image src="../../static/icon/ic_pictures.png" mode="aspectFit"></image>
					</view>
					<text>图片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import socket from '@/config/socket.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import '@/utils/utils';
	let lastTime = 0;
	export default {
		data() {
			return {
				//聊天记录
				chatMsgList: [],
				//分页页数
				pageNo: 1,
				//总页数
				pages: 1,
				//是否有数据
				noData: false,
				//输入框的值
				sendValue: '',
				//是否可查聊天记录
				canLoad: true,
				//房间id
				roomId: '',
				//房间信息
				roomInfo: {},
				//最后一条ID
				toView: '',
				//更多功能
				featuresShow: '',
				//表情名
				emojisList: [
					'[微笑]',
					'[嘻嘻]',
					'[哈哈]',
					'[可爱]',
					'[可怜]',
					'[挖鼻]',
					'[吃惊]',
					'[害羞]',
					'[挤眼]',
					'[闭嘴]',
					'[鄙视]',
					'[爱你]',
					'[泪]',
					'[偷笑]',
					'[亲亲]',
					'[生病]',
					'[太开心]',
					'[白眼]',
					'[右哼哼]',
					'[左哼哼]',
					'[嘘]',
					'[衰]',
					'[委屈]',
					'[吐]',
					'[哈欠]',
					'[抱抱]',
					'[怒]',
					'[疑问]',
					'[馋嘴]',
					'[拜拜]',
					'[思考]',
					'[汗]',
					'[困]',
					'[睡]',
					'[钱]',
					'[失望]',
					'[酷]',
					'[色]',
					'[哼]',
					'[鼓掌]',
					'[晕]',
					'[悲伤]',
					'[抓狂]',
					'[黑线]',
					'[阴险]',
					'[怒骂]',
					'[互粉]',
					'[心]',
					'[伤心]',
					'[猪头]',
					'[熊猫]',
					'[兔子]',
					'[ok]',
					'[耶]',
					'[good]',
					'[NO]',
					'[赞]',
					'[来]',
					'[弱]',
					'[草泥马]',
					'[神马]',
					'[囧]',
					'[浮云]',
					'[给力]',
					'[围观]',
					'[威武]',
					'[奥特曼]',
					'[礼物]',
					'[钟]',
					'[话筒]',
					'[蜡烛]',
					'[蛋糕]'
				],
				emojisViewList: [],
				//显示发送按钮
				showSendBut: false,
				// 商家类型
				shopType: 1501,
				// 消息类型、接受者类型
				type: "service",
				// 没有更多消息
				noMoreData: false,
				// 标题
				title: "聊天室"
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			/*监听输入框值*/
			sendValue(val) {
				if (val) {
					this.showSendBut = true;
				} else {
					this.showSendBut = false;
				}
			}
		},
		//第一次加载
		onLoad(e) {
			if (e.objId) {
				this.roomId = e.objId;
				socket.roomId = e.objId;
				this.title = e.roomName;
				uni.setNavigationBarTitle({
					title: e.roomName
				});
			}
			if (e.shopType) {
				this.shopType = e.shopType;
			}
			const _this = this;
			socket.getPageReceive = function(res) {
				// res.messageTime = new Date(res.messageTime).format('yyyy-MM-dd hh:mm');
				if (res.contentType == 'txt') {
					res.content = JSON.parse(res.content);
				}
				_this.chatMsgList.push(res);
				setTimeout(() => {
					_this.toView = 'view' + (_this.chatMsgList.length - 1);
				},100);
			};
			this.getEmojisList();
			this.loadChatHistory();
		},
		//方法
		methods: {
			loadChatHistory() {
				if (this.pageNo <= this.pages) {
					var httpData = {
						pageNo: this.pageNo,
						pageSize: 10
					};
					httpData.shopId = this.roomId;
					httpData.shopType = this.shopType;
					this.$http.post('/api/im/session/v1/record', httpData).then(res => {
						this.pages = res.pages;
						let datalen = res.data.length;
						if (datalen > 0) {
							res.data.map(item => {
								if (item.contentType == 'txt') {
									item.content = JSON.parse(item.content);
								}
								return item;
							});
							res.data = res.data.reverse();
							this.chatMsgList = res.data.concat(this.chatMsgList);
							this.$nextTick(() => {
								setTimeout(() => {
									if (this.pageNo == 1) {
										this.toView = 'view' + (this.chatMsgList.length - 1);
									} else {
										this.toView = 'view' + (datalen - 1);
									}
									this.pageNo = this.pageNo + 1;
								}, 50);
							})
						} else if (this.pageNo == 1) {
							this.noData = true;
						}
					});
				} else {
					this.noMoreData = true;
				}
			},
			// 判断是否显示时间
			getShowMsgTime(time) {
				if (time - lastTime >= 300000) {
					return {
						timeText: new Date(time).format('yyyy-MM-dd hh:mm'),
						showTime: true
					};
				} else {
					return {
						timeText: time,
						showTime: false
					};
				}
			},
			//获取表情视图列表
			getEmojisList() {
				let emojisViewList = [];
				this.emojisList.forEach((item, index) => {
					emojisViewList.push({
						name: item,
						url: 'https://qn.kemean.cn/upload/201905/28/' + index + '.gif'
					});
				});
				this.emojisViewList = emojisViewList;
			},
			//输入框添加表情
			onAddEmojis(item) {
				this.sendValue += item.name;
			},
			//发送文本消息
			onSendText() {
				if (this.sendValue == '') {
					uni.showToast({
						title: '请输入要发送的内容',
						icon: 'none',
						duration: 2500
					});
					return;
				}
				var textArr = this.sendValue.split('');
				var textArrLen = textArr.length;
				var newText = '';
				textArr.forEach((item, index) => {
					if (item == '[') {
						if (index !== 0) {
							newText += '&&&' + item;
						} else {
							newText += item;
						}
					} else if (item == ']') {
						if (textArr[index + 1] !== '[' && index !== textArrLen - 1) {
							newText += item + '&&&';
						} else {
							newText += item;
						}
					} else {
						newText += item;
					}
				});
				var newTextList = newText.split('&&&');
				newTextList = newTextList.map(item => {
					if (/\[(.*?)\]/.test(item)) {
						this.emojisViewList.forEach(childItem => {
							if (childItem.name === item) {
								let data = {};
								data.type = 'img';
								data.url = childItem.url;
								data.text = item;
								item = data;
							}
						});
					}
					return item;
				});

				const sendInfo = {
					toShopId: this.roomId,
					toShopType: this.shopType,
					messageType: this.type,
					content: newTextList,
					contentType: 'txt'
				};
				this.chatMsgList.push({
					...sendInfo,
					userUid: this.userInfo.userUid,
					userNickName: this.userInfo.nickName,
					userImg: this.userInfo.headImg,
					userSexMan: this.userInfo.sexBoy,
					messageTime: new Date().format('yyyy-MM-dd hh:mm'),
					targetUid: this.roomId,
					self: true
				});
				socket.send(sendInfo);
				this.$nextTick(() => {
					this.toView = 'view' + (this.chatMsgList.length - 1);
					this.sendValue = '';
				});
			},
			//上传图片
			onUploadImg() {
				this.$http.qnImgUpload({
					count: 9
				}, res => {
					const sendInfo = {
						toShopId: this.roomId,
						toShopType: this.shopType,
						messageType: this.type,
						content: res,
						contentType: 'img'
					};
					this.chatMsgList.push({
						...sendInfo,
						userUid: this.userInfo.userUid,
						userNickName: this.userInfo.nickName,
						userImg: this.userInfo.headImg,
						userSexMan: this.userInfo.sexBoy,
						messageTime: new Date().format('yyyy-MM-dd hh:mm'),
						targetUid: this.roomId,
						self: true
					});
					this.$nextTick(() => {
						this.toView = 'view' + (this.chatMsgList.length - 1);
					});
					socket.send(sendInfo);
					this.closeFeatures();
				});
			},
			// 打开更多功能
			featuresOpen(value) {
				this.featuresShow = value;
			},
			//关闭更多功能
			closeFeatures() {
				this.featuresShow = '';
			},
			//图片预览
			onPreviewImg(url) {
				url = encodeURI(url);
				var imgs = [];
				this.chatMsgList.forEach(item => {
					if (item.contentType == 'img') {
						imgs.push(encodeURI(item.content));
					}
				});
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: imgs // 需要预览的图片http链接列表
				});
			}
		},
		//页面显示
		onShow() {},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {
			socket.roomId = '';
		},
		//页面下来刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			return this.$base.share();
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.shop {
		margin-right: 30rpx;
		width: 80rpx;
		height: 40rpx;
		@include theme("gradient_bg");
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #ffffff;
		text-align: center;
		line-height: 40rpx;
	}

	// 无更多消息
	.no_more_data {
		text-align: center;
		font-size: 28rpx;
		color: #9d9d9d;
		padding-top: 20rpx;
	}

	.chatRoomBox {
		background-color: #ededed;
	}

	.chatRoomBox.show {
		height: calc(100vh - 590rpx - var(--status-bar-height));
	}

	.chatRoomBox {
		height: calc(100vh - 186rpx - var(--status-bar-height));
	}

	.chatRoomBox .chatRoomListBox {
		padding: 10rpx 20rpx 30rpx 20rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist {
		margin-top: 40rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo {
		display: flex;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatuserImg {
		width: 82rpx;
		height: 82rpx;
		background-color: #fff;
		flex-shrink: 0;
		border-radius: 8rpx;
	}

	/* 文字内容、商品信息内容 */

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox {
		max-width: calc(100% - 82rpx);
		display: flex;
		flex-direction: column;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .userName {
		font-size: 24rpx;
		color: #9d9d9d;
		line-height: 24rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent {
		max-width: 100%;
		margin-top: 10rpx;
		position: relative;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText {
		max-width: 100%;
		padding: 20rpx;
		border-radius: 8rpx;
		word-wrap: break-word;
		font-size: 30rpx;
		line-height: 150%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText view,
	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText text {
		word-wrap: break-all;
		max-width: 100%;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText image {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText::after {
		content: '';
		position: absolute;
		top: 15rpx;
		width: 0;
		height: 0;
		border-bottom: 10rpx solid transparent;
		border-top: 10rpx solid transparent;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .prompt {
		font-size: 24rpx;
		color: #9d9d9d;
		padding: 15rpx 20rpx;
		text-align: center;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .loadState {
		position: absolute;
		left: -60rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 40rpx;
		height: 40rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .loadState.load {
		animation: rotate 0.6s linear infinite;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .unread {
		position: absolute;
		left: -60rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 26rpx;
		color: rgb(242, 46, 75);
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .haveRead {
		position: absolute;
		left: -60rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 26rpx;
		color: #03c7b5;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chat_time {
		font-size: 24rpx;
		color: #9d9d9d;
		padding: 0rpx 20rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	@keyframes rotate {
		from {
			transform: translateY(-50%) rotate(0deg);
		}

		to {
			transform: translateY(-50%) rotate(360deg);
		}
	}

	/* 图片消息 */

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatImages {
		margin-top: 10rpx;
		border-radius: 8rpx;
		max-width: 400rpx;
		max-height: 400rpx;
		position: relative;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatImages image {
		max-width: 400rpx;
		max-height: 400rpx;
	}

	/* 语音消息 */

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText.chatVoice {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo .chatContentBox .chatContent .chatText.chatVoice image {
		height: 36rpx;
		width: 36rpx;
		margin-left: 15rpx;
	}

	/* 左边聊天消息 */

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatLeft {
		padding-right: 80rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatLeft .chatuserImg {
		margin-right: 30rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatLeft .chatContentBox {
		align-items: flex-start;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatLeft .chatContentBox .chatContent .chatText {
		background-color: #fff;
		color: #000;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatLeft .chatContentBox .chatContent .chatText::after {
		border-right: 18rpx solid #fff;
		left: -15rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatLeft .chatContentBox .chatContent .chatText.chatVoice {
		padding-right: 50rpx;
	}

	/* 右边聊天消息 */

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight {
		padding-left: 80rpx;
		flex-direction: row-reverse;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight .chatuserImg {
		margin-left: 30rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight .chatContentBox {
		align-items: flex-end;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight .chatContentBox .userName {
		text-align: right;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight .chatContentBox .chatContent .chatText {
		background-color: $themeColor;
		color: #FFF;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight .chatContentBox .chatContent .chatText::after {
		border-left: 18rpx solid $themeColor;
		right: -15rpx;
	}

	.chatRoomBox .chatRoomListBox .chatRoomlist .chatInfo.chatRight .chatContentBox .chatContent .chatText.chatVoice {
		padding-left: 50rpx;
	}

	/* 发送聊天  */

	.chatSendBox .chatMessageBox {
		background-color: #FFF;
		height: 98rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		border-top: 1rpx solid #eee;
		border-bottom: 1rpx solid #eee;
		box-sizing: border-box;
	}

	.chatSendBox .chatMessageBox image {
		width: 54rpx;
		height: 54rpx;
	}

	.chatSendBox .chatMessageBox .inputBox {
		height: 72rpx;
		line-height: 72rpx;
		background-color: #f7f7f7;
		border-radius: 36rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		color: #080809;
		font-size: 30rpx;
		flex: 1;
	}

	.chatSendBox .chatMessageBox .inputBox input {
		color: #080809;
		font-size: 30rpx;
		height: 76rpx;
	}

	.chatSendBox .chatMessageBox .emojis,
	.chatSendBox .chatMessageBox .more {
		width: 56rpx;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 10rpx;
		padding: 0;
		margin: 0;
		font-size: 30rpx;
		color: #ffffff;
		background-color: transparent;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		margin-left: 30rpx;
	}

	.chatSendBox .chatMessageBox .emojis {
		background-image: url('../../static/icon/icon_biaoqing.png');
	}

	.chatSendBox .chatMessageBox .more {
		background-image: url('../../static/icon/icon_tianjianeirong.png');
	}

	.chatSendBox .chatMessageBox .sendMsg {
		padding: 0 15rpx;
		background-color: $themeColor;
		border-radius: 10rpx;
		color: #fff;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 28rpx;
		margin-left: 30rpx;
	}

	.chatSendBox .features_box {
		display: flex;
		flex-wrap: wrap;
		padding: 30rpx 0;
		height: 400rpx;

		.features_list {
			width: 25%;
			height: 160rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.features_img {
				width: 110rpx;
				height: 110rpx;
				background-color: #ffffff;
				border-radius: 18rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 46rpx;
					height: 46rpx;
				}
			}

			text {
				font-size: 24rpx;
				color: #666666;
				margin-top: 20rpx;
			}
		}
	}

	//表情
	.emojis_box {
		height: 400rpx;

		.emojis_list_box {
			padding: 15rpx;
			height: 400rpx;

			view {
				display: flex;
				flex-wrap: wrap;

				image {
					width: 70rpx;
					height: 70rpx;
					padding: 10rpx;
				}
			}
		}
	}
</style>
