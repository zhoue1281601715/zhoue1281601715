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
		arr: [{name:'一级下线',id:1}, {name:'二级下线',id:2},],
		currentTab: 0,
		activeIdx: -1,
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
		firstOffline: [], // 一级下线
		firstThisPage: 1, // 一级下线当前页
		firstLastPage: 1, // 一级下线最后一页
		firstOfflineCountToday: 0, // 一级下线今日佣金
		firstOfflineCountSum: 0, // 一级下线总佣金
		secondOffline: [], // 二级下线
		secondThisPage: 1, // 二级下线当前页
		secondLastPage: 1, // 二级下线最后一页
		secondOfflineCountToday: 0, // 二级下线今日佣金
		secondOfflineCountSum: 0, // 二级下线总佣金
	},

	/**
	 * 获取一级
	 */
	getFirstOffline () {
		const that = this
		const token = wx.getStorageSync('token')
		let firstThisPage = that.data.firstThisPage
		app.http({
			config: {
				url: 'api/v1/agent_center',
				data: {
					token,
					type: 1,
					page: firstThisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'firstOfflineRes')
			const firstOfflineCountToday = Number(res.data.data.countToday)
			const firstOfflineCountSum = Number(res.data.data.countSum)
			let firstLastPage = res.data.data.userList.last_page
			let firstOffline = that.data.firstOffline.length > 0 ? that.data.firstOffline.concat(res.data.data.userList.data) : res.data.data.userList.data
			that.setData({
				firstLastPage,
				firstOffline,
				firstOfflineCountToday,
				firstOfflineCountSum
			}, () => {
				if (firstThisPage < firstLastPage) {
					firstThisPage += 1
					that.setData({
						firstThisPage
					}, () => {
						that.getFirstOffline()
					})
				}
			})
		}).catch(err => {
			console.log(err, 'firstOfflineErr')
		})
	},

	/**
	 * 获取二级
	 */
	getSecondOffline () {
		const that = this
		const token = wx.getStorageSync('token')
		let secondThisPage = that.data.secondThisPage
		app.http({
			config: {
				url: 'api/v1/agent_center',
				data: {
					token,
					type: 2,
					page: secondThisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'secondOfflineRes')
			const secondOfflineCountToday = Number(res.data.data.countToday)
			const secondOfflineCountSum = Number(res.data.data.countSum)
			let secondLastPage = res.data.data.userList.last_page
			let secondOffline = that.data.secondOffline.length > 0 ? that.data.secondOffline.concat(res.data.data.userList.data) : res.data.data.userList.data
			that.setData({
				secondLastPage,
				secondOffline,
				secondOfflineCountToday,
				secondOfflineCountSum
			}, () => {
				if (secondThisPage < secondLastPage) {
					secondThisPage += 1
					that.setData({
						secondThisPage
					}, () => {
						that.getSecondOffline()
					})
				}
			})
		}).catch(err => {
			console.log(err, 'secondOfflineErr')
		})
	},

	onLoad (query) {
		app.setTitle('填个标题吧');
		const that = this
		that.getFirstOffline()
		that.getSecondOffline()
	},

	onShow () {
		
	},

	tabOn: function (e) {
		console.log(e)
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
