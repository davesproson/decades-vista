import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getData } from "../plot/plotUtils";
import { useGetParameters } from "../hooks";
import { badData } from "../settings";
import { SimplePlot } from "../plot/plot";

/**
 * A LimitSetter renders a component that allows the user to set the valid limits
 * for a parameter. The component is intended to be used in a dashboard.
 * 
 * @param {Object} props
 * @param {string} props.name - The name of the parameter
 * @param {number} props.minVal - The minimum value of the parameter
 * @param {number} props.maxVal - The maximum value of the parameter
 * @param {boolean} props.show - Whether to show the component
 * 
 * @component
 * @example
 * const props = {
 *    name: 'temperature',
 *    minVal: 0,
 *    maxVal: 100,
 *    show: true
 * }
 * return (
 *  <LimitSetter {...props} />
 * )
 */
const LimitSetter = (props) => {

    const minRef = useRef(null)
    const maxRef = useRef(null)
    const [searchParams, setSearchParams] = useSearchParams()

    if (!props.show) return null

    const setUrlLimits = ({ name, min, max }) => {

        const urlLimits = searchParams.getAll('limits').filter(x => x.split(',')[0] !== props.name)

        min = isNaN(min) ? '' : min
        max = isNaN(max) ? '' : max
        urlLimits.push(`${name},${min},${max}`)

        searchParams.delete('limits')
        for (const lim of urlLimits) {
            searchParams.append('limits', lim)

        }

        setSearchParams(searchParams)
    }

    const setMax = () => {
        setUrlLimits({ name: props.name, min: props.minVal, max: maxRef.current.value })
    }

    const setMin = () => {
        setUrlLimits({ name: props.name, min: minRef.current.value, max: props.maxVal })
    }

    return (
        <div className="is-flex is-justify-space-around">
            <div className="field has-addons is-flex-grow-1 ">
                <div className="control">
                    <input className="input"
                        type="number"
                        ref={minRef}
                        defaultValue={isNaN(props.minVal) ? '' : props.minVal}
                        placeholder="Valid Minimum" />
                </div>
                <div className="control">
                    <button className="button is-info" onClick={setMin}>
                        Set
                    </button>
                </div>
            </div>
            <div className="field has-addons is-flex-grow-1">
                <div className="control">
                    <input className="input"
                        type="text"
                        ref={maxRef}
                        defaultValue={isNaN(props.maxVal) ? '' : props.maxVal}
                        placeholder="Valid Maximum" />
                </div>
                <div className="control">
                    <button className="button is-info" onClick={setMax}>
                        Set
                    </button>
                </div>
            </div>
            <div className="field is-flex-grow-1">
                <button className="button is-danger is-fullwidth" onClick={props.onHide}>Hide</button>
            </div>
        </div>
    )
}


/**
 * A DashPanel renders a component that displays a single parameter value.
 * The LargeDashPanel renders a larger panel with a title and a value, intended
 * to be used in a dashboard.
 * 
 * @param {Object} props
 * @param {Object} props.param - The parameter to display
 * @param {Array} props.value - An array of the last n values for the parameter
 * @param {Object} props.limits - An array of valid limits for the parameter
 * @param {Number} props.limits.min - The minimum valid value for the parameter
 * @param {Number} props.limits.max - The maximum valid value for the parameter
 * @param {Function} props.setMaximized - A function to set the maximized parameter
 * 
 * @component
 * @example
 * const param = {
 *      id: 1,
 *      name: "Temperature",
 *      DisplayUnits: "C",
 *      DisplayText: "Temperature",
 * }
 * const value = [1, 2, 3, 4, 5]
 * return (
 * <LargeDashPanel param={param} value={value} />
 * )
 */
