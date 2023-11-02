/**
 * A little loader spinner thingy. I mean, nothing spins, but it's a loader.
 * 
 * @param {Object} props
 * @param {string} props.text - The text to display
 * @param {number} props.value - The current value of the progress bar. This may
 *                               or may not actually do anything.
 * @param {number} props.max - The maximum value of the progress bar.
 * 
 * @returns {JSX.Element}
 */
const Loader = (props) => {
    // Nothing says professional like a progress bar that doesn't progress
    // with a bunch of inlined styles
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
            <div style={{
                backgroundColor: "#252243",
                width: "200px",
                height: "200px",
                borderRadius: "200px",
                border: "20px solid #0abbef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2em",
            }}>F A A M</div>
            <div className="is-size-4">{props.text}</div>
 
            <progress className="progress" style={{
                width:"50%"
            }} value={props.value} max={props.max}>{props.value}</progress>
        
        </div>
    )
}

export { Loader }