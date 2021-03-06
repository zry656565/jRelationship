/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

jRelationship.util = {
    clone: function(obj) { return JSON.parse(JSON.stringify(obj)); },
    // extend method copy form jQuery
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

    var util = jRelationship.util,
        selectedLabel = null;

    options = util.extend({
        draggable: false,
        // default style of labels
        class: {},
        fontSize: 16,
        padding: 12,
        labelStyle: 'rgba(0, 0, 200, 1)',
        lineStyle: 'rgba(0, 0, 0, 1)',
        radius: 4,
        // default arguments of force between labels
        elasticity: 0.5,
        stableLength: 400,
        resistance: 5,
        repulsion: 20,
        repulsionDistance: 100,
        frame: 24
    }, options);

    options.interval = 1000 / options.frame;

    labels = util.clone(labels);
    lines = util.clone(lines);
    ctx.textBaseline = 'top';

    function getStyle(label, styleName) {
        return label[styleName] || (options.class[label.class] && options.class[label.class][styleName]) || options[styleName];
    }

    // several methods for graphic rendering
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
            },
            'in': function(label, mouseX, mouseY) {
                return mouseX > label.x && mouseX < label.x + label.width &&
                       mouseY > label.y && mouseY < label.y + label.height;
            }
        },
        calcLabel: function (label) {
            label.fontSize = getStyle(label, 'fontSize');
            label.padding = getStyle(label, 'padding');
            ctx.font = label.fontSize + "px serif";
            label.width = ctx.measureText(label.name).width + label.padding * 2;
            label.height = label.fontSize + label.padding * 2;
            // put the label on random place
            label.x = Math.random() * (canvas.width - label.width);
            label.y = Math.random() * (canvas.height - label.height);
            label.radius = getStyle(label, 'radius');
            // initial velocity
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

            if (weight < 2) {
                ctx.strokeStyle = getStyle({}, 'lineStyle');
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.stroke();
            } else if (weight >= 2) {
                ctx.fillStyle = getStyle({}, 'lineStyle');

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

            // get the new position of labels
            for (id in labels) {
                if (labels.hasOwnProperty(id)) {
                    var Fx = 0,
                        Fy = 0,
                        F = 0,
                        current = labels[id],
                        next,
                        distance;

                    if (current === selectedLabel) {
                        continue;
                    }

                    // Elasticity
                    for (var i = 0; i < relationship[id].length; i++) {
                        next = labels[relationship[id][i]];
                        if (next !== selectedLabel) {
                            distance = graphic.util.distance(current, next);
                            F = options.elasticity * (distance - options.stableLength);
                            //calculate the force at direction X
                            Fx += F * (next.x - current.x) / distance;
                            //calculate the force at direction Y
                            Fy += F * (next.y - current.y) / distance;
                        }
                    }

                    //Repulsion force
                    for (var nextId in labels) {
                        if (labels.hasOwnProperty(nextId) && nextId !== id) {
                            next = labels[nextId];
                            if (next !== selectedLabel) {
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
                    }

                    // assume F = ma, m = 1, then F = a.
                    current.Vx += Fx * options.interval / 1000;
                    current.Vy += Fy * options.interval / 1000;
                    // consider about resistance
                    current.Vx -= (current.Vx > 0 ? 1 : -1) * options.resistance * options.interval / 1000;
                    current.Vy -= (current.Vy > 0 ? 1 : -1) * options.resistance * options.interval / 1000;
                    // if touch the walls, reverse the velocity
                    current.newPosition = {
                        x: current.x + current.Vx * options.interval / 1000,
                        y: current.y + current.Vy * options.interval / 1000
                    };
                    if (current.newPosition.x < 0) {
                        current.Vx = -current.Vx;
                        current.newPosition.x = 0;
                    }
                    if(current.newPosition.x + current.width > canvas.width) {
                        current.Vx = -current.Vx;
                        current.newPosition.x = canvas.width - current.width;
                    }
                    if (current.newPosition.y < 0) {
                        current.Vy = -current.Vy;
                        current.newPosition.y = 0;
                    }
                    if (current.newPosition.y + current.height > canvas.height) {
                        current.Vy = -current.Vy;
                        current.newPosition.y = canvas.height - current.height;
                    }
                }
            }
            for (id in labels) {
                if (labels.hasOwnProperty(id)) {
                    if (labels[id] !== selectedLabel) {
                        labels[id].x = labels[id].newPosition.x;
                        labels[id].y = labels[id].newPosition.y;
                    }
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

    // store labels relationships in a big array
    lines.forEach(function(line) {
        relationship[line[0]].push(line[1]);
        relationship[line[1]].push(line[0]);
    });

    if (options.draggable) {
        var dX, dY;
        canvas.addEventListener('mousedown', function(e){
            // find which one was selected
            for (var id in labels) {
                if (labels.hasOwnProperty(id)) {
                    if (graphic.util.in(labels[id], e.clientX, e.clientY)) {
                        selectedLabel = labels[id];
                        dX = e.clientX - labels[id].x;
                        dY = e.clientY - labels[id].y;
                        selectedLabel.Vx = 0;
                        selectedLabel.Vy = 0;
                        break;
                    }
                }
            }
        });
        canvas.addEventListener('mousemove', function(e){
            if (selectedLabel) {
                selectedLabel.x = e.clientX - dX;
                selectedLabel.y = e.clientY - dY;
            }
        });
        canvas.addEventListener('mouseup', function(){
            // release the selected label
            if (selectedLabel) {
                selectedLabel = null;
            }
        });
        canvas.addEventListener('mouseout', function() {
            // release the selected label
            if (selectedLabel) {
                selectedLabel = null;
            }
        });
    }

    var intervalId = setInterval(graphic.draw, options.interval);

    return {
        start: function() {
            if (!intervalId) intervalId = setInterval(graphic.draw, options.interval);
        },
        stop: function() {
            clearInterval(intervalId);
            intervalId = null;
        },
        setArguments: function(args) {
            var allowedArgs = ['elasticity', 'stableLength', 'resistance', 'repulsion', 'repulsionDistance'];

            for (var key in args) {
                if (args.hasOwnProperty(key)) {
                    if (allowedArgs.indexOf(key) < 0) {
                        delete args[key];
                    }
                }
            }

            options = util.extend(options, args);
        }
    };
}