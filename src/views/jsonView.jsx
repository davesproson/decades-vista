import {cfg} from '../jsontest'


const UrlView = (props) => {
    return (
        <iframe src={props.url} frameBorder="0" scrolling="no"
             style={{border: "none", overflow: "hidden", width: "100%", height: "100%"}}/>
            
    )
}

const _View = (props) => {

    const elements = props.elements

    const style = {
        display: "grid",
        gridTemplateRows: props.rowPercent.map(x=>`${x}%`).join(" "),
        gridTemplateColumns: props.columnPercent.map(x=>`${x}%`).join(" "),
        width: props.top ? "100vw" : "100cw",
        height: props.top ? "100vh" : "100ch"
    }

    const bgcolor = i => {
        const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink']
        return "white"; colors[i % colors.length]
    }

    return (
        <div style={style}>
            {elements.map((element, i) => {
                const Element = getElement.get(element.type) 
                return (
                    <div key={i} style={{backgroundColor: bgcolor(i), display: "grid"}}>
                        <Element  {...element} />
                    </div>
                )
            })}
        </div>
    )
}

import PlotDispatcher  from '../plot/plot'
import Dashboard  from '../dashboard/dashboard'
import AlarmList from '../alarms/alarm'

const getElement = new Map([
    ['plot', PlotDispatcher],
    ['view', _View],
    ['dashboard', (props) => Dashboard({...props, useURL: false})],
    ['url', UrlView],
    ['alarms', AlarmList]
])

const JsonView = () => {
    return <_View {...cfg} top={true} />
}

export default JsonView