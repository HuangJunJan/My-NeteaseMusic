// 修改为服务器IP地址
const baseURL = "http://192.168.0.105:3000"
export const request = ({
	url,
	method,
	data,
	hideLoading
}) => {
	if (method) {
		method = method.toLocaleUpperCase()
	}
	// request配置选项
	let options = {
		url: baseURL + url,
		method: method || 'GET',
		data: data || {},
		header: method == 'GET' ? {
			'X-Requested-With': 'XMLHttpRequest',
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded;charset-UTF-8'
		},
		dataType: 'json',
	}
	// console.log(options)
	//	发起请求 加载动画
	if (!hideLoading) {
		uni.showLoading({
			title: "加载中..."
		})
	}
	//	发起网络请求
	return new Promise((resolve, reject) => {
		uni.request(options)
			.then(response => {
				// console.log(response)
				const res = response[1]
				if(response.length==1){
					reject(response[0].errMsg)
					uni.showToast({
						title: '请求出错啦',
						icon: 'none',
						mask: true,
						position: 'center'
					})
				}
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res)
					uni.hideLoading()
				} else {
					reject(res.errMsg)
					uni.showToast({
						title: '请求出错啦',
						icon: 'none',
						mask: true,
						position: 'center'
					})
				}
				// console.log(response)
			})
			.catch(error => {
				reject(error)
			})
	}).catch(error => {
		// console.log('error ' + error)
	})
}
