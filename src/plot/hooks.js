import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useGetParameters, useServers } from '../hooks';
import { base as siteBase } from '../settings';
import { startData, paramFromRawName, getYAxis, getXAxis, 
         getTimeLims, plotIsOngoing, getAxesArray } from './plotUtils';


const darkBg = "#333333"
const darkMode = false

const getUrl = (options) => {
    
    const axisStrings = options.axes.map(x=>[].concat(x).join(','))

    let axisArgs = ""
    for(const axStr of axisStrings) {
        axisArgs += `&axis=${axStr}`
    }

    const url = `${siteBase}plot?`
                + "timeframe=" + options.timeframe
                + "&params=" + options.params.join(',')
                + axisArgs
                + "&swapxy=" + options.swapOrientation
                + "&scrolling=" + options.scrollingWindow
                + "&data_header=" + options.dataHeader
                + "&style=" + options.plotStyle
                + "&ordvar=" + options.ordinateAxis
                + "&server=" + options.server
    return url
}

const usePlotUrl = (override={}) => {
    const [plotUrl, setPlotUrl] = useState("");

    const plotOptions = useSelector(state => state.options);
    const axisOptions = useSelector(state => state.vars.axes);
    const vars = useSelector(state => state.vars);
    const server = useSelector(state => state.options.server);
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);

    const overridden = (key, par) => override[key] ? override[key] : par

    let timeframe = ""
    if(useCustomTimeframe) {
        const start = plotOptions.customTimeframe.start / 1000
        const end = plotOptions.customTimeframe.end ? plotOptions.customTimeframe.end / 1000 : ""
        timeframe = `${start},${end}`
    } else {
        timeframe = plotOptions.timeframes.find(x=>x.selected).value;
    }

    const params = vars.params
    let axes = getAxesArray(vars)

    const selectedParams = params.filter(param => param.selected)
                                 .map(param => param.raw)


    useEffect(() => {
        const optionSet = {
            timeframe: overridden("timeframe", timeframe),
            params: overridden("selectedParams", selectedParams),
            swapOrientation: overridden("swapxy", plotOptions.swapOrientation),
            scrollingWindow: overridden("scrolling", plotOptions.scrollingWindow),
            dataHeader: overridden("data_header", plotOptions.dataHeader),
            plotStyle: overridden("style", plotOptions.plotStyle.value),
            ordinateAxis: overridden("ordvar", plotOptions.ordinateAxis),
            server: overridden("server", server),
            axes: overridden("axes", axes)
        }

        setPlotUrl(getUrl(optionSet))

    }, [plotOptions, params, axisOptions])

    return plotUrl;
}

