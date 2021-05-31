const { $Toast, $Message } = require('../../utils/iview/base/index');
var dateTimePicker =require('../../utils/dateTimePicker')
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverName:'',//司机姓名
    numberId:'',//身份证号码
    contactPhone:'',//请输入联系人
    carNumber:'',//车牌号
    removeIconFlag: true, // 图片删除按钮显示标识身份证正面
    removeIconFlagf:true,
    toastParameter: {}, // 自定义toast参数
    pay_img: '', // 凭证图片路径（后端处理过的）
    front_image:'',//驾照正面
    // 身份证正面
    front_card :'',
    removeIconFlagf2: true,
    // 身份证反面
    back_card:'',
    removeIconFlagf3: true,
    card_number:'',
    // 头像
    head_img:'',
  },

  inputDriverName:function(e){
    console.log(e,'123123');
    this.setData({
      driverName:e.detail.value
    })
  },
  inputnumberId:function(e){
    this.setData({
      numberId:e.detail.value
    })
  },
  inputcontactName:function(e){
    this.setData({
      contactPhone:e.detail.value
    })
  },
  inputcarNumber:function(e){
    this.setData({
      carNumber:e.detail.value
    })
  },
  login: function(){  
    if(this.data.driverName==''){
      wx.showToast({
        title: '请先输入姓名',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.numberId==''){
      wx.showToast({
        title: '请先身份证',
        icon: 'none',
        duration: 2000
      })

    }else if(this.data.contactPhone==''){
      wx.showToast({
        title: '请先联系电话',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.carNumber==''){
      wx.showToast({
        title: '请先输入车牌号',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.front_image==''){
      wx.showToast({
        title: '请先上传驾照正面',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.back_image==''){
      wx.showToast({
        title: '请先上传驾照反面',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.front_card==''){
      wx.showToast({
        title: '请先上传身份证正面',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.back_card==''){
      wx.showToast({
        title: '请先上传身份证反面',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.head_img==''){
      wx.showToast({
        title: '请先上传头像',
        icon: 'none',
        duration: 2000
      })
    }else {
      console.log(this.data.front_image);
      console.log(this.data.back_image);
      console.log(this.data.front_card );
      console.log(this.data.back_card );
      console.log(this.data.head_img );
      
      app.http({
        config:{
          url:"api/v1/make_driver",
          data:{
            name:this.data.driverName,//姓名
            card_number:this.data.numberId,//身份证号
            link_phone:this.data.contactPhone,//联系人号码
            car_number:this.data.carNumber,//车牌号
            front_imagea:this.data.front_image,
            back_image:this.data.back_image,
            front_card:this.data.front_card,
            back_card:this.data.back_card,
            head_img:this.data.head_img,

          },
          method:'POST',
        },
        isAuth: true
      }).then((res)=>{
        console.log(res);
        console.log(res.data.data.code);
        wx.showToast({
          title: '注册成功',
          icon: 'none',
          duration: 6000
        })
        if(res.data.code==200){
          wx.setStorageSync('plate', this.data.carNumber)
          wx.redirectTo({
            url: '/packageC/driverOrder/index',
          })
        }
      })
    
    }
    // url: 'xcx/item/list',
    //     data: {
    //       customer_id,
    //       table_num,
    //       name,
    //       page: thisPage,
    //       limit: that.data.limit
    //     },
    //     method: 'POST'
 },
 handleChooseImage () {
  const that = this
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success (res) {
      console.log(res,'res12');
      
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
            front_image: data.msg.preview_path,
            removeIconFlag: false
          }, 
          () => {
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
handleChooseImage1 () {
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
            back_image: data.msg.preview_path,
            removeIconFlagf: false
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

handleChooseImage2 () {
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
            front_card: data.msg.preview_path,
            removeIconFlagf2: false
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


handleChooseImage3 () {
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
            back_card: data.msg.preview_path,
            removeIconFlagf3: false
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

handleChooseImage4 () {
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
            head_img: data.msg.preview_path,

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
    front_image:'',
    removeIconFlag: true
  })
},
handleDeleteImage1 () {
  const that = this
  that.setData({
    back_image:'',
    removeIconFlagf: true
  })
},
handleDeleteImage2 () {
  const that = this
  that.setData({
    front_card :'',
    removeIconFlagf2: true
  })
},
handleDeleteImage3 () {
  const that = this
  that.setData({
    back_card:'',
    removeIconFlagf3: true
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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