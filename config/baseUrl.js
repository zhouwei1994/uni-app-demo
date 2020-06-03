// 当前环境
const court = "开发";
const courtConfig = {
	/****************开发环境****************/
	"开发": {
		//微信小程序appid=
		//微信公众号APPID
		publicAppId: "",
		//请求接口
		baseUrl: "http://192.168.1.10:8088/project/",
		// baseUrl: "http://47.107.117.196/home_decoration/",
		// baseUrl: "http://dev.kemean.net/home_decoration/",
		//webSocket地址
		socketUrl: "ws://localhost:8001/",
		//平台名称
		platformName: "都市云",
		//项目logo
		logoUrl: "https://qn.kemean.cn/upload/201906/19/3f3b4751f3ed4a97be804450c3ec4c79",
		//页面分享配置
		share: {
			title: '都市云',
			// #ifdef MP-WEIXIN
			path: '/pages/home/home', //小程序分享路径
			// #endif
			// #ifdef H5 || APP-PLUS
			//公众号||APP分享
			desc: "都市云同城,最长24公里配送", // 分享描述
			link: "https://www.kemean.com/sameCity/18031201/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: "http://qn.kemean.cn/upload/201901/28/23bedfc34597482292ecd6dc107f6342", // 分享图标
			// #endif
		}
	},
	"交友": {
		//微信小程序appid=
		//微信公众号APPID
		publicAppId: "",
		//请求接口
		baseUrl: "",
		//webSocket地址
		socketUrl: "ws://dev.kemean.net",
		//平台名称
		platformName: "青缘福田",
		//项目logo
		logoUrl: "https://qn.kemean.cn/upload/201906/19/3f3b4751f3ed4a97be804450c3ec4c79",
		//页面分享配置
		share: {
			title: '青缘福田',
			// #ifdef MP-WEIXIN
			path: '/pages/home/home', //小程序分享路径
			// #endif
			// #ifdef H5 || APP-PLUS
			//公众号||APP分享
			desc: "都市云同城,最长24公里配送", // 分享描述
			link: "https://www.kemean.com/sameCity/18031201/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: "http://qn.kemean.cn/upload/201901/28/23bedfc34597482292ecd6dc107f6342", // 分享图标
			// #endif
		}
	},
};
//手机号验证正则表达式
const phoneRegular = /^1\d{10}$/;
//邮箱验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/;
export default Object.assign({
	phoneRegular,
	mailRegular,
	passwordRegular
}, courtConfig[court]);
