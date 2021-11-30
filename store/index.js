import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    state:{
        songList:[]// [{id:001,name:溯,singer:某某},{id:002,name:溯,singer:某某}] ---id唯一
    },
	mutations: {
		/**
		*  在旧数组头部添加一组歌曲
		*  @payload:添加歌曲，类型array
		*/
	    unshiftSong(state,payload) {
			// console.log(payload)
			if(payload.length==1){
				state.nowPlayId = payload[0].id
			}
			/**
			* @Function:去重函数，如果旧数组已有，则删除新添加歌曲数组重复的
			* @arr:作为比较的旧数组，类型array
			* @newArr:传入添加歌曲数组，类型array
			* @return:去重并合并后添加歌曲列表数组,类型array
			*/
			let deWeight = (arr,newArr) => {
				let arrs = [];//用于存放合并后数组
				let map = new Map();
				for (let i = 0; i < arr.length; i++) {
					map.set(arr[i].id,arr[i])
				}
			    for (let i = 0; i < newArr.length; i++) {
					if(!map.has(newArr[i].id)){
						arrs.push(newArr[i])
					}
			    }
				arrs = arrs.concat(arr)
				return arrs
			}
			state.songList =  deWeight(state.songList,payload)
			// console.log(state.songList,state.nowPlayId)
	    },
		// 删除歌曲
		deleteSong(state,payload){
			// if(payload[0].id == state.nowPlayId){
			// 	console.log("当前歌曲正在播放")
			// }
			console.log(payload)
			state.songList.splice(payload,1)
		},
		// 
	},
	getters:{
		
	},
	actions:{
		
	},
})

export default store
