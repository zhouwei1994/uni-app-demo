export const state = {
  //用户数据
  userInfo: {},
};
export const mutations = {
  //储存用户信息
  setUserInfo(state, data) {
  	if (data) {
  		state.userInfo =  Object.assign({}, state.userInfo,data);
  		// #ifdef H5
  		window.sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo));
  		// #endif
  		// #ifndef H5
  		uni.setStorageSync('userInfo', state.userInfo);
  		// #endif
  	}
  },
  // 退出APP
  emptyUserInfo(state) {
  	state.userInfo = {};
  	// #ifdef H5
  	window.sessionStorage.removeItem("userInfo");
  	// #endif
  	// #ifndef H5
  	uni.removeStorageSync("userInfo");
  	// #endif
  },
};
export const actions = {
  
};
