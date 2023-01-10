
const Loader = (props) => {
    return (
        <div style={{
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div className="is-size-4">Checking Parameter Availability...</div>
 
            <progress className="progress is-primary" style={{width:"50%"}} value={props.value} max={props.max}>{props.value}</progress>
        
        </div>
    )
}

export { Loader }