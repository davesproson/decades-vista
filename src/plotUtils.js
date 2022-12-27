import { serverPrefix, apiEndpoints, badData } from './settings'

import Plotly from 'plotly.js-dist'

const paramFromRawName = (rawName, parameters) => {
    return parameters.find(x => x.ParameterName === rawName)
}

const nowSecs = () => {
    return Math.floor(new Date().getTime() / 1000)
}

const getTimeLims = (tf) => {
    const end = Math.floor(new Date().getTime() / 1000) 
    
    let multiplier = 1
    if(tf.includes('h')) {
        multiplier = 60 * 60
    }
    if(tf.includes('m')) {
        multiplier = 60
    }

    tf = tf.replace(/[a-zA-Z]+/, '')

    const start = end - tf * multiplier

    return [start, end]
}

const updatePlot = (options, data, ref) => {

    const timeMap = (data) => {
        return options.ordvar == 'utc_time' ? data * 1000 : data
    }

    const badDataMap = (data) => {
        return data == badData ? null : data
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
    
    Plotly.extendTraces(ref.current, {
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

const getDataUrl = (options, start, end) => {
    let url = `${serverPrefix}${apiEndpoints.data}`

    // Allow the endpoint to include a query string
    if(url.includes('?')) {
        url += `&frm=${start}&to=${end}`
    } else {
        url += `?frm=${start}&to=${end}`
    }

    for (const para of options.params) {
        url += `&para=${para}`
    }

    if(options.ordvar) {
        url += `&para=${options.ordvar}`
    }

    return url
}

const startData = ({options, start, end, callback, ref}) => {

    if(!callback) callback = updatePlot

    const url = getDataUrl(options, start, end)
    const callOpts = {options: options, callback: callback, ref: ref}

    let newStart = start;

    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                callback(options, data, ref)
                newStart = data.utc_time[data.utc_time.length-1] + 1
                
                setTimeout(() => {
                    startData({...callOpts, start: newStart, end: nowSecs()})
                }, 1000)      
            }).catch(e => {
                console.log('Error fetching data', e)
                setTimeout(() => {
                    startData({...callOpts, start: newStart, end: nowSecs()})
                }, 1000)   
            })
    } catch(e) {
        setTimeout(() => {
            startData({...callOpts, start: newStart, end: nowSecs()})
        }, 1000) 
    }
}

const getData = async (options, start, end) => {

    if(!start) start = nowSecs() - 5
    if(!end) end = nowSecs() - 5

    const url = getDataUrl(options, start, end)

    return fetch(url).then(response => response.json())

}

export { getData, startData, paramFromRawName, getYAxis, getTimeLims, updatePlot }