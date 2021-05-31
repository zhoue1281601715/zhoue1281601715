# 路由组件 (url-parts)

## 用法

```code

<url-parts url="路径">文字</url-parts>

```

## 参数

|参数名| 类型 | 必填 | 说明 |
|--|--|--|--|
|opentType|String|否|跳转类型|
|url|String|是|跳转路径|

## 样式

|类名|说明|
|--|--|
|j-class| 外部引用样式 |


## 配置

```
需要在config.js文件中添加tabBar属性内容,该数组是app.json中tabBar -> list下的所有路径, 开头不要写/

tabBar : []

```