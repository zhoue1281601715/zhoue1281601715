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
    address_id: '', // 地址ID
    real_name: '', // 姓名
    phone: '', // 手机号
    detail: '', // 详细地址
    post_code: '', // 邮政编码
    region: ['广东省', '广州市', '海珠区'],
    province: '广东省',
    city: '广州市',
    district: '海珠区',
    checked: false,
    is_default: 0,
    deleteFlag: false,
    toastParameter: {}, // 自定义toast参数
	},
	
	/**
	 * picker改变
	 */
	bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const region = e.detail.value
    this.setData({
      region,
      province: region[0],
      city: region[1],
      district: region[2]
    })
  },

  /**
   * 提交地址
   */
  formSubmit (e) {
    const that = this
    const token = wx.getStorageSync('token')
    const { real_name, phone, detail, post_code } = e.detail.value
    const { province, city, district, is_default } = that.data
    if (real_name === '') {
      wx.showToast({
        title: '请先输入姓名',
        icon: 'none',
        duration: 1500
      })
    } else if (phone === '') {
      wx.showToast({
        title: '请先输入手机号码',
        icon: 'none',
        duration: 1500
      })
    } else if (detail === '') {
      wx.showToast({
        title: '请先输入详细地址',
        icon: 'none',
        duration: 1500
      })
    } else if (post_code === '') {
      wx.showToast({
        title: '请先输入邮政编码',
        icon: 'none',
        duration: 1500
      })
    } else {
      app.http({
        config: {
          url: 'api/v1/set_address',
          data: {
            token,
            real_name,
            phone,
            province,
            city,
            district,
            detail,
            post_code,
            is_default
          },
          method: 'POST'
        },
        isAuth: true
      }).then(res => {
        console.log(res, 'formSubmitRes')
        const toastParameter = {
          icon: 'success',
          content: res.data.msg,
          duration: 1500
        }
        that.setData({
          toastParameter,
        }, function () {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        })
      }).catch(err => {
        console.log(err, 'formSubmitErr')
        wx.showModal({
          title: '提示',
          content: err.data.msg,
          showCancel: false
        })
      })
    }
  },

  /**
   * 勾选/取消 "设为默认地址"
   */
  handleCheckboxChange () {
    const that = this
    const checked = !that.data.checked
    const is_default = checked ? 1 : 0
    that.setData({
      checked,
      is_default
    })
  },

  /**
   * 设为默认地址
   */
  handleSetDefaultAddress () {
    const that = this
    const { address_id, checked } = that.data
    if (checked) {
      if (address_id) {
        const token = wx.getStorageSync('token')
        app.http({
          config: {
            url: 'api/v1/set_default',
            data: {
              token,
              address_id
            },
            method: 'POST'
          },
          isAuth: true
        }).then(res => {
          console.log(res, 'setDefaultRes')
          // this.saveAddress(address_id)
          const toastParameter = {
            icon: 'success',
            content: res.data.msg,
            duration: 1500
          }
          that.setData({
            toastParameter,
          })
        }).catch(err => {
          console.log(err, 'setDefaultErr')
          wx.showModal({
            title: '提示',
            content: err.data.msg,
            showCancel: false
          })
        })
      } else {
        wx.showToast({
          title: '地址ID丢失，无法修改',
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      wx.showToast({
        title: '请先勾选设为默认地址',
        icon: 'none',
        duration: 1500
      })
    }
  },

  // 保存修改地址
   saveAddress(e){
    const that = this
    const token = wx.getStorageSync('token')
    // const { address_id} = that.data
    
    const { real_name, phone, detail, post_code } = e.detail.value
    const { province, city, district, is_default,address_id} = that.data
    console.log(is_default,'is_default');
    console.log(e.detail.value);
    console.log(that.data);
    

    
    if (real_name === '') {
      wx.showToast({
        title: '请先输入姓名',
        icon: 'none',
        duration: 1500
      })
    } else if (phone === '') {
      wx.showToast({
        title: '请先输入手机号码',
        icon: 'none',
        duration: 1500
      })
    } else if (detail === '') {
      wx.showToast({
        title: '请先输入详细地址',
        icon: 'none',
        duration: 1500
      })
    } else if (post_code === '') {
      wx.showToast({
        title: '请先输入邮政编码',
        icon: 'none',
        duration: 1500
      })
    } else {
      app.http({
        config: {
          url: 'api/v1/edit_address',
          data: {
            token,
            real_name,
            phone,
            province,
            city,
            district,
            detail,
            post_code,
            is_default:1,
            address_id
          },
          method: 'POST'
        },
        isAuth: true
      }).then(res => {
        console.log(res, 'formSubmitRes')
        const toastParameter = {
          icon: 'success',
          content: res.data.msg,
          duration: 1500
        }
        that.setData({
          toastParameter,
        },() => {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)})
      }).catch(err => {
        console.log(err, 'formSubmitErr')
        wx.showModal({
          title: '提示',
          content: err.data.msg,
          showCancel: false
        })
      })
    }
   },
  /**
   * 删除地址
   */
  handleDeleteAddress () {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确认删除此地址？',
      success (res) {
        if (res.confirm) {
          const token = wx.getStorageSync('token')
          const address_id = that.data.address_id
          app.http({
            config: {
              url: 'api/v1/delete_address',
              data: {
                token,
                address_id
              },
              method: 'POST'
            },
            isAuth: true
          }).then(res => {
            console.log(res, 'deleteAddressRes')
            const toastParameter = {
              icon: 'success',
              content: res.data.msg,
              duration: 1500
            }
            that.setData({
              toastParameter,
            }, () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500)
            })
          }).catch(err => {
            console.log(err, 'deleteAddressErr')
            wx.showModal({
              title: '提示',
              content: err.data.msg,
              showCancel: false
            })
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    if (options.address_id) {
      const { address_id, province, city, district, detail, real_name, phone, post_code, is_default } = options
      const region = [province, city, district]
      const checked = is_default == 1 ? true : false
      const deleteFlag = true
      console.log('options.address_id',options.address_id);
      
      that.setData({
        address_id,
        region,
        province,
        city,
        district,
        detail,
        real_name,
        phone,
        post_code,
        is_default,
        checked,
        deleteFlag
      })
    }
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