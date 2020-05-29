'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var legend;
    return {
        setters: [],
        execute: function () {
            _export('legend', legend = function legend(option) {
                return {
                    legend: {
                        show: false,
                        type: 'plain',
                        left: 'auto',
                        top: 'bottom',
                        align: 'auto',
                        orient: 'horizontal',
                        icon: 'roundRect',
                        data: []
                    }
                };
            });

            _export('legend', legend);
        }
    };
});
//# sourceMappingURL=legend.js.map
