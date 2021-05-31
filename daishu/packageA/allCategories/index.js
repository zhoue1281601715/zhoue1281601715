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
		all_cate:"",
		is_new:'',
		is_hot:'',
		cate_id:'',
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
		selectNavList: false,
		navActivityIndex: 0,
		navList: [],
		goodsList: [],
		activeIdx: -1, // 自定义tabbar当前下标
	},

	/**
	 * 用户点击导航栏
	 */
	handleChangeNav (e) {
		const that= this
		const navActivityIndex = e.currentTarget.dataset.index
		const cate_id = e.currentTarget.dataset.cate_id
		const lastNavIndex = that.data.navActivityIndex
		if (lastNavIndex === navActivityIndex) {
			return false
		} else {
			that.setData({
				navActivityIndex,
				cate_id,
				selectNavList: false,
			}, function () {
				that.getcommodity()
			})
		}
	},

	/**
	 * 展开/关闭 导航栏
	 */
	handleSelectNav () {
		let selectNavList = !this.data.selectNavList
		this.setData({
			selectNavList,
		})
	},

	onLoad (query) {
		var that = this
		app.setTitle('填个标题吧');
		that.getAllCatet()
		that.setData({
			cate_id: query.id,
			navActivityIndex: Number(query.index)
		}, function () {
			that.getcommodity()
		})

	},

	onShow () {

	},

	getAllCatet() {
    let token = wx.getStorageSync('token')
    let that = this
    app.http({
      config: {
        url: 'api/v1/all_cate',
        data: {
					token
				},
        method: 'POST'
      },
      isAuth: false
    }).then(res => {
			console.log(res, 'allCatetRes')
			that.setData({
				navList: res.data.data
			})
    }).catch(err => {
      console.log(err, 'allCatetErr')
    })
	},

	/**
	 * 获取商品分类列表
	 */
	getcommodity () {
		const that = this
		const token = wx.getStorageSync('token')
		wx.showLoading()
    app.http({
      config: {
        url: 'api/v1/shop_list',
        data: {
					token,
					cate_id: that.data.cate_id,
				},
        method: 'POST'
      },
      isAuth: false
    }).then(res => {
			console.log(res, 'commodityRes')
			that.setData({
				goodsList: res.data.data.goodsList
			}, function () {
				wx.hideLoading()
			})
    }).catch(err => {
      console.log(err, 'commodityErr')
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