const LargeDashPanel = (props) => {

    const [showPlot, setShowPlot] = useState(false)

    let dataVal = props?.value?.filter(x => x != null)
        ?.filter(x => x != badData)
        ?.reverse()

    let units = props.param.DisplayUnits === "1" ? "" : props.param.DisplayUnits

    if (dataVal?.length) {
        dataVal = dataVal[0]?.toFixed(2)
    } else {
        dataVal = 'No Data'
        units = ''
    }

    const [showSetter, setShowSetter] = useState(false)

    const togglePlot = () => {
        if (showPlot) {
            setShowPlot(false)
            props.setMaximized(null)
            return
        }
        setShowPlot(true)
        props.setMaximized(props.param.ParameterName)
    }

    const validLimit = props.limits.find(x => x.param === props.param.ParameterName)
    const [minValid, maxValid] = validLimit
        ? [parseFloat(validLimit.min), parseFloat(validLimit.max)]
        : [NaN, NaN]

    const inAlarm = (parseFloat(dataVal) < minValid) || (parseFloat(dataVal) > maxValid)

    const alarmClass = inAlarm ? "has-background-danger" : ""

    const content = showPlot
        ? <SimplePlot params={[props.param.ParameterName]} />
        : `${dataVal} ${units}`

    const btnStyle = {
        background: "#252243",
        color: "#0abbef",
        border: 0,
        cursor: "pointer",
    }

    const panelStyle = {
        border: "1px solid black",
        borderRadius: "5px",
    }

    return (
        <div className="m-4 is-flex is-justify-content-center is-flex-grow-1" style={panelStyle}>

            <div className={`is-flex is-flex-direction-column is-flex-grow-1 ${alarmClass}`} >
                <div className={`is-flex is-flex-direction-row `} style={{
                    background: "#252243",
                    color: "#0abbef",
                    borderBottom: "1px solid black",
                }}>
                    <h3 className="p-3 is-uppercase is-justify-content-center is-flex-grow-1 is-flex">
                        <div className="is-flex is-justify-content-space-between">
                            <button style={btnStyle} onClick={togglePlot}>{props.param.DisplayText}</button>
                        </div>
                    </h3>

                    <button className="button is-small is-info" style={{
                        background: "#252243",
                        color: "#0abbef",
                    }} onClick={() => setShowSetter(!showSetter)}>!</button>
                </div>

                <LimitSetter minVal={minValid} maxVal={maxValid}
                    onHide={() => setShowSetter(false)}
                    show={showSetter} name={props.param.ParameterName} />
                <span className="p-3 is-flex is-justify-content-center  is-size-1 is-flex-grow-1">
                    {content}
                </span>
            </div>
        </div>
    )
}

/**
 * A DashPanel renders a component that displays a single parameter value.
 * The SmallDashPanel renders a small, compact panel with a title and a value, 
 * intended to be used as a header above plots
 * 
 * @param {Object} props
 * @param {Object} props.param - The parameter to display
 * @param {Array} props.value - An array of the last n values for the parameter
 * @param {Object} props.limits - An array of valid limits for the parameter
 * @param {Number} props.limits.min - The minimum valid value for the parameter
 * @param {Number} props.limits.max - The maximum valid value for the parameter
 * 
 * @component
 * @example
 * const param = {
 *      id: 1,
 *      name: "Temperature",
 *      DisplayUnits: "C",
 *      DisplayText: "Temperature",
 * }
 * const value = [1, 2, 3, 4, 5]
 * return (
 * <LargeDashPanel param={param} value={value} />
 * )
 */
const SmallDashPanel = (props) => {
    let dataVal = props?.value?.filter(x => x != null)
        ?.filter(x => x != badData)
        ?.reverse()

    let units = props.param.DisplayUnits === "1" ? "" : props.param.DisplayUnits

    if (dataVal?.length) {
        dataVal = dataVal[0]?.toFixed(2)
    } else {
        dataVal = 'No Data'
        units = ''
    }

    const validLimit = props.limits.find(x => x.param === props.param.ParameterName)
    const [minValid, maxValid] = validLimit
        ? [parseFloat(validLimit.min), parseFloat(validLimit.max)]
        : [NaN, NaN]

    const inAlarm = (parseFloat(dataVal) < minValid) || (parseFloat(dataVal) > maxValid)
    const alarmClass = inAlarm ? "has-background-danger" : ""

    const panelStyle = {
        border: "1px solid black",
        borderRadius: "5px"
    }

    return (
        <div className={`m-1 is-flex is-justify-content-center is-flex-grow-1 ${alarmClass}`} style={panelStyle}>
            <div className="is-flex is-flex-direction-row is-flex-grow-1" >
                <h3 className="is-uppercase is-justify-content-center is-flex-grow-1 is-flex is-size-7" style={{
                }}>
                    {props.param.DisplayText}
                </h3>
                <span className="ml-1 is-flex is-justify-content-center is-size-7 is-flex-grow-1">
                    {dataVal} {units}
                </span>
            </div>
        </div>
    )
}

