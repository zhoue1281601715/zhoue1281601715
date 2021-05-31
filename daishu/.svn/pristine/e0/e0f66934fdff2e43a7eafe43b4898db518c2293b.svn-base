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
		arr: ['在途中', '已签收'],
		orderList: [],
		currentTab: 0,
		activeIdx: -1,
		CustomBar: 0, // 自定义导航栏高度
		onTheWayThisPage: 1, // 在途中当前页
		onTheWayLastPage: 1, // 在途中最后一页
		signThisPage: 1, // 已签收当前页
		signLastPage: 1, // 已签收最后一页
		limit: 30,
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
	},

	onLoad (query) {
		app.setTitle('填个标题吧');
		const sign_state = 0
		this.orderList(sign_state)
		const that = this
		const CustomBar = app.store.custom.CustomBar
		that.setData({
			CustomBar
		})
	},

	onShow () {
		
	},

	tabOn: function (e) {
		const that = this
		const { currentTab } = that.data
		const tabIndex = Number(e.currentTarget.dataset.index)
		if (currentTab === tabIndex) {
			return false
		} else {
			that.setData({
				currentTab: tabIndex,
				orderList: [],
				onTheWayThisPage: 1,
				signThisPage: 1
			}, () => {
				that.orderList(tabIndex)
			})
		}
	},
	
	orderList(sign_state) {
		const that = this
		const currentUserInfo=wx.getStorageSync('currentUserInfo')
		const { onTheWayThisPage, signThisPage, limit } = that.data
		let page = 1
		switch (sign_state) {
			case 0:
				page = onTheWayThisPage
				break;
			case 1:
				page = signThisPage
				break;
		}
		app.https({
			config: {
				url: 'xcx/order/list',
				data: {
					page,
					limit,
					table_num: currentUserInfo.table_num,
					shipper_name: currentUserInfo.customer_name,
					sign_state
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log('orderListRes', res)
			const orderList = that.data.orderList.length > 0 ? that.data.orderList.concat(res.data.data) : res.data.data
			switch (sign_state) {
				case 0:
					const onTheWayLastPage = Math.ceil(res.data.count / limit)
					that.setData({
						orderList,
						onTheWayLastPage
					})
					break;
				case 1:
					const signLastPage = Math.ceil(res.data.count / limit)
					that.setData({
						orderList,
						signLastPage
					})
					break;
			}
		}).catch((err2) => {
			console.log(err2)
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
		const that = this
		let { currentTab, onTheWayThisPage, onTheWayLastPage, signThisPage, signLastPage } = that.data
		switch (currentTab) {
			case 0:
				if (onTheWayThisPage < onTheWayLastPage) {
					onTheWayThisPage += 1
					that.setData({
						onTheWayThisPage
					}, () => {
						that.orderList(currentTab)
					})
				}
				break;
			case 1:
				if (signThisPage < signLastPage) {
					signThisPage += 1
					that.setData({
						signThisPage
					}, () => {
						that.orderList(currentTab)
					})
				}
				break;
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
		
	}

})
