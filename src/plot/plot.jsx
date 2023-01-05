import { useRef } from 'react'
import { forwardRef } from 'react'
import {  usePlot, usePlotOptions } from './hooks'
import { Dashboard } from '../dashboard/dashboard'



const Plot = forwardRef((props, ref) => {

    const dash = props.parameters
        ? <Dashboard parameters={props.parameters} />
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
            }}></div>
        </div>
    )
})

const PlotDispatcher = () => {
    
    const ref = useRef(null)
    const options = usePlotOptions();
    usePlot(options, ref)

    const headerParams = options.header 
        ? options.params
        : null

    return <Plot ref={ref} parameters={headerParams}/>
    
}

export default PlotDispatcher