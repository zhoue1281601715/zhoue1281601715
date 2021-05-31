/**
 * 如果位目录层数大于两级需要修改路径
 */
const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';

const app = getApp();

Page({
	data: {
		getImageData: {},
		modal: {
			tips: '提示',
			message: '模态框说明',
			ok: 'modalOk',
			cancel: 'modalCancel',
			ishide: true
		},
	},

	
	
	onLoad() {
		this.getImage();
	},
	
	onShow (){
		
	},
	/*============================================
	 			     以下是基本操作 				
	==============================================*/ 

	...utils,  // mixin方法

	trigger (e){
		app.trigger(e, this);
	},

	modalCancel (){
		this.setData({
			'modal.ishide' : true
		})
	},

	modalOk (){
		this.setData({
			'modal.ishide' : true
		})
	},




	// /*用户点击右上角分享*/
  onShareAppMessage: function () {

	},


	// 请求图片
	getImage () {
		const that = this
		app.http({
			config: {
				url: 'api/v1/get_image',
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
			const getImageData = res.data.data
			console.log(getImageData, 'getImageInfo')
			that.setData({
				getImageData
			})
		}).catch(err => {
			if (err.data.code == 401) {
				wx.navigateTo({
					url: '/packageA/login/index',
				})
			}
		})
	},
})
