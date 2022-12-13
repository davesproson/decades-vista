
import {  usePlot } from './hooks'



const Plot = () => {

    usePlot()

    return (
        <div id="graph" style={
            {"top": "0px", "bottom": "0px", "left": "0px", "right": "0px", "backgroundColor": "gray", "position": "absolute"}
        }></div>
    )
}

export { Plot }