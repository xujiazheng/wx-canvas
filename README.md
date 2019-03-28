
# canvas基础组件使用规则
微信小程序canvas绘图组件

## 组件使用

1. 复制此组件wx-canvas到项目中；
2. 在页面中注册组件

```bash
{
    "usingComponents": {
        "wx-canvas": "/component/wx-canvas/wx-canvas" # 组件的路径
    }
}
```
3. 在页面调用组件
```bash
<wx-canvas width="375" height="665" id="myCanvas" canvasId="myCanvas" bindcreated="onHandleCreate" config="{{canvasConfig}}"></wx-canvas>
```
4. js中给赋值canvas的配置canvasConfig
```bash
const canvasConfig = {
    # canvas绘制的所有描述对象
    config: {
        background: {
            type: 'rect', x: 0, y: 0, width: 250, height: 300, color: '#dddddd',
        },
        title: {
            type: 'text', text: '这是一个标题', x: 100, y: 10, size: 14, color: '#ff0000',
        },
        img: {
            type: 'image', src: 'http://xxx', x: 100, y: 100, width: 83, height: 45,
        },
        priceBox: {
            type: 'box', x: 100, y: 160, width: 100, height: 40, radius: 20, color: '#aaa',
        },
        price: {
            type: 'text', text: '¥10.5', x: 120, y: 170, size: 16, color: '#ffffff',
        },
    },
    # canvas绘制顺序数组。
    order: ['background', 'title', 'img', 'priceBox', 'price'],
}
this.setData({
    canvasConfig,
});
```

5. js中注册onHandleCreate函数接收绘制好的图片临时文件
```bash

onHandleCreate(e) {
    let imgPath = e.detail.path; # 绘制好的图片临时文件路径
}
```

## 组件传值

1.  config(canvas画布的数据配置)
> 承载的所有画布需要绘制的配置项

```javascript
# 数据如下：
// 传给组件的配置config
const canvasConfig = {
    // canvas绘制的所有描述对象
    config: {
        background: {
            type: 'rect', x: 0, y: 0, width: 250, height: 300, color: '#dddddd',
        },
        title: {
            type: 'text', text: '这是一个标题', x: 100, y: 10, size: 14, color: '#ff0000',
        },
        img: {
            type: 'image', src: 'http://xxx', x: 100, y: 100, width: 83, height: 45,
        },
        priceBox: {
            type: 'box', x: 100, y: 160, width: 100, height: 40, radius: 20, color: '#aaa',
        },
        price: {
            type: 'text', text: '¥10.5', x: 120, y: 170, size: 16, color: '#ffffff',
        },
    },
    // canvas绘制顺序数组。
    order: ['background', 'title', 'img', 'priceBox', 'price'],
};
```

### 绘制笔画的描述如下：

* 图片
> type必须为'image'，拥有一下属性。其中src为网络图片url，image为本地图片路径。

```bash
{
    type: 'image',
    src: 'http://xxxx',
    x: 0,
    y: 0,
    width: 300,
    height: 200,
}
# 或者
icon: {
    type: 'image',
    image: '本地图片路径',
    x: 21,
    y: 0,
    width: 168,
    height: 168,
}
```
* 文本
> type必须为text， 包含数据如下。

```bash
{
    text: '',
    color: '',
    x: 48 / 2,
    y: 822 / 2,
    size: '',
    type: 'text',
}
```
* 填充区块
> type必须为rect，此区块为颜色填充的图案，包含数据如下：

```bash
{
    color: 'white',
    x: 0,
    y: 0,
    width: 210,
    height: 168,
    type: 'rect',
}
```
* 线条区块
> type必须为line，此区块为线条画出的图案，包含数据如下：

```bash
{
    color: 'white',
    x: 10,
    y: 20,
    width: 100,
    height: 80,
    type: 'line',
}
```

* 圆角矩形区块
> type 必须为box，此区块可以绘制圆角图片也可以绘制圆角填充矩形。异可以绘制普通的矩形和图片

```bash
{
    type: 'box',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: '#ff0000'
}
# 或者
{
    type: 'box',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    src: 'http://xxxx',
}
# 或者
{
    type: 'box',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    image: '本地图片路径',
}
```

2. canvasId（cnavas的唯一id值）
> 可传递canvas的id

3. useSave(保存输出的图片文件到本地)
> 如果需要将canvas输出的图片文件保存到本地就传递值为true

4. width（canvas的宽度）

5. height(canvas的高度)

6. hasError（是否需要处理错误）：默认false
> 如果传递为true，需要绑定error事件来处理错误;

### 事件绑定

* bindcreated
> 绑定此事件，canvas绘制完成后会触发事件，并传值图片路径（临时文件，一次会话生效）。

* bindsaved
> 绑定此事件，canvas绘制完成并保存后触发事件，并传值图片路径（本地文件）。以上两者互斥，useSave为true则需要绑定bindsaved

* binderror
> 绑定错误事件，组件遇到错误会触发此回调


## 注意事项

* 组件提供了文字测量方法measureText可以测量文字长度
```bash

let canvas = this.selectComponent('#myCanvas') # 传递组件的id查找组件实例
canvas.measureText('你好，世界', 16) # 传递文本和文本size，返回测量结果。

```

* 对于文字或者区块填充颜色带有透明度的，canvas会默认将全局透明度设置为相应的数值，并且
后来的描述绘制也会遵循此透明度。如果要不透明度，需要全局设置回1.调用setGlobalAlpha方法，目前考虑没有必要添加。

* 由于微信小程序canvas绘制在安卓机会出现文字或位置错乱等现象。是官网底层的实现问题，已给官方提了bug。