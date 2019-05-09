## canvas-paint

小程序canvas绘图组件，es6语法。
_ _ _

+ [安装](#安装)
+ [用法](#用法)
+ [文档](#文档)
    + [参数](#参数)
        + [config](#config)
            + [文本](#绘制文本)
            + [图片](#绘制图片)
            + [填充区块](#绘制填充区块)
            + [线条区块](#绘制线条区块)
            + [圆角矩形](#绘制圆角矩形)
    + [事件](#事件)
+ [联系我们](#联系我们)

_ _ _

## 安装

```bash
$ npm clone https://github.com/xujiazheng/wx-canvas.git
```

## 用法

```javascript
// 1. 目标页面json中注册
{
    "usingComponents": {
        "canvas-paint": "./wx-canvas"
    }
}

// 2. view中使用组件
<canvas-paint failover="false" width="210" height="168" id="shareCart" binderror="onHandleShareCartError" bindcreated="onHandleShareCartCreated" config="{{canvasConfig}}"></canvas-paint>

// 3. js中赋值
const textDescription = {
    text: '这是一个标题',
    color: '#ff0000', // 颜色
    x: 48, // x坐标
    y: 344, // y坐标
    size: 16, // 文本大小
    type: 'text',
};
const localImageDescription = {
    type: 'image',
    image: '/image/icon.png', // 本地图片路径
    x: 21,
    y: 0,
    width: 168,
    height: 168,
};

const canvasConfig = [
    textDescription,
    localImageDescription,
];
this.setData({
    canvasConfig,
});
```
_ _ _

## 文档

### 参数
| 入参 | 类型 | 默认值 | 必填 | 说明 |
| :------- | :------ | :-------- | :------- | :------ |
| config | Array[Object] | [] | 是 | 绘制canvas的数据 |
| useSave | Boolean | false | 否 | 图片文件是否需要保存到本地 |
| width | Number | - | 是 | canvas画布的宽度 |
| height | Number | - | 是 | canvas画布的高度 |
| failover | Boolean | true | 否 | 是否开启容错，关闭容错后，绘制图片发生错误会终止绘制并触发error事件。如果开启容错，则绘制图片发生错误会继续绘制导出图片。 |

#### config

绘制canvas所需数据的数组，绘制类型有文本、图片、填充区块、线条区块、圆角矩形，例如：

```javascript
const canvasConfig = [
    {
        text: '这是一个标题',
        color: '#ff0000', // 颜色
        x: 48, // x坐标
        y: 344, // y坐标
        size: 16, // 文本大小
        type: 'text',
    },
    {
        type: 'image',
        image: '/image/icon.png', // 本地图片路径
        x: 21,
        y: 0,
        width: 168,
        height: 168,
    }
]
```

##### 绘制文本

type必须为text。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| :----- | :----- | :----- | :----- | :------ |
| type | String | - | true | 必须为'text' |
| color | String | - | true | 字体颜色 |
| size | Number | - | true | 字体大小 |
| x | Number | - | true | x坐标 |
| y | Number | - | true | y坐标 |

```javascript
const textDescription = {
    text: '这是一个标题',
    color: '#ff0000', // 颜色
    x: 48, // x坐标
    y: 344, // y坐标
    size: 16, // 文本大小
    type: 'text',
};
```

##### 绘制图片

type必须为image。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| :----- | :----- | :----- | :----- | :------ |
| type | String | - | true | 必须为'image' |
| width | Number | - | true | 图片宽度 |
| height | Number | - | true | 图片宽度 |
| x | Number | - | true | x坐标 |
| y | Number | - | true | y坐标 |
| src | String | - | false | 网络图片地址，src/image必须存在一个 |
| image | String | - | false | 本地图片路径，同上 |

```javascript
// 绘制网络图片
const onLineImageDescription = {
    type: 'image',
    src: 'http://h0.hucdn.com/open201912/5d6938d94962770f_154x88.png', // 网络图片路径
    x: 0,
    y: 0,
    width: 154,
    height: 88,
};
// 绘制本地图片
const localImageDescription = {
    type: 'image',
    image: '/image/icon.png', // 本地图片路径
    x: 21,
    y: 0,
    width: 168,
    height: 168,
};
// 绘制圆形图片
const circularImageDescription = {
    type: 'image',
    src: 'http://h0.hucdn.com/open201914/f59128d045720f4b_150x150.png', // 网络图片路径
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    radius: 1, // 是否为圆形，1为是，0为否
};
```

##### 绘制填充区块

type必须为rect。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| :----- | :----- | :----- | :----- | :------ |
| type | String | - | true | 必须为'rect' |
| width | Number | - | true | 图片宽度 |
| height | Number | - | true | 图片宽度 |
| x | Number | - | true | x坐标 |
| y | Number | - | true | y坐标 |
| color | String | - | true | 填充颜色 |

```javascript
const rectDescription = {
    color: 'white',
    x: 0,
    y: 0,
    width: 210,
    height: 168,
    type: 'rect',
};
```

##### 绘制线条区块

type必须为line。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| :----- | :----- | :----- | :----- | :------ |
| type | String | - | true | 必须为'line' |
| width | Number | - | true | 图片宽度 |
| height | Number | - | true | 图片宽度 |
| x | Number | - | true | x坐标 |
| y | Number | - | true | y坐标 |
| color | String | - | true | 线条颜色 |

```javascript
const rectDescription = {
    color: '#000000',
    x: 0,
    y: 0,
    width: 210,
    height: 168,
    type: 'line',
};
```

##### 绘制圆角矩形

type必须为box。此区块可以绘制圆角任意值的填充区块和图片。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| :----- | :----- | :----- | :----- | :------ |
| type | String | - | true | 必须为'box' |
| width | Number | - | true | 图片宽度 |
| height | Number | - | true | 图片宽度 |
| x | Number | - | true | x坐标 |
| y | Number | - | true | y坐标 |
| src | String | - | false | 网络图片地址，src/image/color 必须存在一个 |
| image | String | - | false | 本地图片路径 |
| color | String | - | false | 填充颜色 |

```javascript
// 普通的填充区块
const normalRectDescription = {
    type: 'box',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: '#ff0000',
};
// 普通的网络图片（本地图片雷同image类型）
const normalImageDescription = {
    type: 'box',
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    src: 'http://h0.hucdn.com/open201914/8f9fb378a6fcd512_150x150.png',
};
// 带圆角的填充矩形
const radiusRectDescription = {
    type: 'box',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: '#ff0000',
};
```

### 事件

| 事件名 | 说明 | 参数 |
| :--- | :---- | :---- |
| created | canvas绘制完成后触发回调 | e，事件对象，e.detail.path可以拿到临时文件路径。 |
| saved | 当useSave为true时,canvas绘制完成后会保存文件到本地并触发此回调函数 | e，事件对象，e.detail.path可以拿到本地文件路径。 | 
| error | 当failover为false时，绘制发生错误会触发回调。 | e，事件对象。 
|


## 联系我们
| 作者 | 邮箱 |
| :--- | :--- |
|徐嘉正 | 18397968326@163.com |

Issue: [https://github.com/xujiazheng/wx-canvas/issues](https://github.com/xujiazheng/wx-canvas/issues)