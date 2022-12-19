import {  usePlot, usePlotOptions } from './hooks'
import { Dashboard } from './dashboard'



const Plot = (props) => {

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
            <div id="graph" style={{
                width: "100%",
                height: "100%",
            }}></div>
        </div>
    )
}

const PlotDispatcher = () => {
    
    const options = usePlotOptions();
    usePlot(options)

    const headerParams = options.header 
        ? options.params
        : null

    return <Plot parameters={headerParams}/>
    
}

export default PlotDispatcher