import Vue from 'vue'
import App from './App'
import store from './store'

import uView from "uview-ui";
// 全局引入头部组件
import musicHead from '@/components/music-head/music-head.vue'
Vue.use(uView);
// 注册全局头部组件
Vue.component('music-head',musicHead)

// 全局过滤器
Vue.filter('formatCount',function(value){
	if(value >= 10000 && value <= 100000000){
		value /= 1000;
		return value.toFixed(1) + '万';
	}else if(value > 100000000){
		value /= 100000000;
		return value.toFixed(1) + '亿'
	}else{
		return value;
	}
});
// 全局时间过滤器
Vue.filter('formatime',function(value){
	var data = new Date(value)
	return data.getFullYear() + '年' +( data.getMonth() + 1) + '月' + data.getDate() + '日'
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
