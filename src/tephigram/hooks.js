import { useSelector } from "react-redux"
import { base as siteBase } from "../settings"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getData, getTimeLims, plotIsOngoing } from "../plot/plotUtils";
import { getTraces, populateTephigram } from "./utils";
import { useServers, useDarkMode } from "../hooks";
import { getPlotlyTephiOptions, getEmptyDataTrace } from "./plotOptions";

/**
 * Returns the URL for the tephigram page, with the current parameters and
 * timeframe
 * 
 * @returns {string} The URL for the tephigram page
 */
const useTephiUrl = () => {
    const params = useSelector(state => state.vars.params);
    const plotOptions = useSelector(state => state.options);
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);

    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const server = plotOptions.server
    
    let timeframe = ""
    if(useCustomTimeframe) {
        // Erm... TODO?
    } else {
        timeframe = plotOptions.timeframes.find(x=>x.selected).value;
    }
    
    const url = new URL(`${origin}${siteBase}tephigram`)
    url.searchParams.set('params', selectedParams.join(','))
    url.searchParams.set('timeframe', timeframe)
    url.searchParams.set('server', server)
    return url.toString()
}

/**
 * Returns true if the currently selected parameters are sufficient to plot a
 * tephigram
 * 
 * @returns {boolean} True if the currently selected parameters are sufficient
 * to plot a tephigram
 */
const useTephiAvailable = () => {
    
    const params = useSelector(state => state.vars.params);
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    
    let has_required_temps = false
    let has_required_humids = false
    
    const required_temps = [
        'deiced_true_air_temp_c', 'nondeiced_true_air_temp_c'
    ]

    const required_humids = [
        'dew_point', 'buck_mirror_temp'
    ]

    for(const param of selectedParams) {
        if(!required_humids.includes(param) && !required_temps.includes(param)) {
            return false
        }
        if(required_temps.includes(param)) {
            has_required_temps = true
        }
        if(required_humids.includes(param)) {
            has_required_humids = true
        }
    }

    return has_required_temps && has_required_humids
}

/**
 * Creates a tephigram plot in the given ref
 * 
 * @param {React.Ref} ref The ref to create the plot in
 */
const useTephigram = (ref) => {

    const [searchParams, _] = useSearchParams();

    const timeframe = searchParams.get('timeframe') || '30min'
    const params = searchParams.get('params') || 'deiced_true_air_temp_c,dew_point'
    const paramsArray = params.split(',')
    const servers = useServers()
    const [server, setServer] = useState(null)
    const [darkMode, setDarkMode] = useDarkMode()

    /**
     * Set the server to a random one from the list of available servers
     * 
     * Watched variables:
     * - servers
     * - server
     */
    useEffect(() => {
        if(server) return
        const rServer = servers.sort(() => .5 - Math.random())[0]
        setServer(rServer)
    }, [setServer, server, servers])

    /**
     * Create the plot in the given ref once the server is set
     *
     * Watched variables:
     * - server
     */
    useEffect(() => {
        if(!server) return

        const options = {
            timeframe: timeframe,
            params: paramsArray,
            ordvar: 'static_pressure',
            server: server
        }

        // Get the tephi traces
        let plotTraces = getTraces(darkMode)

        // Record how much crap we've got on the axes
        const n = plotTraces.length;

        // Whack on empty traces for the parameters
        options.params.forEach((p, i) => {
            plotTraces.push(getEmptyDataTrace(p, i));
        });

        // Async import of plotly.js and initisation of plot
        import('plotly.js-dist').then((Plotly) => {
            Plotly.newPlot(
                ref.current, plotTraces, 
                ...getPlotlyTephiOptions(darkMode)
            )
        });

        // Populate plot with data
        getData(options, ...getTimeLims(options.timeframe))
            .then(data=>populateTephigram(n, data, ref))
            
        // Update plot with new data <=> the plot is ongoing and the page is visible
        // at 1 second intervals
        if(plotIsOngoing(options)) {
            const interval = setInterval(() => {
                if(document.hidden) return
                getData(options).then(data=>populateTephigram(n, data, ref))
            }, 1000);

            return () => clearInterval(interval)
        }

    }, [server])
}

export {
    useTephiUrl, useTephiAvailable, useTephigram
}