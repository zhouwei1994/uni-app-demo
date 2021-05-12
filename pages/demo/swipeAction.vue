<template>
	<view>
		<z-nav-bar title="滑动操作"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_head">
				<text>组件参数</text>
				<text>类型</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>options</text>
				<text>Array</text>
				<text> [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}}]</text>
			</view>
			<view class="table_content">
				<text>disabled</text>
				<text>Boolean</text>
				<text>默认false ，是否禁止滑动</text>
			</view>
			<view class="table_content">
				<text>show</text>
				<text>Boolean</text>
				<text>默认false ，是否打开</text>
			</view>
			<view class="table_content">
				<text>autoClose</text>
				<text>Boolean</text>
				<text>默认true ，是否自动关闭</text>
			</view>
			<view class="table_content">
				<text>index</text>
				<text>Number</text>
				<text>默认0 ，索引值，通过@button传递出去</text>
			</view>
			<view class="table_content">
				<text>@button</text>
				<text>function</text>
				<text>左滑按钮点击事件</text>
			</view>
		</view>
		<view class="swipe_action_list">
			<z-swipe-action :options="options" :show="show"><view class="swipe_action">滑动</view></z-swipe-action>
		</view>
		<view class="swipe_action_list">
			<z-swipe-action :options="options2" disabled><view class="swipe_action">禁止滑动</view></z-swipe-action>
		</view>
		<view v-for="(item, index) of 3" :key="index" class="swipe_action_list">
			<z-swipe-action :options="options3" :index="index" @button="onButton" @click="onClock(index)">
				<view class="swipe_action">滑动列表{{ index + 1 }}</view>
			</z-swipe-action>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				},
				{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			options2: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			options3: [
				{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			show: true
		};
	},
	//第一次加载
	onLoad(e) {
		setInterval(() => {
			this.show = !this.show;
		}, 5000);
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onButton(e) {
			uni.showToast({
				title: '您点击了滑动列表' + (e.index + 1) + '的第' + (e.buttonIndex + 1) + '个按钮，按钮为‘' + e.content.text + '’',
				icon: 'none'
			});
		},
        onClock(index){
            console.log(index);
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
<style scoped>
.swipe_action_list {
	border-bottom-width: 2rpx;
	border-bottom-color: #eee;
	border-bottom-style: solid;
}
.swipe_action {
	background-color: #ffffff;
	padding: 50rpx 30rpx;
}
</style>
