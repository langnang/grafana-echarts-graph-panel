export const xAxis = (format, list) => {
    let x = [];
    switch (format) {
        case "Year":
            return ['1/1', '2/1', '3/1', '4/1', '5/1', '6/1', '7/1', '8/1', '9/1', '10/1', '11/1', '12/1'];
        case "Month":
            return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        case "Week":
            return ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        case "Day":
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        case "Custom-Year":
            for (var k in list[0].datapoints) {
                x.push(new Date(list[0].datapoints[k][1]).getFullYear());
            }
            return x;
        case "Custom-Month":
            for (var k in list[0].datapoints) {
                x.push(new Date(list[0].datapoints[k][1]).getFullYear() + "-" + (new Date(list[0].datapoints[k][1]).getMonth() + 1));
            }
            return x;
        case "Custom-FullMonth":
            for (var s in list) {
                var year = new Date(list[s].datapoints[0][1]).getFullYear();
                var mon = new Date(list[s].datapoints[0][1]).getMonth();
                if (mon !== 0) {
                    for (var n = mon - 1; n >= 0; n--) {
                        list[s].datapoints.unshift([0, new Date(year + '/' + (n + 1) + '/1').getTime()]);
                    }
                } else {

                }
                if (list[s].datapoints.length < 12) {
                    var len = list[s].datapoints.length;
                    for (var n2 = len; n2 < 12; n2++) {
                        list[s].datapoints.push([0, new Date(year + '/' + (n2 + 1) + '/1').getTime()]);
                    }
                }
            }

            for (var t in list[0].datapoints) {
                x.push(new Date(list[0].datapoints[t][1]).getFullYear() + "-" + (new Date(list[0].datapoints[t][1]).getMonth() + 1));
            }
            return x;
        default:
            return false;
    }

}