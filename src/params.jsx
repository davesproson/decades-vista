
import { useDispatch, useSelector } from "react-redux"
import { toggleParamSelected } from "./redux/parametersSlice"

const ParameterLine = (props) => {
    const dispatch = useDispatch()

    const toggleSelected = () => {
        dispatch(toggleParamSelected({
            id: props.id
        }))
    }

    const selectedClass = props.selected ? "has-background-dark has-text-light" : ""

    return (
        <tr className={selectedClass} onClick={toggleSelected} style={{"cursor": "pointer"}}>
            <td></td>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.units}</td>
        </tr>
    )
}

const ParameterTable = (props) => {
    
    const vars = useSelector(state => state.vars)
    const filterText = useSelector(state => state.paramfilter)
    

    if(!vars.params) return (<div></div>);

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
                                     units={param.units} />)

    return (
        <div className="container mt-4">
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

export { ParameterTable }