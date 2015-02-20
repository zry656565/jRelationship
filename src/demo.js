/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

var labels = {
    'js': { name: 'javascript', class: 'lang' },
    'java': { name: 'Java', class: 'lang' },
    'c': { name: 'C/C++', class: 'lang' },
    'c#': { name: 'C#', class: 'lang' },
    'css': { name: 'css', class: 'lang' },
    'html': { name: 'html5', class: 'lang' },
    'git': { name: 'git', class: 'tool' },
    'justjs': { name: 'JustJS', class: 'experience' },
    'jreparser': { name: 'JRE-Parser', class: 'experience' },
    'ms-intern': { name: 'Microsoft实习', class: 'experience' },
    'haijiao': { name: '海角教育', class: 'experience' },
    'unity-3d': { name: 'Unity-3d', class: 'tool' },
    'mongodb': { name: 'MongoDB', class: 'tool' },
    'logv': { name: 'LogV', class: 'experience' },
    'kinect': { name: 'Kinect', class: 'tool' },
    'screenbuilder': { name: 'Screen Builder', class: 'experience' },
    'adventure': { name: '冒险的召唤', class: 'experience' },
    'jekyll': { name: 'jekyll', class: 'tool' },
    'uav': { name: '小型无人机技术大赛', class: 'experience' },
    'ssh': { name: 'Struct+Spring+Hibernate', class: 'tool' },
    'game-dev': { name: '游戏开发', class: 'experience' },
    'blog': { name: 'Jerry的乐园（博客）', class: 'experience' }
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

var relationship = jRelationship('#canvas', labels, lines, {
    //configuration of style
    padding: 6,
    labelStyle: '#333333',
    lineStyle: '#777',
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
    //configuration of force
    elasticity: 0.2,
    stableLength: 300,
    resistance: 4,
    repulsion: 100,
    repulsionDistance: 150,
    interval: 35
});