const usePlot = (options, ref) => {
    
    const params = useGetParameters();
    const servers = useServers()
    const [server, setServer] = useState(options.server)
    const [initDone, setInitDone] = useState(false)
    const [loadDone, setLoadDone] = useState(false)
    console.log(options)
    
    useEffect(() => {
        
        if(!initDone) return
        const signal = {abort: false}

        const [start, end] = getTimeLims(options.timeframe)

        startData({options: options, start: start, end: end, ref: ref, signal: signal})

        if(!plotIsOngoing(options)) signal.abort = true
        return () => signal.abort = true
 
    }, [initDone])

    useEffect(() => {
        if(server) return
        const rServer = servers.sort(() => .5 - Math.random())[0]
        setServer(rServer)
    }, [setServer, server, servers])

    useEffect(() => {
    
        if(!params) return
        if(!server) return

        const numAxes = options.axes.length;

        const layout = {
            showlegend: true,
            plot_bgcolor: darkMode ? darkBg : "white",
            paper_bgcolor: darkMode ? darkBg : "white",
            font: {
                color: darkMode ? "white" : "black"
            },
            legend: {
                font: {
                    size: 8,
                    color: darkMode ? "white" : "black"
                },
                bgcolor: darkMode ? darkBg : "white",
                // This is dispicable, sorry future me
                x: options.swapxy 
                    ? 0 
                    : numAxes > 2 
                        ? 0.05 
                        : 0,
                y: options.swapxy 
                    ? numAxes > 2 
                        ? .95 
                        : 1 
                    : 1
            },
            margin: {
                t: 50
            },
            modebar: {
                remove: ["sendDataToCloud", "lasso", "lasso2d", "select", "select2d", "zoom", "pan",
                         "zoomIn2d", "zoomOut2d", "autoScale2d",
                         "hoverClosestCartesian"]
            }
        }

        const offsetStart = numAxes > 2 ? 0.05 : 0;
        const offsetEnd = numAxes > 3 ? 0.05 : 0;

        var _ordAxis = options.swapxy ? "yaxis" : "xaxis";

        // This is to box the plot
        layout[_ordAxis] = {
            linecolor: "black",
            mirror: true,
            domain: [offsetStart, 1-offsetEnd],
        }

        // Set the title of the ordinate axis, and set the date attribute if 
        // we're plotting a timeseries
        if(options.ordvar.includes('utc_time')) {
            layout[_ordAxis].type = "date";
            layout[_ordAxis].title = "Time (UTC)";
        } else {
            const ordParam = paramFromRawName(options.ordvar, params)
            layout[_ordAxis].title = `${ordParam.DisplayText} (${ordParam.DisplayUnits})`;
        }

        layout[_ordAxis].linecolor = darkBg ? "gray" : "black";
        if(darkMode) layout[_ordAxis].gridcolor = "gray";

        const ranges = options.axes.map((axis) => {
            let rangeString = axis.split("|")[1]
            if(rangeString) {
                rangeString = rangeString.split(":")
                return [rangeString[0], rangeString[1]]
            }
            return null
        })

        for(let i=0; i<numAxes; i++) {
            let _axisTitle;
    
            let currentAxes = options.axes[i].split("|")[0]

            // If there's more than one variable on a axis, label axis, axis2 etc.
            // Otherwise we can label with the DisplayName / DisplayUnits
            if(currentAxes.split(",").length > 1) {
                let _unit = paramFromRawName(currentAxes.split(",")[0], params)?.DisplayUnits || "Unknown units"
                _axisTitle = options.swapxy ? `X-axis ${i+1} (${_unit})` : `Y-axis ${i+1} (${_unit})`;
            } else {
                const _param = paramFromRawName(currentAxes, params)
                _axisTitle = `${_param?.DisplayText || 'y-axis'} (${_param?.DisplayUnits || 'Unknown units'})`;
            }
    
            let _axisName = options.swapxy ? "xaxis" : "yaxis";
    
            // We add coordinate axes alternatively to the left and right, or bottom and
            // top is swapAxes is true.
            let _side = i % 2 ? (options.swapxy ? "top" : "right") : (options.swapxy ? "bottom" : "left");
            let _overlaying = null;

            let anchor = i > 1 
                ? "free" 
                : options.swapxy ? "y" : "x";

            if(i) {
                _axisName += (i+1);
                _overlaying = options.swapxy ? "x" : "y"
            }

            let position = anchor == "free"
                ? (i == 2 ? 0 : 1)
                : null;
    
            // Add the current axis to the layout.
            layout[_axisName] = {
                title: _axisTitle,
                titlefont: {
                    size: 10,
                },
                side: _side,
                overlaying: _overlaying,
                anchor: anchor,
                position: position,
                linecolor: darkMode ? "gray" : "black",
                gridcolor: darkMode ? "gray" : "lightgray",
                mirror: true
            }

            if(ranges[i]) {
                layout[_axisName].range = ranges[i]
            }

        }

        const traces = [];
        for(var i=0; i<options.params.length; i++) {
            var opts = {
                type: options.style,
                name: paramFromRawName(options.params[i], params)?.DisplayText || options.params[i],
                x: [],
                y: [],
                yaxis: options.swapxy ? 'y' : getYAxis(options, options.params[i]),
                xaxis: options.swapxy ? getXAxis(options, options.params[i]) : 'x',
                line: {}
            }
            
            if(options.style == "scatter") {
                opts.mode = "markers";
            } else {
                opts.mode = "lines";
            }

            try {
                const paramName = paramFromRawName(options.params[i], params).DisplayText
                if(paramName.toLowerCase().includes('red')) opts.line.color = '#DD0000';
                if(paramName.toLowerCase().includes('green')) opts.line.color = '#00DD00';
                if(paramName.toLowerCase().includes('blue')) opts.line.color = '#0000DD';
            } catch(e) {}

            traces.push(opts);
        }

        const config = {
            responsive: true,
            displaylogo: false,
            modeBarButtonsToAdd: [
                {
                    name: "Download data",
                    icon: null,
                    click: () => {
                        const _data = traces.map(t => {
                            return {
                                x: t.x,
                                y: t.y,
                                name: t.name
                            }
                        })
                        const data = {
                            ordinate: layout[_ordAxis].title.text,
                            ordinateAxis: options.swapxy ? "y" : "x",
                            traces: _data
                        }
                        const element = document.createElement("a");
                        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
                        element.setAttribute('download', "plot-data.json");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    }
                },
                {
                    name: "Clear plot",
                    icon: null,
                    click: () => {
                        for(let t of traces) {
                            t.x = [t.x[t.x.length-1]];
                            t.y = [t.y[t.y.length-1]];
                        }
                    }
                } 
            ]
        }
        
        import('plotly.js-dist').then(Plotly => {
            setLoadDone(true);
            config.modeBarButtonsToAdd[0].icon = Plotly.Icons.disk;
            config.modeBarButtonsToAdd[1].icon = Plotly.Icons.eraseshape;
            Plotly.newPlot(ref.current, traces, layout, config)
                .then(setInitDone(true))
        })

    }, [params, server, setInitDone, setLoadDone])

    return loadDone
}

const usePlotOptions = (props) => {
    const [searchParams, _] = useSearchParams();

    return {
        params: props.params || searchParams.get("params").split(","),
        axes: props.axes || searchParams.getAll("axis"),
        timeframe: props.timeframe || searchParams.get("timeframe"),
        swapxy: props.swapxy || searchParams.get("swapxy") === "true",
        scrolling: props.scrolling || searchParams.get("scrolling") === "true",
        style: props.plotStyle || searchParams.get("style"),
        header: props.data_header || searchParams.get("data_header") === "true",
        ordvar: props.ordvar || searchParams.get("ordvar"),
        server: props.server || searchParams.get("server") || location.host
    }
}

export { usePlot, usePlotUrl, usePlotOptions, getUrl }