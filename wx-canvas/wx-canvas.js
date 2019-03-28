
/**
 * canvas绘制组件，此组件为纯功能组件，不做任何业务处理，
 * 组件会将传入的config配置按规范绘制成图片输出。
 */
import {
    drawPoster,
    canvasToTempFilePath,
    saveFile,
    onlineImageToLocalImage,
    measureText,
} from './utils';

Component({
    properties: {
        // 原数据
        config: {
            type: Object,
            observer(val, oldVal) {
                if (val && typeof val === 'object' && !oldVal) {
                    this.initData(val);
                }
            },
        },
        // 是否需要保存为本地文件
        useSave: {
            type: Boolean,
            value: false,
        },
        // canvasId
        canvasId: {
            type: String,
            value: 'canvasId',
        },
        width: {
            type: Number,
            value: 375,
        },
        height: {
            type: Number,
            value: 997,
        },
        // 需要处理error
        hasError: {
            type: Boolean,
            value: false,
        },
        test: {
            type: Boolean,
            value: false,
        },
    },
    ready() {
    },
    methods: {
        getContext() {
            return wx.createCanvasContext(this.data.canvasId, this);
        },
        measureText(text, size) {
            return measureText(this.getContext(), text, size);
        },
        initData(data) {
            this.renderData = data;
            const onLineMap = this.getonLineImgMap();
            // 先将外部图片资源下载到本地，再进行绘制。
            onlineImageToLocalImage(onLineMap).then((pathMap) => {
                Object.keys(pathMap).forEach((key) => {
                    this.renderData.config[key].image = pathMap[key];
                    if (!pathMap[key] && this.data.hasError) {
                        throw new Error('失败');
                    }
                });
            })
                .then(this.startDraw.bind(this))
                .then(this.transferTempFile.bind(this))
                .then(this.handleFile.bind(this))
                .catch(this.handlError.bind(this));
        },
        // 开始绘制
        startDraw() {
            return drawPoster({
                ctx: this.getContext(),
                data: this.renderData,
            });
        },
        // 将canvas转为临时文件
        transferTempFile() {
            return canvasToTempFilePath({
                canvasId: this.data.canvasId,
            }, this);
        },
        // 处理生成的文件
        handleFile({tempFilePath}) {
            if (this.data.useSave) {
                saveFile(tempFilePath).then(({savedFilePath}) => {
                    this.emitSaved(savedFilePath);
                });
            } else {
                this.emitCreated(tempFilePath);
            }
        },
        // 资源文件提取
        getonLineImgMap() {
            const {
                config,
                order,
            } = this.renderData;
            // 匹配需要下载图片的绘制描述类型，目前image和box两种类型需要下载图片
            const pattDownLoadImage = /image|box/;
            const map = {};
            order.forEach((key) => {
                let item = config[key];
                if (pattDownLoadImage.test(item.type) && item.src) {
                    map[key] = item.src;
                }
            });
            return map;
        },
        handlError() {
            this.emitError();
        },
        emitCreated(path) {
            this.triggerEvent('created', {
                path,
            });
        },
        emitSaved(path) {
            this.triggerEvent('saved', {
                path,
            });
        },
        emitError() {
            this.triggerEvent('error');
        },
    },
});
