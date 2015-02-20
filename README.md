# jRelationship([中文版文档](https://github.com/zry656565/jRelationship/blob/master/README_zh_cn.md))

A canvas solution to show relationships with labels and lines. See demo at http://zry656565.github.io/jRelationship .

You can find production version of jRelationship in `bin/jRelationship.min.js`

##Usage

Include the JavaScript library file first：

```
<script src="path/to/jRelationship.min.js"></script>
```

Create a canvas instance：

```
<canvas id="#canvas" width="1000" height="600"></canvas>
```

Initialize：

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

// zero configuration
var relationship = jRelationship('#canvas', labels, lines, {});

// stop animate
relationship.stop();
// start animate
relationship.start();
```