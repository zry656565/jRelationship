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
        //style of labels
        class: {},
        fontSize: 16,
        padding: 12,
        labelStyle: 'rgba(0, 0, 200, 1)',
        lineStyle: 'rgba(0, 0, 0, 1)',
        radius: 4,
        //force between labels
        elasticity: 0.5,
        stableLength: 400,
        resistance: 5,
        repulsion: 20,
        repulsionDistance: 100,
        interval: 35
    }, options);

    labels = util.clone(labels);
    lines = util.clone(lines);
    ctx.textBaseline = 'top';

    function getStyle(label, styleName) {
        return label[styleName] || (options.class[label.class] && options.class[label.class][styleName]) || options[styleName];
    }

    //several methods for graphic render
    var graphic = {
        util: {
            roundRect: function (x, y, width, height, radius) {
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
            },
            distance: function (label1, label2) {
                return Math.sqrt( Math.pow(label1.x - label2.x, 2) + Math.pow(label1.y - label2.y, 2) );
            }
        },
        calcLabel: function (label) {
            label.fontSize = getStyle(label, 'fontSize');
            label.padding = getStyle(label, 'padding');
            ctx.font = label.fontSize + "px serif";
            label.width = ctx.measureText(label.name).width + label.padding * 2;
            label.height = label.fontSize + label.padding * 2;
            //put the label on random place
            label.x = Math.random() * (canvas.width - label.width);
            label.y = Math.random() * (canvas.height - label.height);
            label.radius = getStyle(label, 'radius');
            //initial velocity
            label.Vx = 0;
            label.Vy = 0;
        },
        drawLabel: function (label) {
            ctx.fillStyle = getStyle(label, 'labelStyle');
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

            ctx.fillStyle = getStyle({}, 'lineStyle');
            if (weight < 2) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.stroke();
            } else if (weight >= 2) {
                var dx = p1.x - p2.x,
                    dy = p2.y - p1.y,
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

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //get the new position of labels
            for (id in labels) {
                if (labels.hasOwnProperty(id)) {
                    var Fx = 0,
                        Fy = 0,
                        F = 0,
                        current = labels[id],
                        next,
                        distance;

                    //Elasticity
                    for (var i = 0; i < relationship[id].length; i++) {
                        next = labels[relationship[id][i]];
                        distance = graphic.util.distance(current, next);
                        F = options.elasticity * (distance - options.stableLength);
                        //calculate the force at direction X
                        Fx += F * (next.x - current.x) / distance;
                        //calculate the force at direction Y
                        Fy += F * (next.y - current.y) / distance;
                    }

                    //Repulsion force
                    for (var nextId in labels) {
                        if (labels.hasOwnProperty(nextId) && nextId !== id) {
                            next = labels[nextId];
                            distance = graphic.util.distance(current, next);
                            if (distance < options.repulsionDistance) {
                                var rate = (options.repulsionDistance - distance) / options.repulsionDistance;
                                //calculate the force at direction X
                                Fx += rate * options.repulsion * (current.x - next.x) / distance;
                                //calculate the force at direction Y
                                Fy += rate * options.repulsion * (current.y - next.y) / distance;
                            }
                        }
                    }

                    //assume F = ma, m = 1, then F = a.
                    current.Vx += Fx * options.interval / 1000;
                    current.Vy += Fy * options.interval / 1000;
                    //consider about resistance
                    current.Vx -= (current.Vx > 0 ? 1 : -1) * options.resistance * options.interval / 1000;
                    current.Vy -= (current.Vy > 0 ? 1 : -1) * options.resistance * options.interval / 1000;
                    //if touch the walls, reverse the velocity
                    current.newPosition = {
                        x: current.x + current.Vx * options.interval / 1000,
                        y: current.y + current.Vy * options.interval / 1000
                    };
                    if (current.newPosition.x < 0 || current.newPosition.x + current.width > canvas.width) {
                        console.log(current.newPosition.x, current.width);
                        current.Vx = -current.Vx;
                    }
                    if (current.newPosition.y < 0 || current.newPosition.y + current.height > canvas.height) {
                        console.log(current.newPosition.y, current.height);
                        current.Vy = -current.Vy;
                    }
                }
            }
            for (id in labels) {
                if (labels.hasOwnProperty(id)) {
                    labels[id].x = labels[id].newPosition.x;
                    labels[id].y = labels[id].newPosition.y;
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

    var relationship = {};
    for (var id in labels) {
        if (labels.hasOwnProperty(id)) {
            graphic.calcLabel(labels[id]);
            relationship[id] = [];
        }
    }

    //store labels relationships in a big array
    lines.forEach(function(line) {
        relationship[line[0]].push(line[1]);
        relationship[line[1]].push(line[0]);
    });

    setInterval(graphic.draw, options.interval);
    //graphic.draw();
}

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

jRelationship('#canvas', labels, lines, {
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
    //config of force
    elasticity: 0.05,
    stableLength: 300,
    resistance: 10,
    repulsion: 200,
    repulsionDistance: 150,
    interval: 35
});