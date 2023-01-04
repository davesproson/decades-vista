import { useDispatch } from 'react-redux'
import { PropTypes } from 'prop-types'

/**
 * A component that allows the user to toggle an on/off option.
 * Dispatches the toggle action using a given reducer.
 * 
 * @param {Object} props - The props for the component
 * @param {boolean} props.on - The current value of the option
 * @param {Function} props.toggle - The action to dispatch
 * 
 * @component
 * @example
 * const on = true
 * const toggle = () => { return { type: "TOGGLE" } }
 * return (
 * <ToggleSwitch on={on} toggle={toggle} />
 * ) 
 */
const ToggleSwitch = (props) => {

    const dispatch = useDispatch()

    const onClass = `button ${props.on ? "is-success" : "is-light"}`;
    const offClass = `button ${props.on ? "is-light" : "is-danger"}`;

    const toggle = () => dispatch(props.toggle())

    return (
        <div className="field has-addons">
            <p className="control">
                <button className={onClass} onClick={toggle}>on</button>
            </p>
            <p className="control">
                <button className={offClass} onClick={toggle}>off</button>
            </p>
        </div>
    )
}
ToggleSwitch.propTypes = {
    on: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
}

export default ToggleSwitch