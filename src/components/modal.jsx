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

const Content = (props) => {
    return (
        <div className="modal-content">
            {props.children}
        </div>
    )
}



Modal.Content = Content

export { Modal }