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
			ishide : true,
			nickName:''
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
		moneyBag: '',
		// 新添加 结算余额
		settlementBalance:'',
		payUrl:'',
	},

	/**
	 * 获取钱包数据
	 */
	getMoneyBag () {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/money_bag',
				data: {
					token
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'getMoneyBagRes')
			const moneyBag = res.data.data
			that.setData({
				moneyBag
			})
		}).catch(err => {
			console.log(err, 'getMoneyBagErr')
			if (err.data.code == 401) {
				wx.navigateTo({
					url: '/packageC/login/index',
				})
			}
		})
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
			/* wx.requestPayment({
				timeStamp: '',
				nonceStr: '',
				package: '',
				signType: 'MD5',
				paySign: '',
				success (res) { },
				fail (res) { }
			}) */
		}).catch(err => {
			console.log(err, 'wechatPayErr')
			wx.showModal({
				title: '提示',
				content: err.data.msg,
				showCancel: false
			})
		})
	},

	onLoad (query){
		app.setTitle('填个标题吧');
		const nickName=wx.getStorageSync('nickName')
		this.setData({
			nickName
		})
	},
	
	onShow (){
			// 新添加结算余额
		this.getUserInfomation()
		this.getMoneyBag()
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

	},
		/**
	 *新添加 获取用户结算余额
	 */
	getSettlementBalance () {
		
		const that = this
		console.log('that.data.currentUserInfo.phone:123',that.data.currentUserInfo.phone);

		app.https({
			config: {
				url: 'xcx/user/get_amount',
				data: {
					mobile: that.data.currentUserInfo.phone
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res.data.data, 'getSettlementBalanceRes')
			const settlementBalance= res.data.data.toFixed(2)
			that.setData({
				settlementBalance
			})
		}).catch(err => {
			console.log(err, 'getSettlementBalanceErr')
		})
	},
	/*
	 
	*/ 

	/**
	 * 新添加 获取用户基本信息
	 */
	getUserInfomation () {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/user_info',
				data: {
					token
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'getUserInfomationRes')
			const currentUserInfo = res.data.data
			that.setData({
				currentUserInfo
			}, () => {
				that.getSettlementBalance()
			})

			
		}).catch(err => {
			console.log(err, 'getUserInfomationErr')
		})
	},
  payRecharge(){
		const that=this
		const	mobile = wx.getStorageSync('mobile')
		// const	mobile = '13602715343'

		app.https({
			config:{
				url:'xcx/user/check_wx',
				data:{
					mobile
				}
			}
		}).then(res=>{
		if(res.data.code==200){
			wx.showModal({
				title: '提示',
				content:'是否给'+ res.data.data.name+' 充值？',
				success (res) {
					if (res.confirm) {
						wx.navigateTo({
							url:'/packageA/recharge/index'
						})
		
					} else {
						wx.showToast({
							title: '取消',
							icon: 'none',
							duration: 1000
						})
					}
				},
			})
		}else {
			wx.showToast({
				title: '有问题，请联系客服',
				icon: 'none',
				duration: 2000
			})
		}
		})
	
	},
})
