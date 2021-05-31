const { $Toast } = require('../iview/base/index');
const Tools = require('./Tools');
import { Config } from '../../config'

class NetWork {

	constructor(baseLine, loginPath = '') {

		this.baseLine = baseLine;
		this.loginPath = loginPath;
		
	}

	_http(options = {}, type = 'request') {
		let { config, toast = '', isAuth = true, complete = () => { }, tokenKey = '' } = options;

		switch (type) {
			case 'request':
			return this._request(config, toast, isAuth, complete, tokenKey);
			break;
			case 'upload':
			return this._upload(config, toast, isAuth, complete, tokenKey);
			break;
		}
	}


	_request(obj = {}, toast = '', isAuth = true, complete = () => { }, tokenKey) {

    //console.log(tokenKey)
    let _that = this;

    return new Promise((resolve, reject) => {

    	if (toast) {
    		$Toast({
    			content: '正在' + toast + '...',
    			type: 'loading',
    			duration: 0
    		});
    	}

    	let data = {
    		url: '',
    		data: {},
    		header: {
    			'content-type': 'application/x-www-form-urlencoded'
    		},
    		method: 'POST',
    		dataType: 'json',
    		responseType: 'text',
    	}

    	let newData = Object.assign(data, obj);

			/**
			 * 验证是否登录
			 */
			 if (!_that.checkAuth(isAuth)){
			 	return false;
			 }

			 if (isAuth) newData.data[Config.author.token_key] = Tools.getToken(tokenKey);

			 if (data.method.toUpperCase() == 'GET') newData.header['content-type'] = 'application/json';
			 newData.url = this.baseLine + newData.url;

			/**
			 * 成功执行函数
			 */
			 newData.success = res => {
			 	_that.success(res, toast, resolve, reject);
			 };

			/**
			 * 失败执行函数
			 */
			 newData.fail = res => {
			 	_that.fail(res, toast, resolve, reject);
			 };

			 newData.complete = function () {
			 	complete();
			 }


			 wx.request(newData);
			});
}

_upload(obj = {}, toast = '', isAuth = true, complete = () => { }, tokenKey) {

	return new Promise((resolve, reject) => {
		let bool = false;
		let message = '';
		let data = {
			url: '',
			formData: {},
			filePath: '',
			name: '',
			header: {
				'content-type': 'multipart/form-data'
			},
			method: 'POST',
		}

		let newData = Object.assign(data, obj);

			/**
			 * 验证是否登录
			 */
			 if (!_that.checkAuth(isAuth)){
			 	return false;
			 }

			 if (isAuth) newData.formData[Config.author.token_key] = Tools.getToken(tokenKey);

			 newData.url = this.baseLine + newData.url;

			 if (newData.filePath == '') {
			 	bool = true
			 	message = '请填写上传图片路径'

			 } else if (newData.name == '') {
			 	bool = true
			 	message = '请填写Key值'
			 }

			 if(bool) console.log(message);

			/**
			 * 成功执行函数
			 */
			 newData.success = res => {
			 	_that.success(res, toast, resolve, reject);
			 };

			/**
			 * 失败执行函数
			 */
			 newData.fail = res => {
			 	_that.fail(res, toast, resolve, reject);
			 };

			 newData.complete = function () {
			 	complete();
			 }

			 return wx.uploadFile(newData)
			})
}

success (res, toast, resolve, reject){
	let _that = this;
	let _datas = _that.getDatas(res);

	if (res.data[Config.server.result_id] == Config.server.success) {
		if (toast) {
			setTimeout(() => {
				$Toast({
					content: toast + '成功',
					type: 'success'
				});
			}, 500)
		}

		resolve(res);

	}else if(res.data[Config.server.result_id] == Config.server.obsolete){

		$Toast.hide();
		wx.hideLoading()
		wx.showModal({
			title: '提示',
			content: '请授权并登录',
			success(res) {
				if (res.confirm) {
					wx.redirectTo({
						url: _that.loginPath + '?relogin=relogin'
					})
				}
			}
		})

		//reject(res);

	}else{

		if (toast) {
			setTimeout(() => {
				$Toast({
					content: res.data[Config.server.message] || toast + '失败',
					type: 'error'
				});
			}, 500)
		}

		reject(res);
	}
}

fail (res, toast, resolve, reject){
	let _that = this;
	let _datas = _that.getDatas(res);

	if (toast) {
		setTimeout(() => {
			$Toast({
				content: res.data[Config.server.message] || toast + '失败',
				type: 'error'
			});
		}, 500)
	}

	reject(res);
}

getDatas (res){
	let result;
	Config.server.layer.forEach(cur => {
		result = res[cur];
	});

	return result;
}

checkAuth(isAuth) {
	let _that = this;
	let _token;
	let verification;

	if (isAuth) {

		verification = true;
		_token = Tools.getToken();

		Config.author.verification.forEach(cur => {

			if (wx.getStorageSync(cur) === undefined || wx.getStorageSync(cur) === null || wx.getStorageSync(cur) === false) {
				verification = false;
			}
		});

		if (!verification || (verification && !_token)){
			$Toast.hide();
			wx.hideLoading()
			wx.showModal({
				title: '提示',
				content: '请授权并登录',
				success(res) {
					if (res.confirm) {
						wx.redirectTo({
							url: _that.loginPath + '?relogin=relogin'
						})
					}
				}
			})

			return false;
		}
	}

	return true;
}
}


export default NetWork;