import noscroll from "../../assets/css/no-scroll.css"

import { useRef, forwardRef } from 'react'
import { usePlot, usePlotOptions } from './hooks'
import { Dashboard } from '../dashboard/dashboard'
import { plotHeaderDefaults } from '../settings'
import { Loader } from '../components/loader'

/**
 * A plot component. This component provides a single decades plot, potentially
 * combined with a dashboard if a 'plot header' is requested.
 * 
 * @param {Object} props
 * @param {Object} props.style - The style for the plot
 * @param {boolean} props.loadDone - Whether the plot has finished loading
 * @param {Object[]} props.parameters - The parameters to display in the plot header
 * @param {Object} ref - The ref for the plot
 * 
 * @returns {JSX.Element}
 */
const Plot = forwardRef((props, ref) => {

    // If the plot hasn't finished loading, display a loader
    const load = props.loadDone ? null : <Loader text="Loading plot..." />

    // Create a dashboard if requested
    const dash = props.parameters
        ? <Dashboard parameters={Array(...new Set([...props.parameters, ...plotHeaderDefaults]))} />
        : null

    // Set the style, defaulting to filling the parent container
    const style = props.style || {     
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",  
        position: "absolute",
        display: "flex",
        flexDirection: "column",  
    }

    // Return the plot and optionally the dashboard
    return (
        <div style={style}>
            {dash}
            <div ref={ref} style={{
                width: "100%",
                height: "100%",
            }}>{load}</div>
        </div>
    )
})

/**
 * A simple plot component. This component provides a single decades plot,
 * with no plot header, intended for components where a quick 'n' dirty plot
 * is required.
 * 
 * @param {Object} props
 * @param {Object} props.style - The style for the plot
 * @param {Object} props.params - The parameters to display in the plot
 * 
 * @returns {JSX.Element}
 */
const SimplePlot = (props) => {
    const ref = useRef(null)

    const options = {
        params: props.params,
        axes: props.params,
        swapxy: false,
        ordvar: "utc_time",
        timeframe: "5min",
        scrolling: true,
    }

    usePlot(options, ref)

    const style = props.style ? props.style : {
        height: "100%",
        width: "100%",
        position: "relative",
    }

    return (
        <div ref={ref} style={style}></div>
    )
}

/**
 * A plot dispatcher component - deals with parsing the plot options and
 * passing them to the plot component.
 * 
 * @param {Object} props
 * @param {Object} props.style - The style for the plot
 * @param {Object} props.params - The parameters to display in the plot
 * 
 * @returns {JSX.Element}
 */
const PlotDispatcher = (props) => {
    
    const ref = useRef(null)
    const options = usePlotOptions(props);
    const loadDone = usePlot(options, ref)

    const headerParams = options.header 
        ? options.params
        : null

    return <Plot ref={ref} parameters={headerParams} loadDone={loadDone} style={props.style}/>
    
}

export default PlotDispatcher
export { SimplePlot, Plot }