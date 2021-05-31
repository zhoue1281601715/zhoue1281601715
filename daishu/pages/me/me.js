

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
		activeIdx: 2,
		is_driver: 0,
		settlementBalance: '', // 结算余额
		modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
		},
	  yuyIndex1:1,
		// --  分页配置数据  -------- 
		page: {
			url: '/',
				data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 
		
	},

	/**
	 * 退出登录
	 */
	handleLogout() {
		const that = this
		wx.showModal({
			title: '提示',
			content: '是否退出登录？',
			success (res) {
				if (res.confirm) {
					wx.removeStorage({
						key: 'token',
						success (res) {
							console.log('logoutRes', res)
							wx.removeStorageSync('currentUserInfo')
							wx.removeStorageSync('deliveryList')
							wx.removeStorageSync('deliveryCheckedList')
							wx.removeStorageSync('warehousingList')
							wx.removeStorageSync('warehousingCheckedList')
							wx.removeStorageSync('tempList')
							wx.removeStorageSync('goodsList')
							wx.removeStorageSync('stockQueryPage')
							wx.removeStorageSync('stockQueryKeyWord')
							wx.removeStorageSync('nickName')
							wx.removeStorageSync('avatarUrl')
							wx.removeStorageSync('phone')
							wx.removeStorageSync('user_info')
							wx.removeStorageSync('warehouse_id')
							wx.removeStorageSync('warehouse_name')
							wx.removeStorageSync('company_id')
							wx.removeStorageSync('customer_id')
							wx.removeStorageSync('mobile')
							wx.removeStorageSync('table_num')
							wx.removeStorageSync('ceshiId')
							wx.removeStorageSync('sectionShow')
							wx.removeStorageSync('agent_id')
							wx.removeStorageSync('warehousingPage')
							wx.removeStorageSync('warehousingGoodsName')
							wx.removeStorageSync('queryWarehouse_id')
							wx.removeStorageSync('queryPara1')
							wx.setStorageSync('logout', 'success')
							that.setData({
								currentUserInfo: '',
								settlementBalance: ''
							}, () => {
								wx.showToast({
									title: '退出登录成功',
									icon: 'success',
									duration: 1500
								})
							})
						},
						fail (err) {
							console.log('logoutErr', err)
							wx.showModal({
								title: '提示',
								content: '退出登录失败',
								showCancel: false
							})
						}
					})
				}
			}
		})
	},

	/**
	 * 获取用户基本信息
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
			console.log('currentUserInfozhou',currentUserInfo);
			
		}).catch(err => {
			console.log(err, 'getUserInfomationErr')
		})
	},

	/**
	 * 获取用户结算余额
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
			console.log(res, 'getSettlementBalanceRes')
			const settlementBalance=res.data.data.toFixed(2)
			that.setData({
				settlementBalance
			})
		}).catch(err => {
			console.log(err, 'getSettlementBalanceErr')
		})
	},

	/**
	 * 跳转到出仓
	 */
	handleNavigatorToDelivery() {
		wx.setStorageSync('sectionShow', '1')
		wx.switchTab({
			url: '/pages/yuncang/index?yuyIndex1=1',
		})
	},

	onLoad(query) {
		// 隐藏原生的tabbar
		wx.hideTabBar()
		app.setTitle('填个标题吧');
	},
	
	onShow() {
		this.getUserInfomation()
		const storageInfo = wx.getStorageSync("currentUserInfo")
    if (storageInfo.is_driver){
      this.setData({
        is_driver: storageInfo.is_driver
      })
    }
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

