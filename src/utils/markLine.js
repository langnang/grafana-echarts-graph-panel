export const markLine = (list, opts) => {
    let markLine = {
        silent: true,
        symbol: ['none', 'none'],
        precision: opts.precision,
        lineStyle: {
            normal: {
                type: "solid"
            }
        },
        itemStyle: {
            normal: {
                label: {
                    formatter: opts.formatter
                },
            }
        },
        data: [],

    }
    // console.log(type, list);
    if (list.length === 1) {
        markLine.data.push({
            type: opts.type,
        })
    } else {
        let avgArray = [];
        list.forEach(v => {
            avgArray = [...avgArray, ...v.data];
        })
        // console.log(avgArray);
        const avg = avgArray.reduce((acc, val) => acc + val, 0) / (avgArray.length || 1);
        // console.log(avg);

        markLine.data.push({
            yAxis: avg
        })
    }

    list[0].markLine = markLine;
    return list;
}