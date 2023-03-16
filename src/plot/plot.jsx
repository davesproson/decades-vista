import { useRef, forwardRef } from 'react'
import { usePlot, usePlotOptions } from './hooks'
import { Dashboard } from '../dashboard/dashboard'
import { plotHeaderDefaults } from '../settings'
import { Loader } from '../components/loader'

const Plot = forwardRef((props, ref) => {

    const load = props.loadDone ? null : <Loader text="Loading plot..." />

    const dash = props.parameters
        ? <Dashboard parameters={Array(...new Set([...props.parameters, ...plotHeaderDefaults]))} />
        : null

    return (
        <div style={{
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",  
            position: "absolute",
            display: "flex",
            flexDirection: "column",
        }}>
            {dash}
            <div ref={ref} style={{
                width: "100%",
                height: "100%",
            }}>{load}</div>
        </div>
    )
})

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
    return (
        <div ref={ref} style={{
            height: "100%",
            width: "100%",
            position: "relative",
        }}></div>
    )
}

const PlotDispatcher = () => {
    
    const ref = useRef(null)
    const options = usePlotOptions();
    const loadDone = usePlot(options, ref)

    const headerParams = options.header 
        ? options.params
        : null

    return <Plot ref={ref} parameters={headerParams} loadDone={loadDone} />
    
}

export default PlotDispatcher
export { SimplePlot }