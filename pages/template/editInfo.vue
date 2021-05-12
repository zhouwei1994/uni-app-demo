<template>
	<view class="page">
		<z-nav-bar title="个人信息" bgColor="#F5f5f5"></z-nav-bar>
		<view class="cell_list" @click="onUnloadImg">
			<view class="cell_left txt">头像</view>
			<view class="cell_right">
				<image :src="avatar" mode="aspectFill"></image>
			</view>
		</view>
		<z-prompt :value="nickname" text="请输入昵称" @confirm="onNameChange" :options="popupOptions">
			<view class="cell_list">
				<view class="cell_left txt">昵称</view>
				<view class="cell_right arrow">{{ nickname }}</view>
			</view>
		</z-prompt>
		<z-prompt :value="phone" text="请输入手机号" @confirm="onPhoneChange" :options="popupOptions">
			<view class="cell_list">
				<view class="cell_left txt">手机号</view>
				<view class="cell_right arrow">{{ phone }}</view>
			</view>
		</z-prompt>
		<!-- 按钮 -->
		<view class="form_but"><button class="active" @click="onSubmit">保存</button></view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				popupOptions: {
					placeholder: ''
				},
				avatar: '',
				nickname: '',
				phone: ""
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		//第一次加载
		onLoad(e) {
			this.avatar = this.userInfo.avatar || "";
			this.nickname = this.userInfo.nickname || "";
			this.phone = this.userInfo.phone || "";
		},
		//页面显示
		onShow() {},
		//方法
		methods: {
			...mapMutations(['setUserInfo']),
			//修改昵称
			onNameChange(e) {
				this.nickname = e.value;
				e.close();
			},
			//修改手机号
			onPhoneChange(e) {
				if (!this.$base.phoneRegular.test(e.value)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				this.phone = e.value;
				e.close();
			},
			//修改头像
			onUnloadImg() {
				this.$http.urlImgUpload("api/common/v1/upload_image", {
					count: 1
				}).then(res => {
					this.avatar = res[0].url;
				});
			},
			//提交
			onSubmit() {
				if (this.avatar == '') {
					uni.showToast({
						title: '请上传头像',
						icon: 'none'
					});
					return;
				}
				if (this.nickname == '') {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					});
					return;
				}
				let httpData = {
					nickname: this.nickname,
					avatar: this.avatar
				};
				if(this.phone){
					if (!this.$base.phoneRegular.test(this.phone)) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none'
						});
						return;
					}
					if(this.phone != this.userInfo.phone){
						httpData.phone = this.phone;
					}
				}
				this.$http
					.post('api/common/v1/edit_user_info', httpData)
					.then(res => {
						this.setUserInfo({
							nickname: this.nickname,
							avatar: this.avatar,
							phone: this.phone || this.userInfo.phone
						});
						uni.showToast({
							title: '修改成功！'
						});
					});
			}
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下来刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			return this.wxShare();
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.cell_list {
		padding: 30rpx 30rpx;
		margin: 20rpx 30rpx 0 30rpx;
		border-radius: 8rpx;
	}

	.cell_right image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
	}
</style>
