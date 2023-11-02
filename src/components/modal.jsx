/**
 * A basic modal component
 * 
 * @param {Object} props
 * @param {boolean} props.active - Whether the modal is active
 * @param {function} props.close - The function to call when the modal is closed
 * @param {Object} props.children - The children of the modal
 * 
 * @returns {JSX.Element}
 */
const Modal = (props) => {
    const active = props.active ? "is-active" : ""

    return (
        <div className={`modal ${active}`}>
            <div className="modal-background"></div>
            {props.children}
            <button className="modal-close is-large" aria-label="close" onClick={props.close}></button>
        </div>
    )
}

/**
 * The content of the modal
 * 
 * @param {Object} props
 * @param {Object} props.children - The children of the modal
 *
 * @returns {JSX.Element}
 */
const Content = (props) => {
    return (
        <div className="modal-content">
            {props.children}
        </div>
    )
}

Modal.Content = Content

export { Modal }