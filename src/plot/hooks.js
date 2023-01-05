import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useGetParameters } from '../hooks';
import { base as siteBase } from '../settings';
import { startData, paramFromRawName, getYAxis, getXAxis, getTimeLims, plotIsOngoing } from './plotUtils';


const usePlotUrl = (override={}) => {
    const [plotUrl, setPlotUrl] = useState("");

    const plotOptions = useSelector(state => state.options);
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
    const axes = {}
    for(const ax of vars.axes) {
        axes[ax.id] = []
    }

    for(const param of params.filter(x=>x.selected)) {
        axes[param.axisId].push(param.raw)
    }

    const axisStrings = Object.values(axes).filter(x=>x.length).map(x=>x.join(','))

    const selectedParams = params.filter(param => param.selected)
                                 .map(param => param.raw)


    useEffect(() => {
        let axisArgs = ""
        for(const axStr of axisStrings) {
            axisArgs += `&axis=${axStr}`
        }

        setPlotUrl(
            window.location.origin
            + `${siteBase}plot?`
            + "timeframe=" + overridden("timeframe", timeframe)
            + "&params=" + selectedParams.join(',')
            + axisArgs
            + "&swapxy=" + overridden("swapxy", plotOptions.swapOrientation)
            + "&scrolling=" + overridden("scrolling", plotOptions.scrollingWindow)
            + "&data_header=" + overridden("data_header", plotOptions.dataHeader)
            + "&style=" + overridden("style", plotOptions.plotStyle.value)
            + "&ordvar=" + overridden("ordvar", plotOptions.ordinateAxis)
            + "&server=" + server
        );
    }, [plotOptions, params])

    return plotUrl;
}

const usePlot = (options, ref) => {
    
    const params = useGetParameters();
    const [initDone, setInitDone] = useState(false)
    
    useEffect(() => {
        
        if(!initDone) return
        const signal = {abort: false}
        const [start, end] = getTimeLims(options.timeframe)
        startData({options: options, start: start, end: end, ref: ref, signal: signal})
        if(!plotIsOngoing(options)) signal.abort = true
        return () => signal.abort = true
 
    }, [initDone])

    useEffect(() => {
    
        if(!params) return
        // if(!options) return

        const layout = {
            showlegend: true,
            legend: {
                font: {
                    size: 8,
                },
                x: 0,
                y: 1
            },
            margin: {
                t: 50
            }
        }

        var _ordAxis = options.swapxy ? "yaxis" : "xaxis";

        // This is to box the plot
        layout[_ordAxis] = {
            linecolor: "black",
            mirror: true,
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

        const numAxes = options.axes.length;
        console.log(options)

        for(let i=0; i<numAxes; i++) {
            let _axisTitle;
    
            // If there's more than one variable on a axis, label axis, axis2 etc.
            // Otherwise we can label with the DisplayName / DisplayUnits
            if(options.axes[i].split(",").length > 1) {
                let _unit = paramFromRawName(options.axes[i].split(",")[0], params).DisplayUnits
                _axisTitle = options.swapxy ? `X-axis ${i+1} (${_unit})` : `Y-axis ${i+1} (${_unit})`;
            } else {
                const _param = paramFromRawName(options.axes[i], params)
                _axisTitle = `${_param.DisplayText} (${_param.DisplayUnits})`;
            }
    
            let _axisName = options.swapxy ? "xaxis" : "yaxis";
    
            // We add coordinate axes alternatively to the left and right, or bottom and
            // top is swapAxes is true.
            let _side = i % 2 ? (options.swapxy ? "top" : "right") : (options.swapxy ? "bottom" : "left");
            let _overlaying = null;

            if(i) {
                _axisName += (i+1);
                _overlaying = options.swapxy ? "x" : "y"
            }
    
            // Add the current axis to the layout.
            layout[_axisName] = {
                title: _axisTitle,
                titlefont: {
                    size: 10,
                },
                side: _side,
                overlaying: _overlaying,
                linecolor: "black",
                mirror: true
            }
        }

        const traces = [];
        for(var i=0; i<options.params.length; i++) {
            var opts = {
                type: options.style,
                name: paramFromRawName(options.params[i], params).DisplayText,
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
        
        import('plotly.js-dist').then(Plotly => {
            Plotly.newPlot(ref.current, traces, layout, {responsive: true})
                .then(setInitDone(true))
        })

    }, [params])
}

const usePlotOptions = () => {
    const [searchParams, _] = useSearchParams();

    return {
        params: searchParams.get("params").split(","),
        axes: searchParams.getAll("axis"),
        timeframe: searchParams.get("timeframe"),
        swapxy: searchParams.get("swapxy") === "true",
        scrolling: searchParams.get("scrolling") === "true",
        style: searchParams.get("style"),
        header: searchParams.get("data_header") === "true",
        ordvar: searchParams.get("ordvar"),
        server: searchParams.get("server")
    }
}

export { usePlot, usePlotUrl, usePlotOptions }