<template>
	<view>
		<z-nav-bar title="稳定版瀑布流"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" @up="upCallback">
			<view class="table_box">
				<view class="table_title">使用文档</view>
				<view class="table_content">
					<text @click="onJumpWebview('http://www.mescroll.com/')">文档地址：https://ext.dcloud.net.cn/plugin?id=805</text>
				</view>
			</view>	
			<waterfall-goods :list="dataList"></waterfall-goods>
		</mescroll-body>
	</view>
</template>

<script>
import allList from './data';
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行downCallback; 默认true
			},
			dataList: []
		};
	},
	//方法
	methods: {
		/*下拉刷新的回调 */
		downCallback() {
			//联网加载数据
			this.loadData(1);
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			//联网加载数据
			this.loadData(page.num);
		},
		loadData(pageNo) {
			// 模拟接口
			let pageSize = 10;
			let dataList = allList.slice((pageNo - 1) * pageSize, pageNo * pageSize);
			this.mescroll.endByPage(dataList.length, Math.ceil(allList.length / pageSize)); //必传参数(当前页的数据个数, 总页数)
			if (pageNo == 1) {
				this.dataList = dataList;
			} else {
				this.dataList = this.dataList.concat(dataList);
			}
		},
		onJumpWebview(url){
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			this.$store.commit("setWebViewUrl", url);
			uni.navigateTo({
				url: '/pages/template/webView'
			});
			// #endif
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
