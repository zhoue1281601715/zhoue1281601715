let util = require("./utils.js")

// 有返回中文的就是true 意味着这个表单提交格式错了
// 返回 undefined 就是表单提交是正确的
//---- edit-card
//登录账号
const accountNum_strict = (message, toast) => {
  let reg = /^[a-zA-Z0-9]{6,16}$/
  let failNull = '请输入账号'
  let failFormat = '请输入正确的账号'

  return backToFailInfo(message, reg, failNull, failFormat, toast)
}
// 登录密码
const password_strict = (message, toast) => {
  let reg = /^[a-zA-Z0-9]{8,16}$/
  let failNull = '请输入密码'
  let failFormat = '请输入正确的密码'

  return backToFailInfo(message, reg, failNull, failFormat, toast)
}
// 手机号
const phone_strict = (message) => {
  let reg = /^1[3456789]\d{9}$/
  let failNull = '请输入您的手机号'
  let failFormat = '请输入11位手机号'

  return backToFailInfo(message, reg, failNull, failFormat)
}

//---- card-list
const group_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,7}$/
  let failNull = '请输入您的分组名称'
  let failFormat = '请输入2-7位中文/英文/数字'

  return backToFailInfo(message, reg, failNull, failFormat)
}

//---- 标题
const title_strict = (message) => {
  let reg = /^[,.\/!@#\$%^\*(){}:";。、；‘’！@#￥%……&*（）_+\|<>\?\u4e00-\u9fa5a-zA-Z0-9\S]{2,13}$/
  let failNull = '请输入您的标题'
  let failFormat = '非法输入'
  return backToFailInfo(message, reg, failNull, failFormat)
}

//---- create-crad
const name_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/
  let failNull = '请输入您的姓名'
  let failFormat = '请输入2-10位中文/英文'

  return backToFailInfo(message, reg, failNull, failFormat)
}

const family_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,6}$/
  let failNull = '请输入亲人姓名'
  let failFormat = '请输入2-6位中文/英文'

  return backToFailInfo(message, reg, failNull, failFormat)
}

const age_strict = (message) => {
  let reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/
  let failNull = '请输入亲人年龄'
  let failFormat = '请输入正确的年龄'
  return backToFailInfo(message, reg, failNull, failFormat)
}

const relation_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,5}$/
  let failNull = '请输入亲人关系'
  let failFormat = '请输入2-5位中文'
  return backToFailInfo(message, reg, failNull, failFormat)
}

const postition_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/
  let failNull = '请输入您的职位'
  let failFormat = '请输入2-10位中文/英文'

  return backToFailInfo(message, reg, failNull, failFormat)
}

const company_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5]{2,20}$/
  let failNull = '请输入您的公司'
  let failFormat = '请输入2-20位中文'

  return backToFailInfo(message, reg, failNull, failFormat)
}

//行业
const trade_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/
  let failNull = '请输入您的行业'
  let failFormat = '请输入2-10位中文/英文'

  return backToFailInfo(message, reg, failNull, failFormat)
}

const companyName_strict = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/
  let failNull = '请输入公司名称'
  let failFormat = '请输入2-6位中文/英文'
  return backToFailInfo(message, reg, failNull, failFormat)
}
//营业范围 不能为空
const company_area = (message) => {
  let failNull = '请输入营业范围'
  return backToFailInfo(message, "", failNull)
}

//信用代码 允许格式： 0123456789012 || 0123456789012 - 12
// let reg = /[0-9]{13}$|[0-9]{13}-[0-9]{2}$/
const company_credit_code = (message) => {
  let reg = /^[a-zA-Z0-9]{18}$/
  let failNull = "请输入信用代码"
  let failFormat = "请输入18位英文/数字"
  return backToFailInfo(message, reg, failNull, failFormat)
}

//企业法人 
const company_legal = (message) => {
  let reg = /^[\u4e00-\u9fa5]{2,6}$/
  let failNull = '请输入企业法人'
  let failFormat = '请输入2-6位中文'
  return backToFailInfo(message, reg, failNull, failFormat)
}

const company_phone_strict = (message) => {
  let reg = /^1[3456789]\d{9}$/
  let failNull = '请输入手机号'
  let failFormat = '请输入11位手机号'

  return backToFailInfo(message, reg, failNull, failFormat)
}

//行业分类 不能为空
const company_trade = (message) => {
  let reg = /^[\u4e00-\u9fa5，。、]{2,10}$/
  let failNull = '请输入行业分类'
  let failFormat = '请输入2-10位中文'
  return backToFailInfo(message, reg, failNull, failFormat)
}

//详细地址 不能为空
const company_address = (message) => {
  let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  let failNull = '请输入详细地址'
  let failFormat = "请输入中文/英文/数字"
  return backToFailInfo(message, reg, failNull, failFormat)

}

const address_strict = (message) => {
  let reg = /^[\d\D]{0,50}$/
  let failNull = '请输入您的地址'
  let failFormat = "不能超过50个字符"
  return backToFailInfo(message, reg, failNull, failFormat)

}

const id_strict = (message) => {
  let reg = /[a-zA-Z0-9]/g
  let failNull = '请输入亲人的账号ID'
  let failFormat = "请输入中文/数字"
  return backToFailInfo(message, reg, failNull, failFormat)
}

function backToFailInfo(message, reg, failNull, failFormat,toast = true) {
  message = message.trim()
  if (!message) {
    if (toast) {
      util.wx_toast(failNull)
    }
    return failNull
  }
  if (reg && !reg.test(message)) {
    if (toast) {
      util.wx_toast(failFormat)
    }

    return failFormat
  }
}

module.exports = {
  company_area: company_area,
  company_credit_code: company_credit_code,
  company_legal: company_legal,
  company_address: company_address,
  company_trade: company_trade,
  companyName_strict: companyName_strict,
  company_phone_strict: company_phone_strict,
  // create-card
  name_strict: name_strict,
  postition_strict: postition_strict,
  company_strict: company_strict,
  trade_strict: trade_strict,

  //card-edit
  phone_strict: phone_strict,

  //card-list
  group_strict: group_strict,
  id_strict: id_strict,

  address_strict: address_strict,
  age_strict: age_strict,
  relation_strict: relation_strict,
  family_strict: family_strict,

  accountNum_strict: accountNum_strict,
  password_strict: password_strict
}