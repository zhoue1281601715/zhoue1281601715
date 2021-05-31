import { Config } from '../../config';
let Tools = {};

/* 检验数据类型 */
Tools.dataType = data => {
	let result = Object.prototype.toString.call(data).slice(8, -1);
	return result.toLowerCase();
}

/* 获取自定字符串里的自定内容 */
Tools.match = (regexp, string, index = -1) => {

	let result = string.match(regexp);

	if (typeof index == 'number' && index >= 0) {
		if (!!result && result[index]) {
			return result[index];
		} else {
			return false;
		}
	}
	return result;
}

Tools.differ = (step = 0, date) => {

	let newDate
        ,strFormat = ''
        ,res = {}
        ,week
        ,weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    switch (getType(date)){
        case 'undefined' :
            newDate = new Date();

        break;
        case 'string' :
            if(/^\d+$/.test(date)){
                date = Number(date);
            }else{
                newDate = new Date(date);
                break;
            }

        case 'number' :
            if (date.toString().length == 10) date *= 1000;
            newDate = new Date(date);

        break;
        case 'date':
            newDate = date;

        break;
        default :
            console.log('请输入正确的时间格式');
            return false;
    }

    newDate.setTime(newDate.getTime() + (step * 3600 * 24 * 1000));

    res.year = newDate.getFullYear()
    res.month = newDate.getMonth() + 1
    res.day = newDate.getDate()
    res.hours = newDate.getHours()
    res.seconds = newDate.getSeconds()
    res.minutes = newDate.getMinutes()
    week = newDate.getDay();


	if (res.month < 10) res.month = '0' + res.month;
	if (res.day < 10) res.day = '0' + res.day;

	strFormat += res.month + '月' + res.day + '日';
   

	res.dateFormat = res.year + '-' + res.month + '-' + res.day;
	res.cnFormat = strFormat;
	res.cnDate = strFormat + ' ' + weekArr[week];
    res.week = weekArr[week];
    res.date = newDate;

	return res


}


/**
 * 获取token
 */
Tools.getToken = () => {
	return wx.getStorageSync(Config.author.token_key);
}

/**
 * 设置token
 */
Tools.setToken = (token) => {
	wx.setStorageSync(Config.author.token_key, token);
}


Tools.setUser = (user) => {
	wx.setStorageSync(Config.userinfo, user);
}

Tools.getUser = () => {
	return wx.getStorageSync(Config.userinfo);
}

Tools.getUrlVars = (url) => {
	var hash;
	var myJson = {};
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		myJson[hash[0]] = hash[1];
	}
	return myJson;
}

Tools.setUrl = obj => {
	let url = [];

	if (Tools.dataType(obj) == 'object') {
		for (let i in obj) {
			let argument = i + '=' + obj[i];
			url.push(argument)
		}

		url = url.join('&');
		return url;
	}

	return '';
}


Tools.isObject = (value) => {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

/**
 * @desc 深拷贝，结构化拷贝，支持string,number,date,reg等格式，不支持function拷贝
 * @param {Any} obj 
 * @param {WeakMap} hash 
 * @return {Any}
 */

Tools.deepClone = (obj, hash = new WeakMap()) => {
  if (null == obj || "object" != typeof obj) return obj;
  let cloneObj
  let Constructor = obj.constructor
  //console.log(1, Constructor)
  switch (Constructor) {
    case RegExp:
      cloneObj = new Constructor(obj)
      break
    case Date:
      cloneObj = new Constructor(obj.getTime())
      break
    default:
      if (hash.has(obj)) return hash.get(obj)
      cloneObj = new Constructor()
      hash.set(obj, cloneObj)
    // console.log(2, hash.get(obj))
  }
  for (let key in obj) {
    //console.log(3, key, cloneObj)
    cloneObj[key] = Tools.isObject(obj[key]) ? Tools.deepClone(obj[key], hash) : obj[key];
    //console.log(4, key, cloneObj[key])
  }
  return cloneObj
}


module.exports = Tools;