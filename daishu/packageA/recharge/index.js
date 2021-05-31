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
		arr: ['线上充值', '线下充值','充值记录'],
		currentTab: 0,
		modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
		},
	
		// --  分页配置数据  -------- 
		page: {
			url: '/',
				data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 
		activeIdx: -1,
		onlineMoney: '', // 线上充值金额
		offlineMoney: '', // 线下充值金额
		pay_img: '', // 凭证图片路径（后端处理过的）
		removeIconFlag: true, // 图片删除按钮显示标识
		toastParameter: {}, // 自定义toast参数
	
	},

	/**
	 * 线上充值
	 */
	handleOnlineRecharge (e) {
		const that = this
		const money = Number(e.detail.value.money)
		if (money) {
			const recharge_type = 'wxpay'
			const pay_img = ''
			const examine_status = 0
			app.http({
				config: {
					url: 'api/v1/user_recharge',
					data: {
						money,
						recharge_type,
						pay_img,
						examine_status
					},
					method: 'POST'
				},
				isAuth: true
			}).then(res => {
				console.log(res, 'onlineRechargeRes')
				const order_id = res.data.data
				app.http({
					config: {
						url: 'api/v1/wxpay_recharge',
						data: {
							order_id
						},
						method: 'POST'
					},
					isAuth: true
				}).then(res => {
					console.log(res, 'wxpayRechargeRes')
					wx.requestPayment({
						timeStamp: res.data.data.timeStamp,
						nonceStr: res.data.data.nonceStr,
						package: res.data.data.package,
						signType: 'MD5',
						paySign: res.data.data.paySign,
						success (res) {
							console.log('paymentSuccess', res)
							that.setData({
								onlineMoney: ''
							})
						},
						fail (res) {
							console.log('paymentFail', res)
						}
					})
				}).catch(err => {
					console.log(err, 'wxpayRechargeErr')
					wx.showModal({
						title: '提示',
						content: err.data.msg,
						showCancel: false
					})
				})
			}).catch(err => {
				console.log(err, 'onlineRechargeErr')
				wx.showModal({
					title: '提示',
					content: err.data.msg,
					showCancel: false
				})
			})
		} else {
			if (isNaN(money)) {
				wx.showToast({
					title: '请输入正确的充值金额',
					icon: 'none',
					duration: 1500
				})
			} else {
				wx.showToast({
					title: '请先输入充值金额',
					icon: 'none',
					duration: 1500
				})
			}
		}
	},

	/**
	 * 线下充值
	 */
	handleOfflineRecharge (e) {
		const that = this
		const money = Number(e.detail.value.money)
		const pay_img = that.data.pay_img
		if (money) {
			if (pay_img) {
				const recharge_type = 'offline'
				const examine_status = 1
				app.http({
					config: {
						url: 'api/v1/user_recharge',
						data: {
							money,
							recharge_type,
							pay_img,
							examine_status
						},
						method: 'POST'
					},
					isAuth: true
				}).then(res => {
					console.log(res, 'rechargeRes')
					const toastParameter = {
						icon: 'success',
						content: '提交成功，等待审核',
						duration: 1500
					}
					that.setData({
						toastParameter,
						offlineMoney: '',
						removeIconFlag: false,
						pay_img: ''
					})
				}).catch(err => {
					console.log(err, 'rechargeErr')
					wx.showModal({
						title: '提示',
						content: err.data.msg,
						showCancel: false
					})
				})
			} else {
				wx.showToast({
					title: '请先上传图片',
					icon: 'none',
					duration: 1500
				})
			}
		} else {
			if (isNaN(money)) {
				wx.showToast({
					title: '请输入正确的充值金额',
					icon: 'none',
					duration: 1500
				})
			} else {
				wx.showToast({
					title: '请先输入充值金额',
					icon: 'none',
					duration: 1500
				})
			}
		}
	},

	/**
   * 上传图片
   */
  handleChooseImage () {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
				const tempFilePath = res.tempFilePaths[0]
				wx.showLoading({
					title: '加载中',
				})
        wx.uploadFile({
					url: Config.Config.baseUrl + 'api/v1/upload-image',
					filePath: tempFilePath,
					name: 'image',
					formData: {},
					success (res){
						const data = JSON.parse(res.data)
						console.log('data', data)
						that.setData({
							pay_img: data.msg.preview_path,
							removeIconFlag: true
						}, () => {
							wx.hideLoading()
						})
					},
					fail (err) {
						console.log('uploadFileErr', err)
						wx.hideLoading()
					}
				})
      },
      fail (err) {
        console.log('chooseImageErr', err)
      }
    })
  },

  /**
   * 删除图片
   */
  handleDeleteImage () {
    const that = this
    that.setData({
			pay_img: '',
			removeIconFlag: false
    })
  },

	onLoad (query){
		app.setTitle('填个标题吧');
	},
	
	onShow (){
		
	},

	tabOn: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index
    })
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

	/**
	 * 触底分页 (需要分页的请反我牌)
	 */
	onReachBottom() {
		let { page, isEnd } = this.data;
	
		if (!isEnd) {
		  this.setData({
			'page.data.page': page.data.page + 1
		  });
		}
	},

	/**
	 * 分页返回数据 (需要分页的请反我牌)
	 */
	pageSuccess(e) {
		this.setData({
		  list: e.detail.list,
		  isEnd: e.detail.isEnd
		})
	},
	
	pageFail(e) {
		
	},

	pageStart(e) {
		
	},

	/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