/**
 * A DashPanel is a dumb component that renders a LargeDashPanel or a SmallDashPanel
 * depending on the size prop.
 * 
 * @param {Object} props
 * @param {String} props.size - The size of the panel. Either "large" or "small"
 * @param {Object} props.param - The parameter to display
 * @param {Array} props.value - An array of the last n values for the parameter
 * 
 * @component
 * @example
 * const param = {
 *      id: 1,
 *      name: "Temperature",
 *      DisplayUnits: "C",
 *      DisplayText: "Temperature",
 * }
 * const value = [1, 2, 3, 4, 5]
 * return (
 * <DashPanel size="large" param={param} value={value} />
 * )
 */
const DashPanel = (props) => {
    if (props.size == "large") {
        return <LargeDashPanel {...props} />
    } else {
        return <SmallDashPanel {...props} />
    }
}

/**
 * A Dashboard renders a collection of DashPanels, each displaying a single parameter value.
 * 
 * Uses the custom hook useGetParameters to get the available parameters from the server.
 * 
 * @param {Object} props
 * @param {Array} props.parameters - An array of parameter (raw) names to display
 * @param {String} props.size - The size of the panels. Either "large" or "small"
 * 
 * @component
 * @example
 * const parameters = ["Temperature", "Pressure"]
 * return (
 * <Dashboard parameters={parameters} size="large" />
 * )
 */
const Dashboard = (props) => {

    const availableParams = useGetParameters()
    const [data, setData] = useState({})
    const [maximized, setMaximized] = useState(null)

    const [searchParams, _] = useSearchParams()

    const limits = searchParams.getAll('limits').map(x => {
        const [param, min, max] = x.split(',')
        return { param: param, min: min, max: max }
    })

    const parameters = props.parameters
    const server = props.server
    const size = props.size

    const dataOptions = {
        params: parameters,
    }
    if (server) dataOptions.server = server

    useEffect(() => {
        const end = Math.floor(new Date().getTime() / 1000) - 1
        const start = end - 5

        getData(dataOptions, start, end).then(data => setData(data))
        const interval = setInterval(() => {
            const end = Math.floor(new Date().getTime() / 1000) - 1
            const start = end - 5
            getData(dataOptions, start, end).then(data => setData(data))
        }, 1000)
        return () => clearInterval(interval)
    }, [setData])

    if (!availableParams) return null

    let filteredParams = availableParams.filter(x => {
        return parameters.includes(x.ParameterName)
    })

    let className = "is-flex is-flex-wrap-wrap is-justify-content-center"
    let style = {}
    if (maximized) {
        filteredParams = filteredParams.filter(x => x.ParameterName === maximized)
        style = { position: "absolute", top: "0px", bottom: "0px", left: "0px", right: "0px" }
    }

    return (
        <div className={className} style={style}>
            {filteredParams.map(x => <DashPanel size={size}
                key={x.ParameterName}
                param={x}
                value={data[x.ParameterName]}
                limits={limits.filter(y => y.param === x.ParameterName)}
                setMaximized={setMaximized} />)}
        </div>

    )
}

/**
 * A DashboardDispatcher parses the URL search parameters and renders a Dashboard
 * 
 * @component
 * @example
 * return (
 * <DashboardDispatcher />
 * )
 */
const DashboardDispatcher = () => {
    const [searchParams, _] = useSearchParams();
    const parameters = searchParams.get("params").split(",")
    const isCompact = searchParams.get("compact") == "true"
    const server = searchParams.get("server") || location.host
    const size = isCompact ? "small" : "large"

    return <Dashboard size={size} parameters={parameters} server={server} />
}


export default DashboardDispatcher
export { Dashboard }