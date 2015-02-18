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
        style: 'rgba(0, 0, 200, 1)'
    }, options);

    labels = util.clone(labels);
    lines = util.clone(lines);
    ctx.textBaseline = 'top';

    var graphic = {
        drawLabel: function (label) {
            if (!label.x) {
                label.fontSize = label.fontSize || options.fontSize;
                ctx.font = label.fontSize + "px serif";
                label.padding = label.padding || options.padding;
                label.width = ctx.measureText(label.name).width + label.padding * 2;
                label.height = label.fontSize + label.padding * 2;
                //put the label on random place
                label.x = Math.random() * (canvas.width - label.width);
                label.y = Math.random() * (canvas.height - label.height);
            }
            ctx.fillStyle = label.style || options.style;
            ctx.fillRect(label.x, label.y, label.width, label.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(label.name, label.x + label.padding, label.y + label.padding);
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
jRelationship('#canvas', labels, lines, {
    fontSize: 18
});