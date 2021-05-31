/**时间戳式日期处理 */
const formatTime = (datetime, type) => {
  let date = new Date(datetime)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  if (type == 1) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  if (type == 2) {
    return [year, month].map(formatNumber).join('.')
  }

  if (type == "YYYY-MM-DD") {
    return [year, month, day].map(formatNumber).join('/')
  } else if (type == "YYYY-MM-DD HH:mm") {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
  } else {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**字符串式日期处理 */
const formatDate = (date, type) => {
  if (!date) return '';
  let data = date.toString().replace(/\-/g, '/')
  let year = data.split(' ')[0].split('/')[0];
  let month = data.split(' ')[0].split('/')[1];
  let day = data.split(' ')[0].split('/')[2];
  let hours = data.split(' ')[1].split(':')[0];
  let min = data.split(' ')[1].split(':')[1];
  let sec = data.split(' ')[1].split(':')[2];

  if (type == "YYYY-MM-DD") {
    return [year, month, day].map(formatNumber).join('-')
  } else {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hours, min].map(formatNumber).join(':')
  }

}


const get_week_day = str => {
  //时间格式转换
  var newDate = dateToStr(new Date(str));
  //获取当天是星期几
  var ji = "日一二三四五六".charAt(new Date(str).getDay());
  return newDate + ' 星期' + ji
}

function dateToStr(datetime) {
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1; //js从0开始取 
  var date = datetime.getDate();
  // var hour = datetime.getHours(); 
  // var minutes = datetime.getMinutes(); 
  // var second = datetime.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  // if(hour <10){
  //     hour = "0" + hour;
  // }
  // if(minutes <10){
  //     minutes = "0" + minutes;
  // }
  // if(second <10){
  //     second = "0" + second ;
  // }

  // var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second; 
  var time = year + "-" + month + "-" + date;

  return time;
}

const get_month = str => {
  let arr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十一月"]
  let new_date = new Date(str);
  return arr[new_date.getMonth()]
}


/**检测字符串中是否包含手机号 */
const matchPhoneNum = str => {
  var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
  var phoneNums = str.match(regx);
  if (phoneNums != null && phoneNums.length > 0) {
    for (var i = 0; i < phoneNums.length; i++) {
      //手机号全部替换
      //str = str.replace(phoneNums[i],"[****]");
      var temp = phoneNums[i]
      //隐藏手机号中间4位(例如:12300102020,隐藏后为132****2020)
      temp = temp.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      str = str.replace(phoneNums[i], temp);
    }
  }
  return str;
}

/**处理字符串 null  */
const formatNullStr = str => {
  let result = "";
  if (str == null || str == "null" || str == "") {
    result = "";
  } else {
    result = str;
  }
  return result;
}
/**判断字符串是否为空 */
const strIsNull = str => {
  if (str == null || str == "null" || str == "") {
    return true;
  } else {
    return false;
  }
}

/**拨打电话 */
const callPhone = phone => {
  if (phone != null && phone != "") {
    wx.makePhoneCall({
      phoneNumber: phone
    })
  } else {
    wx.showToast({
      title: '暂无手机号',
      icon: 'none'
    })
  }
}

/**复制文字 */
const copyText = text => {
  wx.setClipboardData({
    data: text,
    success(res) {
      // wx.getClipboardData({
      //   success(res) {
      //     //console.log(res.data) // data
      //   }
      // })
    }
  })
}

/**保存通讯录 */
const savePhone = params => {
  wx.addPhoneContact({
    firstName: params.name,
    mobilePhoneNumber: params.phone,
    weChatNumber: params.wx,
    organization: params.company,
    title: params.position,
    email: params.email,
    url: params.url
  })
}


// 提示 默认5秒
const wx_toast = (title, time) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: time ? time : 3000
  })
}

// 节流
const debounce = (fn, delay, data) => {
  clearTimeout(fn.timeoutId);
  fn.timeoutId = setTimeout(function () {
    fn.call(null, data);
  }, delay);
}

//action 获取:get 设置:set page_position_index页面位置 set_data设置的值 get_data获取的值
const get_page_data = (action, page_position_index, set_data, get_data) => {
  let pages = getCurrentPages(); //当前页面栈
  let prevPage = pages[pages.length - page_position_index]; //上一页面
  if (action == 'get') {
    return prevPage.data[get_data]
  } else if (action == 'set') {
    prevPage.setData({
      get_data: set_data
    })
  }
}

//提示信息
//desc 描述 time 时间 page_index 页数
const show_tip_info_navigation = (desc, time = 3000, page_index = 1, func) => {
  setTimeout(() => {
    let get_time = time
    wx_toast(desc, get_time)
    setTimeout(() => {
      if (page_index) {
        wx.navigateBack({
          delta: page_index
        })
      }
      func ? func() : ""
    }, get_time)
  }, 600)
}

//清除空格
const claer_space = (value) => {
  return value.replace(/\s/g, "")
}

function fixed(num, s) {
  var times = Math.pow(10, s)
  var des = num * times + 0.5
  des = parseInt(des, 10) / times
  return des
}

//取大于数
const toFixed = (num) => {
  return fixed(num, 2)
}
//将阿拉伯数字传化为中文数字
const chinese_number = (num) => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num)
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = "0" + noWan;
  }
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  matchPhoneNum: matchPhoneNum,
  formatNullStr: formatNullStr,
  callPhone: callPhone,
  copyText: copyText,
  strIsNull: strIsNull,
  wx_toast: wx_toast,
  savePhone: savePhone,
  debounce: debounce,
  get_week_day: get_week_day,
  get_month: get_month,
  get_page_data: get_page_data,
  show_tip_info_navigation: show_tip_info_navigation,
  claer_space: claer_space,
  toFixed: toFixed,
  chinese_number: chinese_number
}