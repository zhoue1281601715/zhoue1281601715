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
		selected: true,
    selected1: false,
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
	selected: function (e) {

    this.setData({
      selected1: false,
      selected: true
    })

  },

  selected1: function (e) {

    this.setData({
      selected: false,
      selected1: true
    })

  },
	onLoad (query){
		app.setTitle('填个标题吧');
		this.setData({
			id:query.id
		})
		this.getShoppingAllComment()
	},


	onShow (){
		
	},
	
	// 获取商品全部评论
	getShoppingAllComment() {
    let token = wx.getStorageSync('token')
    let that = this
    app.http({
      config: {
        url: 'api/v1/all_comment',
        data: {
					token,
					goods_id:that.data.id
				},
        method: 'POST'
      },
      isAuth: false
    }).then(res => {
			console.log(res, 'shoppingAllCommentRes')
			this.setData({
				shoppingAllComment:res.data.data.commentList.data,
				imgList:res.data.data.imgList.data
			})
			console.log(this.data.shoppingAllComment)
    }).catch(err => {
      console.log(err, 'shoppingAllCommentErr')
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
