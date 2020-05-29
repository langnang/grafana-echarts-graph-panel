"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var to_date, time_interval, to_utt_date, weekofYear, date_diff_compare;
    return {
        setters: [],
        execute: function () {
            _export("to_date", to_date = function to_date(date, fm) {
                if (!fm) {
                    return date;
                }
                fm = fm.replace("YYYY", date.getFullYear());
                fm = fm.replace("YY", ('' + date.getFullYear()).slice(-2));

                fm = fm.replace("MM", ('0' + (date.getMonth() + 1)).slice(-2));
                fm = fm.replace("M", date.getMonth() + 1);

                fm = fm.replace("WW", ('0' + weekofYear(date)).slice(-2));
                fm = fm.replace("W", weekofYear(date));

                fm = fm.replace("DD", ('0' + date.getDate()).slice(-2));
                fm = fm.replace("D", date.getDate());

                fm = fm.replace("dd", '0' + (date.getDay() == 0 ? 7 : date.getDay()));
                fm = fm.replace("d", date.getDay() == 0 ? 7 : date.getDay());

                fm = fm.replace("hh:24", ('0' + date.getHours()).slice(-2));
                fm = fm.replace("h:24", date.getHours());

                fm = fm.replace("hh:12", date.getHours() < 12 ? ('0' + date.getHours()).slice(-2) : ('0' + (date.getHours() - 12)).slice(-2));
                fm = fm.replace("h:12", date.getHours() < 11 ? date.getHours() : date.getHours() - 12);

                fm = fm.replace("mm", ('0' + date.getMinutes()).slice(-2));
                fm = fm.replace("m", date.getMinutes());

                fm = fm.replace("ss", ('0' + date.getSeconds()).slice(-2));
                fm = fm.replace("s", date.getSeconds());
                return fm;
            });

            _export("to_date", to_date);

            _export("time_interval", time_interval = function time_interval(fm, date) {

                var base = 1000;
                var interval = 0;
                var _date = new Date(date);
                if (fm.indexOf("YYYY") > -1) {
                    _date.setDate(1);
                    _date.setFullYear(_date.getFullYear() + 1);
                    interval = _date.getTime() - date;
                }
                if (fm.indexOf("MM") > -1) {
                    _date.setDate(1);
                    _date.setMonth(_date.getMonth() + 1);
                    interval = _date.getTime() - date;
                }
                if (fm.indexOf("WW") > -1) {
                    var weekday = _date.getDay() || 7;
                    interval = base * 60 * 60 * 24 * (7 + 1 - weekday);
                }
                if (fm.indexOf("DD") > -1) {
                    interval = base * 60 * 60 * 24;
                }
                if (fm.indexOf("hh") > -1) {
                    interval = base * 60 * 60;
                }
                if (fm.indexOf("mm") > -1) {
                    interval = base * 60;
                }
                if (fm.indexOf("ss") > -1) {
                    interval = base * 1;
                }

                return interval;
            });

            _export("time_interval", time_interval);

            _export("to_utt_date", to_utt_date = function to_utt_date(start, end, fm) {
                console.log(start);
                console.log(end);
                console.log(fm);
            });

            _export("to_utt_date", to_utt_date);

            _export("weekofYear", weekofYear = function weekofYear(date) {
                var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                var firstDayOfWeekForYear = firstDayOfYear.getDay();
                var fridayOfSecondWeek = new Date(date.getFullYear(), 0, 7 + 2 - firstDayOfWeekForYear);
                var w = Math.ceil(Math.ceil((date.valueOf() - fridayOfSecondWeek.valueOf()) / 86400000) / 7) + 1;
                return w;
            });

            _export("weekofYear", weekofYear);

            _export("date_diff_compare", date_diff_compare = function date_diff_compare(base, comp) {
                for (var _b in base) {
                    while (base[_b] < comp[_b][1]) {
                        comp.splice(_b, 0, [null, base[_b]]);
                    }
                }
            });

            _export("date_diff_compare", date_diff_compare);
        }
    };
});
//# sourceMappingURL=to_date.js.map
