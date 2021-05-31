const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
    },
		activeIdx: -1, // tabbar当前下标
		CustomBar: 0, // 自定义导航栏高度
		deliveryCheckTotal: 0, // 选中的商品数量
		allChecked: false, // 是否全选
    deliveryList: [], // 准备入仓商品列表
    deliveryPopupShow: false, // 入仓弹窗是否显示
    deliveryID: '', // 选中的入仓商品ID
    deliveryDetails: '', // 选中的入仓商品详情
    oneKindDeliveryTotal: '', // 用户填写的单种商品的出仓总数
    deliveryPackageNum: '', // 出仓箱数
    deliveryStockNum: '', // 出仓瓶数
    deliveryTotal: '', // 用户入仓所有商品的入仓总数
    // 预约仓
    deliveryyuy:''
	},
	
	/**
	 * 用户点击自定义checkbox，选中/取消 该选项
	 */
	handleCheckboxChange (e) {
		const that = this
		let deliveryList = that.data.deliveryList
		const deliveryListLen = deliveryList.length
		const itemIndex = e.currentTarget.dataset.index
		const itemChecked = !deliveryList[itemIndex].checked // 先用一个变量存储该商品选项的checked，并取反
		deliveryList[itemIndex].checked = itemChecked // 修改该商品选项的checked状态
		const deliveryCheckTotal = itemChecked ? ++that.data.deliveryCheckTotal : --that.data.deliveryCheckTotal // 购物车商品选项选中总数
		const allChecked = deliveryCheckTotal === deliveryListLen ? true : false // 判断选中总数是否等于列表长度，如果是，代表全部选中，如果不是，则代表还未全部选中
		that.setData({
			deliveryList,
			deliveryCheckTotal,
			allChecked
		})
	},

	/**
	 * 全选/全不选
	 */
	handleCheckedAllChange () {
		const that = this
		const allChecked = !that.data.allChecked
		const deliveryList = that.data.deliveryList // 购物车列表
		let deliveryCheckTotal = 0 // 购物车商品选项选中选项总数
		if (allChecked) {
			deliveryCheckTotal = deliveryList.length
			deliveryList.forEach(item => {
				item.checked = true
			})
			that.setData({
				allChecked,
				deliveryList,
				deliveryCheckTotal
			})
		} else {
			deliveryList.forEach(item => {
				item.checked = false
			})
			that.setData({
				allChecked,
				deliveryList,
				deliveryCheckTotal
			})
		}
	},

  /**
   * 打开出仓弹窗
   */
  handleOpenDeliveryPopup(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const { deliveryID, deliveryList } = that.data
    console.log('deliveryList', deliveryList)
    const deliveryListLen = deliveryList.length
    if (deliveryID === id) {
      this.setData({
        deliveryPopupShow: true,
      })
    } else {
      if (deliveryListLen > 0) {
        for (let i = 0; i < deliveryListLen; i++) {
          if (deliveryList[i].id === id) {
            that.setData({
              deliveryID: deliveryList[i].id,
              deliveryDetails: deliveryList[i],
              oneKindDeliveryTotal: deliveryList[i].totalNum,
              deliveryPackageNum: deliveryList[i].packageNum,
              deliveryStockNum: deliveryList[i].stockNum,
              deliveryPopupShow: true
            })
            break;
          }
        }
      }
    }
	},

	/**
	 * 用户删除出仓单
	 */
	handleDeleteDeliveryReceipt(e) {
		const that = this
		wx.showModal({
			title: '提示',
			content: '确认删除此商品？',
			success(res) {
				if (res.confirm) {
					const id = e.currentTarget.dataset.id
					const { deliveryList } = that.data
					const deliveryListLen = deliveryList.length
					for (let i = 0; i < deliveryListLen; i++) {
						if (deliveryList[i].id === id) {
              deliveryList.splice(i, 1)
              if (deliveryList.length > 0) {
                let deliveryCheckTotal = 0
                deliveryList.forEach(item => {
                  if (item.checked) {
                    deliveryCheckTotal += 1
                  }
                })
                const allChecked = deliveryCheckTotal === deliveryList.length ? true : false // 判断选中总数是否等于列表长度，如果是，代表全部选中，如果不是，则代表还未全部选中
                that.setData({
                  deliveryList,
                  deliveryCheckTotal,
                  allChecked
                })
              } else {
                that.setData({
                  deliveryList,
                  allChecked: false
                })
              }
              wx.setStorageSync('deliveryList', deliveryList)
							break;
						}
					}
				}
			}
		})
	},

  /**
   * 关闭出仓弹窗
   */
  handleCloseDeliveryPopup() {
    this.setData({
      deliveryPopupShow: false
    })
  },

  /**
   * 阻止冒泡
   */
  stopBubbling() {},

  /**
   * 用户填写单种商品的出仓总数
   */
  handleOneKindDeliveryTotal(e) {
    const that = this
    let { oneKindDeliveryTotal, deliveryPackageNum, deliveryStockNum } = that.data
    const { item_multiple } = that.data.deliveryDetails
    const value = Number(e.detail.value)
    oneKindDeliveryTotal = value
    deliveryPackageNum = Math.floor(value / item_multiple)
    deliveryStockNum = value >= item_multiple ? (value % item_multiple) : value
    that.setData({
      oneKindDeliveryTotal,
      deliveryPackageNum,
      deliveryStockNum
    })
  },

  /**
   * 用户填写出仓箱数
   */
  handleDeliveryPackageNumInput(e) {
    const that = this
    let { oneKindDeliveryTotal, deliveryPackageNum, deliveryStockNum } = that.data
    const { item_multiple } = that.data.deliveryDetails
    const value = Number(e.detail.value)
    oneKindDeliveryTotal = value * item_multiple + deliveryStockNum
    deliveryPackageNum = value
    that.setData({
      oneKindDeliveryTotal,
      deliveryPackageNum
    })
  },

  /**
   * 用户填写出仓瓶数
   */
  handleDeliveryStockNumInput(e) {
    const that = this
    let { oneKindDeliveryTotal, deliveryPackageNum, deliveryStockNum } = that.data
    const { item_multiple } = that.data.deliveryDetails
    const value = Number(e.detail.value)
    oneKindDeliveryTotal = deliveryPackageNum * item_multiple + value
    deliveryStockNum = value
    that.setData({
      oneKindDeliveryTotal,
      deliveryStockNum
    })
  },

  /**
   * 用户点击"添加到出仓"按钮
   */
  deliveryFormSubmit(e) {
    console.log('e', e)
    const that = this
    let { deliveryID, deliveryDetails, deliveryList } = that.data
    const { totalNum } = e.detail.value
    if (totalNum <= deliveryDetails.quantity) {
      deliveryDetails.totalNum = totalNum
      const deliveryListLen = deliveryList.length
      if (deliveryListLen > 0) {
        for (let i = 0; i < deliveryListLen; i++) {
          if (deliveryList[i].id === deliveryID) {
            console.log('deliveryList[i].id', deliveryList[i].id)
            console.log('deliveryID', deliveryID)
            deliveryList.splice(i, 1, deliveryDetails)
            break;
          } else {
            if (i === (deliveryListLen - 1)) {
              deliveryList.push(deliveryDetails)
            }
          }
        }
      } else {
        deliveryList.push(deliveryDetails)
      }
      that.setData({
        deliveryList,
        deliveryDetails
      }, () => {
        let deliveryTotal = 0
        deliveryList.forEach(item => {
          deliveryTotal += Number(item.totalNum)
        })
        that.setData({
          deliveryTotal,
          deliveryPopupShow: false
        })
      })
    } else {
      wx.showToast({
        title: '出库数量不能大于库存数量',
        icon: 'none',
        duration: 3000
      })
    }
  },
	
	/**
   * 用户点击立即下单
   */
  handleOrderNow() {
    const that = this
		const { deliveryList } = that.data
		let deliveryCheckedList = []
		deliveryList.forEach(item => {
			if (item.checked) {
				deliveryCheckedList.push(item)
			}
		})
    if (deliveryCheckedList.length === 0) {
      wx.showToast({
        title: '请选择出仓的商品',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.setStorageSync('deliveryCheckedList', deliveryCheckedList)
      wx.navigateTo({
        url: '/packageB/deliveryShippingInformation/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    console.log('123123',options);
    
		const deliveryList = wx.getStorageSync('deliveryList')
		const CustomBar = app.store.custom.CustomBar
		deliveryList.forEach(item => {
			item.checked = false // 默认所有选项的选中状态都是未选中
		})
		that.setData({
			deliveryList,
			CustomBar
    })
    if(options.yuyIndex2==1){
      that.setData({
        deliveryyuy:'预约下单'
      })
    }else {
      that.setData({
        deliveryyuy:'立即下单'
      })
    }
		console.log('deliveryList', deliveryList)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})