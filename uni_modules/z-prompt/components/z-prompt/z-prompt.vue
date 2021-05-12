<template>
	<view>
		<view class="popupClick" @click="onPopupShow()"><slot></slot></view>
		<view class="popupMask" v-if="popupShow" @click="onPopupHide"></view>
		<view class="popupContentBox" v-if="popupShow">
			<view class="close" @click="onPopupHide">×</view>
			<view class="title">{{ popupConfig.title }}</view>
			<view class="popupContent">
				<view class="introduce">{{ popupConfig.tips }}</view>
				<input
					class="input"
					:type="popupConfig.inputType"
					adjust-position="true"
					:password="popupConfig.password"
					v-model="popupInput"
					:placeholder="popupConfig.placeholder"
					:maxlength="popupConfig.maxlength"
					focus="true"
					placeholder-style="color:#999"
					:confirm-type="popupConfig.confirmType"
				/>
			</view>
			<view class="popupBut">
				<button @click="onConfirm">{{ popupConfig.confirmText }}</button>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		value: {
			type: String,
			default: function() {
				return '';
			}
		},
		options: {
			type: Object,
			default: function() {
				return {};
			}
		}
	},
	data() {
		return {
			popupConfig: {
				title: '操作',
				tips: "请输入",
				confirmText: '确认',
				placeholder: '',
				password: false,
				inputType: 'text',
				maxlength: 140,
				confirmType: "done"
			},
			popupInput: '',
			popupShow: false
		};
	},
	//第一次加载
	created() {
		if(this.value){
			this.popupInput = this.value;
		}
		if(this.options && typeof(this.options) == "object"){
			this.popupConfig = Object.assign(this.popupConfig, this.options);
		}
	},
	watch:{
		value(val){
			this.popupInput = val;
		},
		options(val){
			if(val && typeof(val) == "object"){
				this.popupConfig = Object.assign(this.popupConfig, val);
			}
		}
	},
	//方法
	methods: {
		//打开弹窗
		onPopupShow(value,options) {
			if(value){
				this.popupInput = value;
			}
			if(options && typeof(options) == "object"){
				this.popupConfig = Object.assign(this.popupConfig, options);
			}
			this.popupShow = true;
		},
		//关闭弹窗
		onPopupHide() {
			this.popupShow = false;
		},
		onConfirm() {
			if (this.popupInput == '') {
				uni.showToast({
					title: '请输入',
					icon: 'none'
				});
				return;
			}
			this.$emit('confirm', {
				close:() => {
					this.popupShow = false;
				},
				value: this.popupInput
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.popupMask {
	position: fixed;
	top: 0upx;
	left: 0upx;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 510;
	animation: popupMask 0.4s;
}
.popupContentBox {
	position: fixed;
	top: 30%;
	left: 10%;
	width: 80%;
	transform: translateY(-50%);
	background-color: #fff;
	z-index: 511;
	animation: popupContentBox 0.4s;
}
.popupContentBox .close {
	position: absolute;
	top: 10upx;
	right: 15upx;
	color: #999;
	font-size: 42upx;
	line-height: 40upx;
}
.popupContentBox .title {
	text-align: center;
	height: 80upx;
	line-height: 80upx;
	font-size: 34upx;
	color: #666;
}
.popupContentBox .popupContent {
	padding: 30upx 40upx;
}
.popupContentBox .popupContent .input {
	width: 100%;
	border-radius: 10upx;
	border: 1px solid #eee;
	height: 80upx;
	font-size: 30upx;
	padding: 0 20upx;
	box-sizing: border-box;
}
.popupContentBox .popupContent .introduce {
	font-size: 28upx;
	color: #999;
	padding-bottom: 10upx;
}
.popupContentBox .popupBut {
	padding: 20upx 20upx 20upx 20upx;
}
.popupContentBox .popupBut button {
	background-color:$themeColor;
	color: #fff;
}
@keyframes popupMask {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes popupContentBox {
	0% {
		opacity: 0;
		transform: translateY(-60%);
	}
	100% {
		opacity: 1;
		transform: translateY(-50%);
	}
}
</style>
