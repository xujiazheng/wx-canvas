const skynet = getApp().monitor;
// 填充文本
export const fillText = (ctx, {
    color, size, text, x, y, align = 'left',
}) => {
    ctx.setFillStyle(color);
    ctx.setFontSize(size);
    ctx.setTextAlign(align);
    ctx.fillText(text, x, y);
};

// 画线条图案
export const drawLine = (ctx, {
    x, y, width, height, color,
}) => {
    ctx.setStrokeStyle(color);
    ctx.strokeRect(x, y, width, height);
};

// 绘图
export const drawImage = (ctx, {
    image, x, y, width, height, radius = 0, // 次radius表示是否为圆形，并不是半径
}) => {
    if (!image) {
        return;
    }
    if (radius) {
        const rr = width / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + rr, y + rr, rr, 0, 2 * Math.PI);
        ctx.clip();
    }
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
};

// 画区块
export const fillRect = (ctx, {
    color, x, y, width, height,
}) => {
    ctx.setFillStyle(color);
    ctx.fillRect(x, y, width, height);
};

// 圆角矩形区域裁剪函数
const clipRect = (ctx, {
    x, y, w, h, r,
}) => {
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    // 顶部线条
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    // 右部线条
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    // 底部线条
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    // 左部线条
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);
};
// 各类矩形绘制，可以绘制填充色圆角矩形/填充色普通矩形（radius = 0），圆角图片/普通图片(radius = 0)
export const drawRadiusBox = (ctx, {
    x, y,
    radius = 0,
    width, height,
    color = 'transparent',
    image,
}) => {
    ctx.setFillStyle(color);
    // 开始绘制
    ctx.save();
    ctx.beginPath();
    clipRect(ctx, {
        x,
        y,
        w: width,
        h: height,
        r: radius,
    });
    ctx.fill();
    // 剪切
    ctx.clip();
    if (image) {
        drawImage(ctx, {
            width, height, x, y, image,
        });
    }
    ctx.restore();
};
// 测量文本长度
export const measureText = (ctx, text, size) => {
    ctx.setFontSize(size);
    return ctx.measureText(text).width;
};

// 绘制类型type与处理对象的映射表
const HandleTypeMap = {
    text: {
        handle: fillText,
    },
    rect: {
        handle: fillRect,
    },
    image: {
        handle: drawImage,
    },
    line: {
        handle: drawLine,
    },
    box: {
        handle: drawRadiusBox,
    },
};

// canvas 转图片
export const canvasToTempFilePath = (
    {
        canvasId,
        quality = 1,
        fileType = 'jpg',
    },
    context
) => new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
        canvasId,
        quality,
        fileType,
        success: resolve,
        fail: reject,
    }, context);
});

// 保存文件
export const saveFile = (tempFilePath) => new Promise((resolve, reject) => {
    wx.saveFile({
        tempFilePath,
        success: resolve,
        fail: reject,
    });
});

// url转本地图片
export const onlineImageToLocalImage = (imgMap) => {
    const tasks = [];
    const resultMap = {};
    Object.keys(imgMap).forEach((key) => {
        let imgSrc = imgMap[key];
        tasks.push(new Promise((resolveSub) => {
            wx.getImageInfo({
                src: imgSrc.replace(/^http(?=:)/i, 'https'),
                success(res) {
                    resultMap[key] = res.path;
                    resolveSub(res.path);
                },
                fail(err) {
                    resultMap[key] = '';
                    resolveSub('');
                    skynet.error(JSON.stringify(err), {
                        url: imgSrc.replace(/^http(?=:)/i, 'https'),
                    });
                },
            });
        }));
    });
    return Promise.all(tasks).then(() => resultMap);
};

// 绘图队列，
export const drawQueue = {
    list: [],
    queue(cb) {
        this.list.push(cb);
    },
    run() {
        return new Promise((resolve) => {
            let queue = [Promise.resolve()].concat(this.list);
            let $q;
            while (($q = queue.shift())) {
                if (queue[0]) {
                    let handleFn = queue[0];
                    queue[0] = $q.then(() => Promise.resolve().then(() => {
                        handleFn();
                    }));
                }
            }
        });
    },
};

// 画布开始
export const drawPoster = ({ctx, data} = {}) => new Promise((resolve) => {
    ctx.setTextBaseline('top');
    const {
        config,
        order,
    } = data;
    // 遍历所有笔画
    order.forEach((key) => {
        let item = config[key];
        if (item && item.type) {
            let handleObj = HandleTypeMap[item.type];
            if (!handleObj) {
                return;
            }
            let {handle} = handleObj;
            drawQueue.queue(() => {
                handle(ctx, item);
            });
        }
    });
    // 绘制画布
    drawQueue.queue(() => {
        ctx.draw(true, () => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    });
    drawQueue.run();
});
