/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

function jRelationship(selector, labels, lines, options) {
    var canvas = document.querySelector(selector),
        ctx = canvas.getContext("2d");

    if (!ctx) {
        throw('Your browser do not support canvas.');
    }

    var util = {
        clone: function(obj) { return JSON.parse(JSON.stringify(obj)); },
        //calculate actual length of an UTF-8 string, e.g. len(呵呵) = 4
        actualLen: function(str) { return str.replace(/[^\x00-\xff]/g, '..').length; }
    };

    var w = canvas.width,
        h = canvas.height;
    labels = util.clone(labels);
    lines = util.clone(lines);

    var graphic = {
        drawLabel: function (label) {
            if (!label.x) {
                label.x = Math.random() * w;
                label.y = Math.random() * h;
            }
            console.log(label);
            ctx.fillStyle = label.style || "rgba(0, 0, 200, 0.4)";
            ctx.fillRect (label.x, label.y, util.actualLen(label.name) * 12 + 10, 30);
        }
    };

    for (var id in labels) {
        if (labels.hasOwnProperty(id)) {
            graphic.drawLabel(labels[id]);
        }
    }
}

var labels = {
        'a': {name: 'aaaaaaaaaaaaaaa'},
        'b': {name: 'bbb'},
        'c': {name: 'cccccc', style: 'rgba(200, 0, 0, 0.4)'}
    },
    lines = [
        ['a', 'b', 3],
        ['b', 'c', 2],
        ['a', 'c', 1]
    ];
jRelationship('#canvas', labels, lines);