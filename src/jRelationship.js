/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

jRelationship.util = {
    clone: function(obj) { return JSON.parse(JSON.stringify(obj)); },
    //extend method copy form jQuery
    extend: function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( jQuery.isPlainObject(copy) ||
                        (copyIsArray = jQuery.isArray(copy)) ) ) {

                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }
};

function jRelationship(selector, labels, lines, options) {
    var canvas = document.querySelector(selector),
        ctx = canvas.getContext("2d");

    if (!ctx) {
        throw('Your browser do not support canvas.');
    }

    var util = jRelationship.util;

    options = util.extend({
        fontSize: 16,
        padding: 12,
        style: 'rgba(0, 0, 200, 1)',
        lineStyle: 'rgba(0, 0, 0, 1)',
        radius: 4
    }, options);

    labels = util.clone(labels);
    lines = util.clone(lines);
    ctx.textBaseline = 'top';

    //several methods for graphic render
    var graphic = {
        util: {
            roundRect: function roundedRect(x, y, width, height, radius) {
                ctx.beginPath();
                ctx.moveTo(x, y + radius);
                ctx.lineTo(x, y + height - radius);
                ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
                ctx.lineTo(x + width - radius, y + height);
                ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
                ctx.lineTo(x + width, y + radius);
                ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
                ctx.lineTo(x + radius, y);
                ctx.quadraticCurveTo(x, y, x, y + radius);
                ctx.fill();
            }
        },
        calcLabel: function (label) {
            label.fontSize = label.fontSize || options.fontSize;
            label.padding = label.padding || options.padding;
            ctx.font = label.fontSize + "px serif";
            label.width = ctx.measureText(label.name).width + label.padding * 2;
            label.height = label.fontSize + label.padding * 2;
            //put the label on random place
            label.x = Math.random() * (canvas.width - label.width);
            label.y = Math.random() * (canvas.height - label.height);
            label.radius = label.radius || options.radius;
        },
        drawLabel: function (label) {
            ctx.fillStyle = label.style || options.style;
            graphic.util.roundRect(label.x, label.y, label.width, label.height, 4);
            ctx.fillStyle = "#fff";
            ctx.font = label.fontSize + "px serif";
            ctx.fillText(label.name, label.x + label.padding, label.y + label.padding);
        },
        drawLine: function (label1, label2, weight) {
            var p1 = {
                    x: label1.x + label1.width/2,
                    y: label1.y + label1.height/2
                },
                p2 = {
                    x: label2.x + label2.width/2,
                    y: label2.y + label2.height/2
                };

            ctx.fillStyle = options.lineStyle;
            if (weight < 2) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.stroke();
            } else if (weight >= 2) {
                var dx = Math.abs(p1.x - p2.x),
                    dy = Math.abs(p1.y - p2.y),
                    diffX = weight * dy / Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)),
                    diffY = weight * dx / Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p2.x + diffX, p2.y + diffY);
                ctx.lineTo(p1.x + diffX, p1.y + diffY);
                ctx.lineTo(p1.x, p1.y);
                ctx.closePath();
                ctx.fill();
            }
        },
        draw: function() {
            var id;

            ctx.clearRect(0, 0, 1000, 600);

            for (id in labels) {
                if (labels.hasOwnProperty(id)) {
                    labels[id].x += (Math.random() * 2 - 1) * 5;
                    labels[id].y += (Math.random() * 2 - 1) * 5;
                }
            }

            lines.forEach(function(line) {
                graphic.drawLine(labels[line[0]], labels[line[1]], line[2]);
            });

            for (id in labels) {
                if (labels.hasOwnProperty(id)) {
                    graphic.drawLabel(labels[id]);
                }
            }
        }
    };

    for (var id in labels) {
        if (labels.hasOwnProperty(id)) {
            graphic.calcLabel(labels[id]);
        }
    }

    setInterval(graphic.draw, 100);
    //graphic.draw();
}

var labels = {
        'a': {name: '呵呵呵aaa'},
        'b': {name: '啦啦啦啦啦sadb'},
        'c': {name: '嘿嘿嘿嘿sadf', style: 'rgba(200, 0, 0, 1)', fontSize: 30}
    },
    lines = [
        ['a', 'b', 7],
        ['b', 'c', 5],
        ['a', 'c', 3]
    ];
jRelationship('#canvas', labels, lines, {
    fontSize: 18
});