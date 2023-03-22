import { VistaErrorBoundary } from '../components/error'

const UrlView = (props) => {
    return (
        <iframe src={props.url} frameBorder="0" scrolling="no"
             style={{border: "none", overflow: "hidden", width: "100%", height: "100%"}}/>
            
    )
}

const _View = (props) => {

    const elements = props.elements

    const getRowColPercent = (i) => {
        try {
            return props[i].map(x=>`${x}%`).join(" ")
        } catch (e) {
            return "100%"
        }
    }

    const style = {
        display: "grid",
        gridTemplateRows: getRowColPercent("rowPercent"),
        gridTemplateColumns: getRowColPercent("columnPercent"),
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

const JsonView = (props) => {
    const cfg = props.cfg || JSON.parse(localStorage.getItem('viewConfig'))
    console.log(cfg)
    return (
        <VistaErrorBoundary errorMessage={"View may be misconfigured"}>
            <_View {...cfg} top={true} />
        </VistaErrorBoundary>
    )
}

export default JsonView