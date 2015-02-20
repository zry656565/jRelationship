# jRelationship([English Version](https://github.com/zry656565/jRelationship/blob/master/README.md))

jRelationship是一个canvas工具库，可以用标签与线来表示一系列关系。查看DEMO请看：http://zry656565.github.io/jRelationship

只需要一个库文件，不依赖jQuery，你就可以使用jRelationship。[下载压缩后的版本](https://raw.githubusercontent.com/zry656565/jRelationship/master/bin/jRelationship.min.js)

##用法

首先引入js文件：

```
<script src="path/to/jRelationship.min.js"></script>
```

创建canvas实例：

```
<canvas id="#canvas" width="1000" height="600"></canvas>
```

初始化：

```
var labels = {
    'js': { name: 'javascript' },
    'java': { name: 'Java' },
    'c': { name: 'C/C++' },
};

var lines = [
    ['java', 'js', 3],
    ['java', 'c', 2],
    ['js', 'c', 2]
];

// 零配置初始化
var relationship = jRelationship('#canvas', labels, lines, {});

// 停止动画
relationship.stop();
// 开始动画
relationship.start();
```

##可用参数

首先需要知道的几件事：
- 连线之间的作用力类似于弹簧
- 标签之间距离小于一定范围会有互斥力，并且距离越小互斥力越大

###动画参数
参数名|参数类型|作用|参考范围
-----|-------|---|------
draggable|boolean|决定canvas中的标签是否可以拖拽|true/false
elasticity|number|弹簧的劲度系数|0.3
stableLength|number|弹簧的稳定长度|200(px)
resistance|number|摩擦系数，决定了摩擦力大小|4
repulsion|number|互斥力最大值|100
repulsionDistance|number|互斥力产生的最大距离| 150(px)
frame|number|动画的帧数|24


###样式参数
参数名|参数类型|作用|参考范围
-----|-------|---|------
padding|number|标签的内边距|4-10
labelStyle|string|标签的样式|'#333333'/'rgb(0, 0, 0, 0.5)'
lineStyle|string|连线的样式|'#aaa'
class|object|样式类| { lang: { labelStyle: '#4F94CD' } }



