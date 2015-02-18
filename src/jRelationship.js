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
    
    labels = util.clone(labels);
    lines = util.clone(lines);

    var graphic = {
        drawLabel: function (label) {
            if (!label.x) {
                label.fontSize = label.fontSize || 16;
                ctx.font = label.fontSize + "px serif";
                label.padding = label.padding || 12;
                label.width = ctx.measureText(label.name).width + label.padding * 2;
                label.height = label.fontSize + label.padding * 2;
                label.x = Math.random() * (canvas.width - label.width);
                label.y = Math.random() * (canvas.height - label.height);
            }
            ctx.fillStyle = label.style || "rgba(0, 0, 200, 1)";
            ctx.fillRect(label.x, label.y, label.width, label.height);
            ctx.fillStyle = "#fff";
            console.log(label);
            ctx.fillText(label.name, label.x + label.padding, label.y + label.fontSize + label.padding - 5);
        }
    };

    for (var id in labels) {
        if (labels.hasOwnProperty(id)) {
            graphic.drawLabel(labels[id]);
        }
    }
}

var labels = {
        'a': {name: '呵呵呵aaa'},
        'b': {name: '啦啦啦啦啦sadb'},
        'c': {name: '嘿嘿嘿嘿sadf', style: 'rgba(200, 0, 0, 1)', fontSize: 30}
    },
    lines = [
        ['a', 'b', 3],
        ['b', 'c', 2],
        ['a', 'c', 1]
    ];
jRelationship('#canvas', labels, lines);