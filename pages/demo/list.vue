<template>
	<view class="">
		<z-nav-bar title="下拉刷新/上拉加载列表"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" @up="upCallback">
			<view class="table_box">
				<view class="table_title">使用文档</view>
				<view class="table_content">
					<text @click="onJumpWebview('http://www.mescroll.com/')">文档地址：http://www.mescroll.com/</text>
				</view>
			</view>	
			<view class="news_list" v-for="item in dataList" :key="item.id" @click="onJumpWebview(item.reprintUrl)">
				<view class="title"><text>{{item.original ? "原创" : "转载"}}</text>{{item.title}}</view>
				<view class="content">{{item.content}}</view>
				<view class="content_state">
					<text>浏览量：{{item.pageviews}}</text>
					<text>点赞数：{{item.likes}}</text>
					<text>评论数：{{item.comments}}</text>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>
<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				dataList: []
			}
		},
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
			loadData(pageNo){
				this.$http
					.post('api/articles/v1/articles_list', {
						pageNo: pageNo,
						pageSize: 10
					},{
						load:false
					}).then(res => {
						uni.stopPullDownRefresh();
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
						
						//方法一(推荐): 后台接口有返回列表的总页数 totalPage
						this.mescroll.endByPage(res.data.length, res.pages); //必传参数(当前页的数据个数, 总页数)
						
						//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
						//this.mescroll.endBySize(res.data.length, res.count); //必传参数(当前页的数据个数, 总数据量)
						
						//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
						//this.mescroll.endSuccess(res.data.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)
						
						//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据.
						// this.mescroll.endSuccess(res.data.length);
						
						if (pageNo == 1) {
							this.dataList = res.data;
						} else {
							this.dataList = this.dataList.concat(res.data);
						}
					}).catch(() => {
						//联网失败, 结束加载
						this.mescroll.endErr();
					});
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
		},
	}
</script>

<style scoped lang="scss">
	@import '@/style/mixin.scss';
	/*说明*/
	.notice{
		font-size: 30upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
	}
	/*展示上拉加载的数据列表*/
	.news_list {
		padding: 30rpx;
		background-color: #FFF;
		margin-bottom: 20rpx;
		.title {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			@include bov(2);
		}
		.content {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: #999;
			@include bov(3);
		}
		.content_state {
			margin-top: 10rpx;
			display: flex;
			justify-content: space-between;
			text {
				font-size: 24rpx;
				color: #666;
			}
		}
	}
</style>
