# 弹出层组件 (plate-parts)

## 用法

```code

<plate-parts isHide="{{false}}">弹出层内容</plate-parts>

```

## 参数

| 参数名 | 类型 | 必填 | 说明 |
|--|--|--|--|
|background| String| 否 | 背景颜色 默认rgba(0,0,0,.4) |
|position| String | 否 | 弹出层的位置，格式1,1代表居中 可填0,1,2 三种，共有9个方位 |
|animateIn| String | 否 | animate.css 里的动画 默认为 fadeInDown |
|animateOut| String | 否 | animate.css 里的动画 默认为 fadeOutDown |
|animateDuration| Number | 否| 动画过度时间 默认.3s |
|jStyle| String| 否 | 样式 通常设置宽高 |
|isHide| Boolean | 否 | 显示隐藏 默认 true 隐藏 |


## 样式

|类名| 说明 |
|--|--|
| j-class | 在外部引用样式 |


## 事件

| 事件名 | 说明 |
|--|--|
| click | 点击空白处出发事件 |