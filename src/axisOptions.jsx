import { useSelector, useDispatch } from "react-redux"
import { OptionBlock } from "./plotOptions"
import { addNewAxis, selectAxis } from "./redux/parametersSlice"

const AddAxisButton = (props) => {
    const dispatch = useDispatch()

    const addAxis = () => {
        dispatch(addNewAxis({
            paramId: props.param.id
        }))
    }

    return (
        <div className="control">
            <button className="button is-primary" onClick={addAxis}>+</button>
        </div>
    )
}

const AxisSelectorItem = (props) => {
    const axes = useSelector(state => state.vars.axes)
    const dispatch = useDispatch()

    const axesOptions = axes.filter(x => x.units == props.param.units).map(x => {
        return <option key={x.id}  value={x.id}>Axis {x.id} ({x.units})</option>
    })

    const changeAxis = (event) => {
        dispatch(selectAxis({
            axisId: parseInt(event.target.value),
            paramId: props.param.id
        }))
    }

    return (
        <div className="field has-addons">
            <div className="control">
                <div className="select">
                    <select value={props.param.axisId} onChange={changeAxis}>
                        {axesOptions}
                    </select>
                </div>
            </div>
            <AddAxisButton param={props.param} />
        </div>
    )
}

const AxisSelectorGroup = (props) => {
    const vars = useSelector(state => state.vars)
    return vars.params.filter(x => x.selected).map(
        x => <OptionBlock key={x.id} title={`${x.name} (${x.units})`} optionComponent={<AxisSelectorItem key={x.id} param={x} />} />
    )
}

const AxisOptionsCard = () => {
    return (
        <nav className="panel mt-4">
            <p className="panel-heading">
                Axis selection
            </p>
            <div className="p-4">
                <AxisSelectorGroup />
            </div>
        </nav>
    )
}

export { AxisOptionsCard }