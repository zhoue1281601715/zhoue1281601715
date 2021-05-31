#图片组件 (img-parts)

## 用法

```code

<page-parts options="请求配置" bind:success="成功触发事件" />

```

## 参数

| 参数名 | 是否必填 | 类型 | 说明 |
|--|--|--|
| loadColor | 否  | String| 加载数据时字体颜色 |
| isAuth | 否  | Boolean |  请求接口验证是否登录，默认为true |
| endColor | 否  | String |  数据到底时字体颜色 |
| wait  | 否 | Array | 验证必填请求参数，如果检测参数没有填则不进行请求 |
| options | 是  | Object |  请求数据，必填分页数 |


## 事件

|事件名|说明|
|--|--|
| success | 数据请求成功后出发 |
| fail | 数据请求失败时触发 |
| start | 每次请求数据前触发 |