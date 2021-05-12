<template>
	<view>
		<z-nav-bar title="弹窗使用"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<!-- <view class="table_title">组件说明</view> -->
			<view class="table_head">
				<text>组件参数</text>
				<text>类型</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>v-model</text>
				<text>Boolean</text>
				<text>控制弹窗显示隐藏</text>
			</view>
			<view class="table_content">
				<text>hideOnBlur</text>
				<text>Boolean</text>
				<text>是否点击遮罩层关闭弹窗</text>
			</view>
			<view class="table_content">
				<text>type</text>
				<text>String</text>
				<text>bottom（默认值）靠下，center 居中, top 靠上</text>
			</view>
			<view class="table_content">
				<text>offset</text>
				<text>Number</text>
				<text>偏移，type=bottom 朝上偏移，type=center无效， type=top 朝下偏移</text>
			</view>
			<view class="table_content">
				<text>zIndex</text>
				<text>Number</text>
				<text>层级</text>
			</view>
			<view class="table_content">
				<text>@change</text>
				<text>function</text>
				<text>窗口显示隐藏变化事件</text>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box">
				<view class="name required">上边弹窗</view>
				<view class="select_info" @click="popupShow4 = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">下边弹窗</view>
				<view class="select_info" @click="popupShow = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">居中弹窗，</view>
				<view class="select_info" @click="popupShow2 = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">点击遮罩层不关闭</view>
				<view class="select_info" @click="popupShow3 = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">弹窗偏移</view>
				<view class="select_info" @click="popupShow5 = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
		</view>
		<z-popup v-model="popupShow" @change="onChange">
			<view class="popup_title">
				<text @click="popupShow = false">取消</text>
				<view>弹窗标题</view>
				<text @click="popupShow = false">确定</text>
			</view>
			<view class="popup_content">
				弹窗内容
			</view>
		</z-popup>
		<z-popup v-model="popupShow2" type="center" @change="onChange">
			<view class="popup_box">
				<view class="popup_title">
					<text @click="popupShow2 = false">取消</text>
					<view>弹窗标题</view>
					<text @click="popupShow2 = false">确定</text>
				</view>
				<view class="popup_content">
					弹窗内容
				</view>
			</view>
		</z-popup>
		<z-popup v-model="popupShow3" :hideOnBlur="false" @change="onChange">
			<view class="popup_title">
				<text @click="popupShow3 = false">取消</text>
				<view>弹窗标题</view>
				<text @click="popupShow3 = false">确定</text>
			</view>
			<view class="popup_content">
				弹窗内容
			</view>
		</z-popup>
		<z-popup v-model="popupShow4" type="top" @change="onChange">
			<view class="popup_box">
				<view class="popup_title">
					<text @click="popupShow4 = false">取消</text>
					<view>弹窗标题</view>
					<text @click="popupShow4 = false">确定</text>
				</view>
				<view class="popup_content">
					弹窗内容
				</view>
			</view>
		</z-popup>
		<z-popup v-model="popupShow5" type="top" :offset="55" :zIndex="1"  @change="onChange">
			<view class="popup_box">
				<view class="popup_title">
					<text @click="popupShow5 = false">取消</text>
					<view>我是故意被挡住的</view>
					<text @click="popupShow5 = false">确定</text>
				</view>
				<view class="popup_content">
					弹窗内容
				</view>
			</view>
		</z-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			popupShow: false,
			popupShow2: false,
			popupShow3: false,
			popupShow4: false,
			popupShow5: true,
		};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onChange(e){
			if(e){
				uni.showToast({
					title:"打开了弹窗",
					icon:"none"
				});
			}else {
				uni.showToast({
					title:"关闭了弹窗",
					icon:"none"
				});
			}
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
.popup_box {
	width: 100%;
}
.popup_title {
	display: flex;
	justify-content: space-between;
	height: 88upx;
	line-height: 88upx;
	border-bottom: 2upx solid #ebebeb;
	padding: 0 20upx;
	background-color: #FFF;
}
.popup_title view {
	font-size: 32upx;
}
.popup_title text {
	width: 80upx;
	flex-shrink: 0;
	text-align: center;
}
.popup_title text {
	font-size: 28upx;
	color: #999;
}
.popup_title text:last-child {
	color: $themeColor;
}
.popup_content {
	padding: 80rpx 30rpx;
	background-color: #FFFFFF;
	text-align: center;
}
</style>
