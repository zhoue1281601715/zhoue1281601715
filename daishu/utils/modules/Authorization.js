class Authorization {
	constuctor (){

	}

	
	/* 设置 */
	_getSetting (name = ''){

		return new Promise((resolve, reject) => {
			wx.getSetting({
			  	success(res) {
			  		if(name){
			    		name = 'scope.' + name
			    		if(res.authSetting.hasOwnProperty(name) && res.authSetting[name]){
			    			resolve(res)
			    		}else{
			    			reject(res)
			    		}
			    	}else{
			    		resolve(res.authSetting)
			    	}
				},
				fail (){
					reject()
				}
			})
		})
		
	}

	/* 用户信息 */
	_userInfo (options = {}){
		return new Promise((resolve, reject) => {
			var _data = {
				withCredentials : false,
				lang : 'en',
			}

			_data = Object.assign(options)

			_data.success = function (){
				resolve()
			}

			_data.fail = function (){
				reject()
			}

			wx.getUserInfo(_data)
		})
	}

}

export default Authorization;