/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

var labels = {
    'js': { name: 'javascript', 'class': 'lang' },
    'java': { name: 'Java', 'class': 'lang' },
    'c': { name: 'C/C++', 'class': 'lang' },
    'c#': { name: 'C#', 'class': 'lang' },
    'css': { name: 'css', 'class': 'lang' },
    'html': { name: 'html5', 'class': 'lang' },
    'git': { name: 'git', 'class': 'tool' },
    'justjs': { name: 'JustJS', 'class': 'experience' },
    'jreparser': { name: 'JRE-Parser', 'class': 'experience' },
    'ms-intern': { name: 'Microsoft实习', 'class': 'experience' },
    'haijiao': { name: '海角教育', 'class': 'experience' },
    'unity-3d': { name: 'Unity-3d', 'class': 'tool' },
    'mongodb': { name: 'MongoDB', 'class': 'tool' },
    'logv': { name: 'LogV', 'class': 'experience' },
    'kinect': { name: 'Kinect', 'class': 'tool' },
    'screenbuilder': { name: 'Screen Builder', 'class': 'experience' },
    'adventure': { name: '冒险的召唤', 'class': 'experience' },
    'jekyll': { name: 'jekyll', 'class': 'tool' },
    'uav': { name: '小型无人机技术大赛', 'class': 'experience' },
    'ssh': { name: 'Struct+Spring+Hibernate', 'class': 'tool' },
    'game-dev': { name: '游戏开发', 'class': 'experience' },
    'blog': { name: 'Jerry的乐园（博客）', 'class': 'experience' }
};

var lines = [
    ['ms-intern', 'js', 3],
    ['ms-intern', 'css', 2],
    ['ms-intern', 'html', 2],
    ['ms-intern', 'c#', 2],
    ['ms-intern', 'git', 2],
    ['haijiao', 'ssh', 2],
    ['haijiao', 'js', 1],
    ['haijiao', 'java', 2],
    ['haijiao', 'git', 1],
    ['logv', 'js', 2],
    ['logv', 'css', 1],
    ['logv', 'java', 2],
    ['logv', 'mongodb', 2],
    ['screenbuilder', 'c', 2],
    ['screenbuilder', 'c#', 2],
    ['screenbuilder', 'kinect', 3],
    ['adventure', 'unity-3d', 3],
    ['adventure', 'game-dev', 3],
    ['adventure', 'c#', 1],
    ['adventure', 'js', 2],
    ['blog', 'jekyll', 2],
    ['blog', 'js', 2],
    ['blog', 'css', 3],
    ['blog', 'html', 3],
    ['blog', 'git', 2],
    ['uav', 'c', 2],
    ['uav', 'git', 1],
    ['justjs', 'js', 3],
    ['jreparser', 'js', 3]
];

// calculate three labels with max weight
var key;

for (key in labels) {
    if (labels.hasOwnProperty(key)) {
        labels[key].weight = 0;
    }
}

lines.forEach(function(line) {
    labels[line[0]].weight += line[2];
    labels[line[1]].weight += line[2];
});

var maxThreeLabels = [];
for (key in labels) {
    if (labels.hasOwnProperty(key)) {
        maxThreeLabels.push(labels[key]);
        if (maxThreeLabels.length > 3) {
            maxThreeLabels.sort(function(a, b) {
                return b.weight - a.weight;
            });
            maxThreeLabels.length = 3;
        }
    }
}

// apply more style on three labels with max weight
maxThreeLabels[0].padding = 10;
maxThreeLabels[0].fontSize = 28;
maxThreeLabels[1].padding = 10;
maxThreeLabels[1].fontSize = 24;
maxThreeLabels[2].padding = 8;
maxThreeLabels[2].fontSize = 18;

var relationship = jRelationship('#canvas', labels, lines, {
    // we can drag labels by mouse
    draggable: true,
    // configuration of global style
    padding: 6,
    labelStyle: '#333333',
    lineStyle: '#aaa',
    // configuration of class
    'class': {
        lang: {
            labelStyle: '#4F94CD'
        },
        tool: {
            labelStyle: '#FF6A6A'
        },
        experience: {
            labelStyle: '#EEB422'
        }
    },
    // configuration of force
    elasticity: 0.3,
    stableLength: 200,
    resistance: 4,
    repulsion: 100,
    repulsionDistance: 150,
    frame: 40
});