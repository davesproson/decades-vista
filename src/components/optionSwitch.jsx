import { useDispatch } from "react-redux"
import { PropTypes } from "prop-types"

/**
 * A component that allows the user to select between two options.
 * Dispatches the toggle action using a given reducer.
 * 
 * @param {Object} props - The props for the component
 * @param {string} props.value - The current value of the option
 * @param {Array} props.options - The options to choose between
 * @param {Function} props.toggle - The action to dispatch
 * 
 * @component
 * @example
 * const options = ["on", "off"]
 * const value = "on"
 * const toggle = () => { return { type: "TOGGLE" } }
 * return (
 * <OptionSwitch value={value} options={options} toggle={toggle} />
 * )
 */
const OptionSwitch = (props) => {
    const dispatch = useDispatch()

    const offClass = "button is-light"
    const onClass = "button is-info"

    const leftClass = props.value === props.options[0] ? onClass : offClass
    const rightClass = props.value === props.options[1] ? onClass : offClass

    const toggle = () => dispatch(props.toggle())

    return (
        <div className="field has-addons">
            <p className="control">
                <button className={leftClass} onClick={toggle}>{props.options[0]}</button>
            </p>
            <p className="control">
                <button className={rightClass} onClick={toggle}>{props.options[1]}</button>
            </p>
        </div>
    )
}
OptionSwitch.propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggle: PropTypes.func.isRequired
}

export default OptionSwitch