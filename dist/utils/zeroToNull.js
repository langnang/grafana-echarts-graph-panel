"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var zeroToNull;
    return {
        setters: [],
        execute: function () {
            _export("zeroToNull", zeroToNull = function zeroToNull() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                args.forEach(function (v, k) {
                    v === 0 ? args[k] = null : null;
                });
                return args;
            });

            _export("zeroToNull", zeroToNull);
        }
    };
});
//# sourceMappingURL=zeroToNull.js.map
