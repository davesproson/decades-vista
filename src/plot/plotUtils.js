import { serverProtocol, apiEndpoints, badData } from '../settings'


/**
 * Get the parameter object from the parameters list by the raw name
 * 
 * @param {string} rawName - The name of the parameter as it appears calculations library
 * @param {Array} parameters - The list of parameters from the server
 * @returns {Object} - The parameter object from the parameters list
 */
const paramFromRawName = (rawName, parameters) => {
    return parameters.find(x => x.ParameterName === rawName)
}

/**
 * Get the current time in seconds
 * 
 * @returns {number} - The current time in seconds
 */
const nowSecs = () => {
    return Math.floor(new Date().getTime() / 1000)
}

/**
 * Get the start and end times for a given time frame
 * 
 * @param {string} tf - The time frame to get the start and end times for
 * @returns {Array} - The start and end times for the time frame
 */
const getTimeLims = (tf) => {

    if(tf.includes(",")) {
        const times = tf.split(",")
        let startTime = parseInt(times[0])
        let endTime
        try {
            endTime = parseInt(times[1])
        } catch {
            endTime = nowSecs()
        }
        return [startTime, endTime]
    }

    const end = nowSecs()

    if (tf === 'all') {
        return [0, end]
    }
    
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

/**
 * Parses plot options to decide if the plot is ongoing (i.e. should be updated)
 * 
 * @param {Object} options
 * @param {string} options.timeframe - The timeframe of the plot 
 * @returns {boolean} - Whether the plot is ongoing
 */
const plotIsOngoing = (options) => {
    const custom = options.timeframe.includes(',') 
    const customOngoing = custom && options.timeframe.split(',')[1] === ''
    const defined = !custom
    return customOngoing || defined
}

/**
 * Parses plot options to decide if the plot can slide
 * 
 * @param {Object} options
 * @param {string} options.timeframe - The timeframe of the plot
 * @returns {boolean} - Whether the plot can slide
 */
const canSlide = (options) => {
    return !options.timeframe.includes(',') && options.scrolling
}

/**
 * Get the length of the sliding window in seconds
 * 
 * @param {Object} options
 * @param {string} options.timeframe - The timeframe of the plot
 * @returns {number} - The length of the sliding window in seconds
 */
const slideLength = (options) => {
    let tf = options.timeframe
    let multiplier = 1
    if(tf.includes('h')) {
        multiplier = 60 * 60
    }
    if(tf.includes('m')) {
        multiplier = 60
    }

    tf = tf.replace(/[a-zA-Z]+/, '')

    return tf * multiplier
}

/**
 * Update the plot with new data
 * 
 * @param {Object} options - The plot options object
 * @param {Object} data - The data to plot
 * @param {Object} ref - The react ref to the plot
 * @returns {void}
 */
const updatePlot = (options, data, ref) => {

    // Map utc_time to milliseconds
    const timeMap = (data) => {
        return options.ordvar == 'utc_time' ? data * 1000 : data
    }

    // Map bad data to null
    const badDataMap = (data) => {
        return data == badData ? null : data
    }

    let yData = []
    let xData = []
    // Filter out bad data. It's not totally clear that this is the best option,
    // but leaving missing data in the plot causes issues with data < 1 Hz, or
    // data with regular gaps, e.g. the GIN data reformatted by the prtaft DLU.
    for(const param of options.params) {
        const paramIsBad = data[param].map(x => x === badData)
        const ordVarIsBad = data[options.ordvar].map(x => x === badData)

        const isBad = paramIsBad.map((x, i) => x || ordVarIsBad[i])

        yData.push(data[param].filter((x, i) => !isBad[i]))
        xData.push(data[options.ordvar].filter((x, i) => !isBad[i]).map(timeMap))
        
    }

    if(options.swapxy) {
        const temp = xData
        xData = yData
        yData = temp
    }

    const maxTraceLength = canSlide(options) ? slideLength(options) : null
    
    import('plotly.js-dist').then(Plotly => {
        Plotly.extendTraces(ref.current, {
            y: yData, x: xData
        }, [...Array(yData.length).keys()], maxTraceLength)
    })
}

/**
 * Get the y axis for a given parameter, as referred to by plotly,
 * i.e. y or y2 etc.
 * 
 * @param {Object} options - The plot options object
 * @param {string} param - The parameter to get the y axis for
 * @returns {string} - The y axis for the parameter
 */
function getYAxis(options, param) {
    for(let i=0; i<options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split(",")
        if(paramsOnAxis.includes(param)) {
            return i ? 'y' + (i+1) : 'y'
        }
    }
}

/**
 * Get the x axis for a given parameter, as referred to by plotly,
 * i.e. x or x2 etc.
 * 
 * @param {Object} options - The plot options object
 * @param {string} param - The parameter to get the x axis for
 * @returns {string} - The x axis for the parameter
 */
function getXAxis(options, param) {
    for(let i=0; i<options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split(",")
        if(paramsOnAxis.includes(param)) {
            return i ? 'x' + (i+1) : 'x'
        }
    }
}

/**
 * Get the data url for a given set of options and start and end times
 * 
 * @param {Object} options - The plot options object
 * @param {number} start - The start time
 * @param {number} end - The end time
 * @returns {string} - The data url
 */
const getDataUrl = (options, start, end) => {
    const server = options.server ? options.server : location.host
    let url = `${serverProtocol}://${server}${apiEndpoints.data}`

    // Allow the endpoint to include a query string
    if(url.includes('?')) {
        url += `&frm=${start}`
    } else {
        url += `?frm=${start}`
    }

    // If the end time is defined, add it to the url
    if(end) {
        url += `&to=${end}`
    }

    for (const para of options.params) {
        url += `&para=${para}`
    }

    if(options.ordvar) {
        url += `&para=${options.ordvar}`
    }

    return url
}

/**
 * Start fetching data from the server. This function will call itself
 * recursively to fetch data every second. This is done to avoid overloading
 * the server with requests if it is slow to respond.
 * 
 * @param {Object} options - The plot options object
 * @param {number} start - The start time
 * @param {number} end - The end time
 * @param {function} callback - The callback to call when data is fetched
 * @param {Object} ref - The react ref to the plot
 * @param {Object} signal - The signal object to abort the data fetch
 * @returns {void}
 */
const startData = ({options, start, end, callback, ref, signal}) => {

    if(!callback) callback = updatePlot

    const url = getDataUrl(options, start, end)

    if(signal.abort) {
        console.log('Aborting data fetch due to signal') 
        return
    }

    const callOpts = {options: options, callback: callback, ref: ref, signal: signal}

    let newStart = start;

    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                callback(options, data, ref)
                
                newStart = data.utc_time[data.utc_time.length-1] + 1 || start
                
                setTimeout(() => {
                    startData({...callOpts, start: newStart})
                }, 1000)      
            }).catch(e => {
                console.log('Error fetching data', e)
                setTimeout(() => {
                    startData({...callOpts, start: newStart})
                }, 1000)   
            })
    } catch(e) {
        setTimeout(() => {
            startData({...callOpts, start: newStart})
        }, 1000) 
    }
}

/**
 * Get data from the server
 * 
 * @param {Object} options - The plot options object
 * @param {number} start - The start time
 * @param {number} end - The end time
 *
 * @returns {Promise} - A promise that resolves to the data
 */
const getData = async (options, start, end) => {

    if(!start) start = nowSecs() - 5

    const url = getDataUrl(options, start, end)

    return fetch(url).then(response => response.json())

}

/**
 * Build an axis array reprensenting the axes and parameters
 * 
 * @param {*} vars - The redux parametersSlice
 * @returns {Array} - An array of the axes, with each axis being a comma separated list of parameters
 */
const getAxesArray = (vars) => {
    const params = vars.params
    let axes = {}
    for(const ax of vars.axes) {
        axes[ax.id] = []
    }

    for(const param of params.filter(x=>x.selected)) {
        axes[param.axisId].push(param.raw)
    }

    axes = Object.values(axes).map(x=>x.join(','))
    return axes
}

export { 
    getData, startData, paramFromRawName, getYAxis, getXAxis, getTimeLims, updatePlot,
    plotIsOngoing, getAxesArray
}
