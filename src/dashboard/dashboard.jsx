import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getData } from "../plot/plotUtils";
import { useGetParameters } from "../hooks";

/**
 * A DashPanel renders a component that displays a single parameter value.
 * The LargeDashPanel renders a larger panel with a title and a value, intended
 * to be used in a dashboard.
 * 
 * @param {Object} props
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
 * <LargeDashPanel param={param} value={value} />
 * )
 */
const LargeDashPanel = (props) => {
    let dataVal = props?.value?.filter(x=>x != null)?.reverse()[0]?.toFixed(2)


    return (
        <div className="m-4 is-flex is-justify-content-center is-flex-grow-1" style={{
            border: "1px solid black",
            borderRadius: "5px"
        }}>
            <div className="is-flex is-flex-direction-column is-flex-grow-1" >
                <h3 className="p-3 is-uppercase is-justify-content-center is-flex-grow-1 is-flex" style={{
                    background: "#252243",
                    color: "#0abbef",
                    borderBottom: "1px solid black"
                }}>
                    {props.param.DisplayText}
                </h3>
                <span className="p-3 is-flex is-justify-content-center is-size-1">
                    {dataVal} {props.param.DisplayUnits}
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
    let dataVal = props?.value?.filter(x=>x != null)?.reverse()[0]?.toFixed(2)

    return (
        <div className="m-1 is-flex is-justify-content-center is-flex-grow-1" style={{
            border: "1px solid black",
            borderRadius: "5px"
        }}>
            <div className="is-flex is-flex-direction-row is-flex-grow-1" >
                <h3 className="is-uppercase is-justify-content-center is-flex-grow-1 is-flex is-size-7" style={{
                }}>
                    {props.param.DisplayText}
                </h3>
                <span className="ml-1 is-flex is-justify-content-center is-size-7 is-flex-grow-1">
                    {dataVal} {props.param.DisplayUnits}
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
    if(props.size == "large") {
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

    const parameters = props.parameters
    const server = props.server
    const size = props.size

    const dataOptions = {
        params: parameters,
    }
    if(server) dataOptions.server = server

    useEffect(() => {
        const end = Math.floor(new Date().getTime() / 1000) - 1
        const start = end - 5

        getData(dataOptions, start, end).then(data => setData(data))
        const interval = setInterval(() => {
            const end = Math.floor(new Date().getTime() / 1000) - 1
            const start = end - 5
            getData(dataOptions, start, end).then(data => setData( data))
        }, 1000)
        return () => clearInterval(interval)
    }, [setData])

    if(!availableParams) return null

    const filteredParams = availableParams.filter(x=>{
        return parameters.includes(x.ParameterName)
    })

    return (
        <div className="is-flex is-flex-wrap-wrap is-justify-content-center">
            {filteredParams.map(x => <DashPanel size={size} 
                                                key={x.ParameterName}
                                                param={x}
                                                value={data[x.ParameterName]}/>)}
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
    const server = searchParams.get("server")
    const size = isCompact ? "small" : "large"
    
    return <Dashboard size={size} parameters={parameters} server={server} />
}

export default DashboardDispatcher
export { Dashboard }