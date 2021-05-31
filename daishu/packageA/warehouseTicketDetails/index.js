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
		showPopup: false, // 显示/关闭弹窗
		popupPositionBottom: -1200, // 弹窗下定位值
		stock_id: '', // 仓票ID
		order_id: '', // 订单ID
		pay_money: '', // 订单需要支付的金额
		monthLastDate: '', // 本月最后一天
		warehoustTicket: '', // 仓票详情
		allWarehoustTicket: '', // 仓票总数
		progressRatioWidth: '', // 销量进度条实际销量长度
		toastParameter: {},
		warehousingPopupShow: false, // 出仓弹窗是否显示
		offlineMoney: '', // 优惠券数量
		pay_img: '', // 凭证图片路径（后端处理过的）
		pay_type:'',
	},
  /**
   * 关闭出仓弹窗
   */
	handleCloseWarehousingPopup() {
    this.setData({
      warehousingPopupShow: false
    })
  },
	/**
	 * 获取仓票详情
	 */
	getWarehoustTicketDetails () {
		const that = this
		const stock_id = that.data.stock_id
		wx.showLoading()
		app.http({
			config: {
				url: 'api/v1/detail_stock',
				data: {
					stock_id
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'warehoustTicketDetailsRes')
			res.data.data.get_money=parseInt(res.data.data.get_money)
			res.data.data.pay_money=parseInt(res.data.data.pay_money)
			const warehoustTicket = res.data.data // 仓票详情
			console.log('warehoustTicket',warehoustTicket);
			
			const use_year = warehoustTicket.use_year // 仓票可使用的年份
			const use_month = warehoustTicket.use_month - 1 // 仓票可使用的月份（这里减1是因为在js里面月份是从0开始的，后端传过来的月份是从1开始的）
			const timeStamp = new Date(use_year, use_month, 1) // 获取仓票可使用那个月的第1天的时间戳
			const nextMonth = use_month + 1 // 仓票过期的那个月份（即下个月）
			const nextMonthFirstDay = new Date(timeStamp.getFullYear(), nextMonth, 1) // 仓票过期的那个月的第一天
			const oneDayTimeStamp = 1000 * 60 * 60 * 24 // 一天的时间戳
			const monthLastDate = new Date(nextMonthFirstDay - oneDayTimeStamp).getDate() // 仓票可使用的那个月的最后一天
			const sales = warehoustTicket.sales > 0 ? warehoustTicket.sales : 0 // 销售数量
			const stock = warehoustTicket.num > 0 ? warehoustTicket.num : 0 // 库存数量
			const allWarehoustTicket = sales + stock // 仓票总数
			const progressRatioWidth = sales / allWarehoustTicket * 168 // 销量进度条实际销量长度（168是因为CSS设置了销量进度条总长度为168rpx）
			that.setData({
				warehoustTicket,
				monthLastDate,
				allWarehoustTicket,
				progressRatioWidth
			}, () => {
				wx.hideLoading()
			})
		}).catch(err => {
			console.log(err, 'warehoustTicketDetailsErr')
			wx.hideLoading()
		})
	},

	/**
	 * 显示弹窗
	 */
	handleShowPopup () {
		const that = this
		const showPopup = !that.data.showPopup
		that.setData({
			showPopup,
		}, () => {
			that.setData({
				popupPositionBottom: 0
			})
		})
	},

	/**
	 * 隐藏弹窗
	 */
	handleHidePopup () {
		const that = this
		const showPopup = !that.data.showPopup
		that.setData({
			popupPositionBottom: -1200
		}, function () {
			setTimeout(() => {
				that.setData({
					showPopup
				})
			}, 300)
		})
	},
	// 线下下单
	 linePayment(e){
		const that=this
		// const pay_type = e.currentTarget.dataset.pay_type	
		if(e.currentTarget.dataset.pay_type=='balance'){
    	that.setData({
				warehousingPopupShow:true,
				pay_type: e.currentTarget.dataset.pay_type
			 })
		}else{
			that.setData({
				pay_type: e.currentTarget.dataset.pay_type
			 })
			 that.handlePayment()
		}

	 },
	/**
	 * 下单
	 */
	handlePayment () {
		const that = this
		const token = wx.getStorageSync('token')
		const stock_id = that.data.stock_id
		const pay_type= that.data.pay_type
		console.log(' that.data.pay_type', that.data.pay_type);
		
		const num = that.data.num
		if(pay_type=='balance'){
			this.handleBalancePay()
			setTimeout(() => {
				wx.navigateTo({
					url: '/packageA/myWarehouseTicket/index',
				})
			}, 1500)
		}else {
			app.http({
			config: {
				url: 'api/v1/stock_order',//下单接口
				data: {
					stock_id,
					token,
					pay_type,
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'paymentRes')
			const { order_id, pay_money } = res.data.data
			that.setData({
				order_id,
				pay_money
			}, () => {
				switch (pay_type) {
					case 'wxpay': // 微信支付
						that.handleWechatPay()
						break;
					// case 'balance': // 余额支付
					// that.handleBalancePay()
					// 	// wx.showModal({
					// 	// 	title: '提示',
					// 	// 	content: '是否使用余额支付？',
					// 	// 	success(res) {
					// 	// 		if (res.confirm) {
					// 	// 			that.handleBalancePay()
					// 	// 		}
					// 	// 	}
					// 	// })
					// 	break;
					case 'offline': // 线下支付
						that.setData({
							popupPositionBottom: -1200
						}, function () {
							setTimeout(() => {
								that.setData({
									showPopup: false
								}, () => {
									// that.getWarehoustTicketDetails()
									wx.navigateTo({
										url: `/packageA/offlinePay/offlinePay?order_id=${order_id}`,
									})
								})
							}, 300)
						})
						break;
				}
			})
		}).catch(err => {
			console.log(err, 'paymentErr')
			wx.showModal({
				title: '提示',
				content: err.data.msg,
				showCancel: false
			})
		})
		}
		
	},

	/**
	 * 微信支付
	 */
  handleWechatPay () {
    const that = this
		const token = wx.getStorageSync('token')
		const order_id = that.data.order_id
		app.http({
			config: {
				url: 'api/v1/wxpay_stock',
				data: {
					token,
					order_id
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'wechatPayRes')
			that.setData({
				popupPositionBottom: -1200,
				showPopup: false,
			}, () => {
				wx.requestPayment({
					timeStamp: res.data.data.timeStamp,
					nonceStr: res.data.data.nonceStr,
					package: res.data.data.package,
					signType: 'MD5',
					paySign: res.data.data.paySign,
					success (res) {
						console.log('paymentSuccess', res)
						wx.navigateTo({
							url: '/packageA/myWarehouseTicket/index',
						})
					},
					fail (res) {
						console.log('paymentFail', res)
					}
				})
			})
		}).catch(err => {
			console.log(err, 'wechatPayErr')
			wx.showModal({
				title: '提示',
				content: err.data.msg,
				showCancel: false
			})
		})
	},

	handleBalancePay () {
    const that = this
    const { stock_id ,pay_imgs,num} = that.data
    app.http({
			config: {
				url: 'api/v1/offline_stocks',
				data: {
					stock_id,
					pay_imgs,
					num
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'submitRes')
			that.setData({
				popupPositionBottom: -1200,
				showPopup: false
			}, () => {
				const toastParameter = {
					icon: 'success',
					content: "请稍候，正在审核！",
					duration: 2000,
				}
				that.setData({
					toastParameter,
			warehousingPopupShow:false

				}, function () {
					setTimeout(() => {
						wx.navigateTo({
							url: '/packageA/myWarehouseTicket/index',
						})
					}, 1500)
				})
			})
		}).catch(err => {
			console.log(err, 'submitErr')
			wx.showModal({
				title: '提示',
				content: err.data.msg,
				showCancel: false
			})
		})
  },
	// 线下充值
	handleOfflineRecharge (e) {
		const that = this
		const money = Number(e.detail.value.money)
		const pay_img = that.data.pay_img
		that.setData({
			num:money
		})
		if (money) {
			if (pay_img) {
				this.handlePayment()
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
					title: '请输优惠券数量',
					icon: 'none',
					duration: 1500
				})
			} else {
				wx.showToast({
					title: '请输优惠券数量',
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
							removeIconFlag: true,
							pay_imgs:data.msg.preview_path,
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
		app.setTitle('填个标题吧')
		const that = this
		const stock_id = query.stock_id
		console.log('stock_id', stock_id)
		that.setData({
			stock_id
		})
	},

	onShow (){
		this.getWarehoustTicketDetails()
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
