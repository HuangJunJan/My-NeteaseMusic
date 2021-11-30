/*
请求样式：
    自定义名字: function(data) {
        return request({
            url: "/banner", //请求头
            method: "GET", //请求方式 
            data: data,    //请求数据
            token: token, // 可传  
            hideLoading: false, //加载样式
        })
    },
*/
import {request} from '../utils/request.js'

// 榜单列表
const getTopList = () => {
	return request({
		url: "/toplist/detail",
		method: "GET", //请求方式
		hideLoading: true
	})
};
// 获取榜单歌曲列表
const getListById = (listId)=>{
	return request({
		url:"/playlist/detail?id="+listId,
		method:"GET",
	})
}

// 根据id获取歌曲信息
const getSongById = (songId)=>{
	return request({
		url:"/song/detail?ids="+songId,
		method:"GET",
		hideLoading: true
	})
}
// 获取歌曲播放地址
const getSongUrl = (songId)=>{
	return request({
		url:"/song/url?id="+songId,
		method:"GET",
		hideLoading: true
	})
}
// 获取歌曲歌词
const getLyricById = (songId)=>{
	return request({
		url:"/lyric?id="+songId,
		method:"GET",
		hideLoading: true
	})
}
// 获取相似歌曲
const getSimiSong = (id)=>{
	return request({
		url:"/simi/song?id="+id,
		method:"GET",
		hideLoading: true
	})
}
const getCommentById = (id)=>{
	return request({
		url:"/comment/music?id="+id,
		method:"GET",
	})
}

// 热搜列表
const getHotList = ()=>{
	return request({
		url:'/search/hot/detail',
		method:'get'
	})
}
// 搜索结果、加载更多
const searchByKw = (kw,offset)=>{
	// console.log(kw,offset)
	return request({
		url:'/cloudsearch?keywords='+kw+'&offset='+offset,
		method:'post',
		hideLoading:true
	})
}
// 搜索建议
const searchSuggestByKw = (kw)=>{
	return request({
		url:'/search/suggest?keywords='+kw+'&type=mobile',
		method:'post',
		hideLoading: true
	})
}

export{
	getTopList,
	getListById,
	getSongById,
	getSongUrl,
	getLyricById,
	getSimiSong,
	getCommentById,
	getHotList,
	searchByKw,
	searchSuggestByKw
}
