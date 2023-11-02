
import { useDispatch, useSelector } from "react-redux"
import { useDispatchParameters } from "../hooks"
import { toggleParamSelected } from "../redux/parametersSlice"
import { Loader } from "../components/loader"
import { VistaErrorBoundary } from "../components/error"

/**
 * A single line in the parameter table. When clicked, it toggles the selected
 * state of the parameter. This is an accessibility nightmare, and should be
 * replaced with something that's meant to be clicked.
 * 
 * @param {Object} props
 * @param {number} props.id - The parameter id
 * @param {string} props.name - The parameter name
 * @param {boolean} props.selected - Whether the parameter is selected
 * @param {string} props.units - The parameter units
 * @param {boolean} props.status - The parameter status (indicating available/unavailable)
 * 
 * @returns {JSX.Element}
 */
const ParameterLine = (props) => {
    const dispatch = useDispatch()

    const toggleSelected = (e) => {
        const value = e.target.attributes.data?.value;

        if (value !== "is-status") {
            return dispatch(toggleParamSelected({
                id: props.id
            }))
        } else {
            console.log("TODO: Refresh parameter status.")
        }
    }

    const statusClass = props.status === true 
        ? "has-background-success-light has-text-success "
        : props.status === false
            ? "has-background-danger-light has-text-danger"
            : "has-text-grey-lighter	"

    const statusText = props.status === true 
        ? "Available"
        : props.status === false
            ? "Unavailable"
            : "Loading..."

    const selectedClass = props.selected ? "has-background-dark has-text-light" : ""

    return (
        <tr className={selectedClass} onClick={(e)=>toggleSelected(e)} style={{"cursor": "pointer"}}>
            <td style={{width: "0"}} className={statusClass} data="is-status">{statusText}</td>
            <td style={{width: "0"}}>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.units}</td>
        </tr>
    )
}

/**
 * A table of parameters. This is the main component for the parameters view.
 * 
 * @returns {JSX.Element}
 */
const ParameterTable = () => {

    const vars = useSelector(state => state.vars)
    const filterText = useSelector(state => state.paramfilter)
    const server = useSelector(state => state.options.server)
    useDispatchParameters()

    const paramsChecked = vars.params.length && vars.params.every(x => x.status !== null)

    if(server===undefined) return <Loader text="Waiting for server availability..." />
    if(!paramsChecked) return <Loader text="Checking Parameter Availability..." />
    if(!vars.params) return <Loader text="Getting parameters..." />;
    if(server===null) return <VistaErrorBoundary text="Server is not available." />

    const params = [...vars.params];

    const rows = params
        .filter(
            x => (x.name.toLowerCase().includes(filterText.filterText.toLowerCase())
               || x.id.toString().toLowerCase().includes(filterText.filterText.toLowerCase())))
        .sort((a, b)=>(a.id - b.id))
        .map(param => <ParameterLine key={param.id} 
                                     id={param.id} 
                                     name={param.name} 
                                     selected={param.selected} 
                                     units={param.units} 
                                     status={param.status} />)

    return (
        <div className="container mt-4 has-navbar-fixed-top">
            <table className="table is-narrow is-hoverable is-fullwidth is-bordered is-striped" style={{"margin": "auto"}}>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Param #</th>
                        <th>Parameter</th>
                        <th>Units</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    )
}

export default ParameterTable