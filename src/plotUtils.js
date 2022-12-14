import Plotly from 'plotly.js-dist'

const paramFromRawName = (rawName, parameters) => {
    return parameters.find(x => x.ParameterName === rawName)
}

const nowSecs = () => {
    return Math.floor(new Date().getTime() / 1000)
}

const updatePlot = (options, data) => {

    const timeMap = (data) => {
        return options.ordvar == 'utc_time' ? data * 1000 : data
    }

    const badDataMap = (data) => {
        return data == -999.99 ? null : data
    }

    let yData = []
    let xData = []
    for(const param of options.params) {
        yData.push(data[param].map(badDataMap))
        xData.push(data[options.ordvar].map(badDataMap).map(timeMap))
    }

    if(options.swapxy) {
        const temp = xData
        xData = yData
        yData = temp
    }
    
    Plotly.extendTraces('graph', {
        y: yData, x: xData
    }, [...Array(yData.length).keys()])
}

function getYAxis(options, param) {
    for(let i=0; i<options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split(",")
        if(paramsOnAxis.includes(param)) {
            return i ? 'y' + (i+1) : 'y'
        }
    }
}

const getData = (options, start, end) => {
    let url = `http://192.168.101.108/livedata?frm=${start}&to=${end}`
    for (const para of options.params) {
        url += `&para=${para}`
    }
    url += `&para=${options.ordvar}`

    let newStart = start;

    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                updatePlot(options, data)
                newStart = data.utc_time[data.utc_time.length-1] + 1
                
                setTimeout(() => {
                    getData(options, newStart, nowSecs())
                }, 1000)      
            }).catch(e => {
                console.log('Error fetching data', e)
                setTimeout(() => {
                    getData(options, newStart, nowSecs())
                }, 1000)   
            })
    } catch(e) {
        setTimeout(() => {
            getData(options, newStart, nowSecs())
        }, 1000) 
    }

}

export { getData, paramFromRawName, getYAxis }