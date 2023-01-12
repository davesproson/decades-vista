import { useRef } from "react";
import { useTephigram } from "./hooks";

const Tephigram = (props) => {
    
    const ref = useRef(null)
    useTephigram(ref)

    const style = props.style || {top: 0, left: 0, right: 0, bottom: 0, position: 'absolute'}

    return (
        <div className={props.class} ref={ref} style={style}></div>
    )
}

export default Tephigram