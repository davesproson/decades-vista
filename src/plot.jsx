import {  usePlot } from './hooks'

const Plot = () => {
    
    usePlot()

    return (
        <div id="graph" style={
            {"top": "0px", "bottom": "0px", "left": "0px", "right": "0px", "position": "absolute"}
        }></div>
    )
    
}

export default Plot 