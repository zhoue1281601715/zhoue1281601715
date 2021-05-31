import utils from "./util"
// 测试
const http_url = "https://w2.kagaro.com"

const img_url = "https://w2.kagaro.com/"


// const socketHttp = "wss://*****.com/wss";

function requestFun(url, method, data, headerType, err_func) {
  var currentUserInfo = wx.getStorageSync("currentUserInfo");
  if (!currentUserInfo.mobile){
    try {
      if (data.customer_id == "") {
        wx.reLaunch({
          url: '/pages/phone_login/phone_login',
        })
        return false;
      }
    } catch (error) {
      
    }
  }
  
  // wx.showLoading({
  //   title:'加载中',
  //   mask: true
  // });
  
  data = data || {}
  let header = {
    "content-type": headerType == 'json' ? "application/json" : "application/x-www-form-urlencoded",
  }


  let promise = new Promise(function (resolve, reject) {

    // var pages = getCurrentPages()
    // if (!wx.getStorageSync("currentUserInfo") && pages[pages.length - 1].__route__ != 'pages/phone_login/phone_login') {
    //   wx.reLaunch({
    //     url: '/pages/phone_login/phone_login',
    //   })
    //   return false
    // }

    wx.request({
      url: http_url + url,
      header: header,
      data: data,
      method: method,
      success: function (res) {
        console.log("url--------", url, "res-------", res)
        if (res.data.code == 200) {
          resolve(res.data.data);
        } else {
          if (err_func) {
            err_func()
          }

          // err_func()
          setTimeout(() => {
            utils.wx_toast(res.data.msg)
          }, 100)
        }
      },
      fail: function (errMsg) {
        console.log('errMsg---------------', errMsg)
        wx.showToast({
          title: '网络出错，请稍候重试',
          icon: 'none'
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    });
  });
  return promise
}


function isHttpSuccess(status) {
  return status >= 200 && status < 300 || status === 304
}

function wxUpload(files, cb) {
  wx.showLoading({
    title: '正在上传'
  })
  wx.uploadFile({
    url: http_url + '/xcx/order/update_sign_image_xcx',
    filePath: files,
    name: 'image',
    header: {
      "Content-Type": "multipart/form-data",
      "Authorization": wx.getStorageSync('access_token')
    },
    formData: {
      'fileType': 'serve/'
    },
    success(res) {
      if (res.statusCode === 413) {
        utils.wxToast("图片过于大，请上传1M以内图片")
        return
      }
      const isSuccess = isHttpSuccess(res.statusCode)
      if (isSuccess) {
        var result = JSON.parse(res.data)
        if (result.success) {
          return typeof cb == "function" && cb(result)
        } else {
          wx.showToast({
            title: '上传失败！',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '网络出错，请稍候重试！',
          icon: 'none'
        })
        return
      }
    },
    complete() {
      wx.hideLoading()
    }
  })
}

function signle_img_up(arr) {
  return new Promise((resolve) => {
    let send_list = []
    let count = 0
    arr.map((value) => {
      wxUpload(value, function (data) {
        count++
        send_list.push(data.view)
        if (count == arr.length) {
          resolve(send_list)
        }
      })
    })
  })
}

//多个上传
async function multiple_upload(arr, cb) {
  let name = await signle_img_up(arr)
  typeof cb == "function" && cb(name)
}

module.exports = {
  "get": function (url, data) {
    return requestFun(url, "GET", data, 'form')
  },
  "post": function (url, data) {
    return requestFun(url, "POST", data, 'form')
  },
  "json_post": function (url, data, err_func) {
    return requestFun(url, "POST", data, 'json', err_func)
  },
  "put": function (url, data) {
    return requestFun(url, "PUT", data, 'json')
  },
  "delete": function (url, data) {
    return requestFun(url, "delete", data, 'form')
  },
  "upload": function (files, fb) {
    return wxUpload(files, fb)
  },
  "multiple_upload": function (arr, fb) {
    return multiple_upload(arr, fb)
  },
  img_url: img_url
}