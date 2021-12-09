<template>
	<view>
		<z-nav-bar title="日期时间选择器"></z-nav-bar>
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
				<text>optionalDate</text>
				<text>Number</text>
				<text>控件可选天数 默认：2</text>
			</view>
			<view class="table_content">
				<text>bufferMinutes</text>
				<text>Number</text>
				<text>最近时间是多少分钟后 默认：5</text>
			</view>
			<view class="table_content">
				<text>dayStartTime</text>
				<text>String</text>
				<text>每天开始时间 默认：00:00</text>
			</view>
			<view class="table_content">
				<text>dayEndTime</text>
				<text>String</text>
				<text>每天结束时间 默认：24:00</text>
			</view>
			<view class="table_content">
				<text>shipNow</text>
				<text>Boolean</text>
				<text>是否显示立即配送 默认：false</text>
			</view>
			<view class="table_content">
				<text>startTime</text>
				<text>String</text>
				<text>控件的开始选择时间 默认：空</text>
			</view>
			<view class="table_content">
				<text>@change</text>
				<text>function</text>
				<text>时间选择事件</text>
			</view>
		</view>
		<view class="input_form_box">
			<date-popup @change="onDateChange" :optionalDate="50" :bufferMinutes="20" dayStartTime="08:00">
				<view class="input_box">
					<view class="name required">时间选择</view>
					<view class="select_info">
						<view class="value" v-if="dateSeelctData.dateValue">{{ dateSeelctData.dateName }} {{ dateSeelctData.timeValue }}</view>
						<view class="select" v-else>请选择</view>
					</view>
				</view>
			</date-popup>
			<z-date-popup @change="onDateChange2" shipNow :optionalDate="3" :bufferMinutes="10">
				<view class="input_box">
					<view class="name required">时间选择(立即配送)</view>
					<view class="select_info">
						<view class="value" v-if="dateSeelctData2.dateValue">{{ dateSeelctData2.dateName }} {{ dateSeelctData2.timeValue }}</view>
						<view class="select" v-else>请选择</view>
					</view>
				</view>
			</z-date-popup>
		</view>
	</view>
</template>

<script>
function Console (Base) {
  return {
	mounted () {
	  console.log('haha')
	},
	props: Base.props,
	render (h) {
	  const slots = Object.keys(this.$slots)
		.reduce((arr, key) => arr.concat(this.$slots[key]), [])
		// 手动更正 context
		.map(vnode => {
		  vnode.context = this._self //绑定到高阶组件上
		  return vnode
		})
 
	  return h(Base, {
		on: this.$listeners,
		props: this.$props,
		attrs: this.$attrs
	  }, slots)
	}
  }
}
import datePopup from "@/components/date-popup/date-popup.vue"
export default {
	components: {
		'z-date-popup':Console(datePopup)
	},
	data() {
		return {
			dateSeelctData: {},
			dateSeelctData2: {},
		};
	},
	onLoad(e) {
		
	},
	onShow() {
		
	},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onDateChange(e){
			this.dateSeelctData = e;
			console.log(e);
		},
		onDateChange2(e){
			this.dateSeelctData2 = e;
			console.log(e);
		},
	},
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
</style>
