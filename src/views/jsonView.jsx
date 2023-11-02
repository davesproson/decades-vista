import noscroll from "../../assets/css/no-scroll.css"

import { VistaErrorBoundary } from '../components/error'
import PlotDispatcher  from '../plot/plot'
import Dashboard  from '../dashboard/dashboard'
import Tephigram from '../tephigram/tephigram'
import AlarmList from '../alarms/alarm'
import Timers from '../timers/timer'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { libraryViews } from './libraryEntries'

/**
 * Provides a basic view which just displays a URL in an iframe
 * 
 * @param {Object} props
 * @param {string} props.url - URL to display
 * 
 * @returns {JSX.Element}
 * 
 */
const UrlView = (props) => {
    return (
        <iframe src={props.url} frameBorder="0" scrolling="no"
             style={{border: "none", overflow: "hidden", width: "100%", height: "100%"}}/>
            
    )
}

/**
 * A view wrapper which displays a list of elements in a grid.
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the view
 * @param {Object[]} props.elements - List of elements to display
 * @param {boolean} props.top - indicates whether we're at the top of the view hierarchy
 * 
 * @returns {JSX.Element}
 */
const _View = (props) => {

    /**
     * Set the document title to the view title if we're at the top of the view hierarchy
     */
    useEffect(()=>{
        if(!props.top) return
        document.title = props.title || 'DECADES View'
    }, [])

    // Elements to display
    const elements = props.elements

    // Get the row or column percentages for the grid
    const getRowColPercent = (i) => {
        try {
            return props[i].map(x=>`${x}%`).join(" ")
        } catch (e) {
            return "100%"
        }
    }

    // Style for the grid
    const style = {
        display: "grid",
        gridTemplateRows: getRowColPercent("rowPercent"),
        gridTemplateColumns: getRowColPercent("columnPercent"),
        width: props.top ? "100vw" : null, 
        height: props.top ? "100vh" : null
    }

    return (
        <div style={style}>
            {elements.map((element, i) => {
                const Element = getElement.get(element.type) 
                return (
                    <div key={i} style={{display: "grid"}}>
                        <Element  {...element} />
                    </div>
                )
            })}
        </div>
        
    )

}

// Style for the plot. Defined here because why not. Other than reasons.
const plotStyle = {
    width: "100%",
    height: "100%",
    position: "relative"
}

// Map of element types to the element to display
const getElement = new Map([
    ['plot', (props) => PlotDispatcher({...props, style: plotStyle})],
    ['tephi', (props) => Tephigram({...props, style: plotStyle})],
    ['view', _View],
    ['dashboard', (props) => Dashboard({...props, useURL: false})],
    ['url', UrlView],
    ['alarms', AlarmList],
    ['timers', (props) => Timers(props)]
])

/**
 * A view which displays a JSON view configuration. The configuration can be
 * passed in as a prop, or if not, it will be read from local storage - allowing
 * views to be launched in a new tab. If the name of a library view is passed
 * in as a search parameter, the configuration will be read from the library
 * instead.
 * 
 * @param {Object} props
 * @param {Object} props.cfg - View configuration
 * 
 * @returns {JSX.Element}
 */
const JsonView = (props) => {

    // HackyMcHackhack to prevent scrolling
    useEffect(()=>{
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }, [])

    // Get the view configuration
    let cfg = props.cfg || JSON.parse(localStorage.getItem('viewConfig'))

    // If we have a library view name, use that instead
    const [searchParams] = useSearchParams()
    const viewName = searchParams.get('view')

    // Only version 3 views are supported, obvs
    const v3Views = libraryViews.filter(v => v.config.version === 3)
    const v3View = v3Views.find(v => v.title === viewName)
    if(v3View) {
        cfg = v3View.config
        // If the view doesn't have a title, use the library view title
        if(!cfg.title) cfg.title = v3View.title
    }

    // Return the view, wrapped in an error boundary
    return (
        <VistaErrorBoundary errorMessage={"View may be misconfigured"}>
            <_View {...cfg} top={true} />
        </VistaErrorBoundary>
    )
}

export default JsonView
