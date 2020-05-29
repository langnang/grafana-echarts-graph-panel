"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var randomColor;
    return {
        setters: [],
        execute: function () {
            _export("randomColor", randomColor = function randomColor() {
                var color = "#";
                var str = "0123456789ABCDEF";
                for (var i = 0; i < 6; i++) {
                    var random = parseInt(Math.random() * str.length);
                    color += str.charAt(random);
                }
                return color;
            });

            _export("randomColor", randomColor);
        }
    };
});
//# sourceMappingURL=randomColor.js.map
