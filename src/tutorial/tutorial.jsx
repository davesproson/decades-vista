import { useSelector, useDispatch } from "react-redux"
import { panels } from "./panels"
import { useTutorialAction } from "./hooks"
import { setShowTutorial, incrementPosition } from "../redux/tutorialSlice"
import { useNavigate } from "react-router-dom"

const TutorialPanel = (props) => {
    useTutorialAction(props.action, props.dispatch, props.clear)
    console.log(props)
    const navigate = useNavigate()
    
    const onContinue = () => {
        if(props.nextRoute) {
            navigate(props.nextRoute)
        }
        props.next()
    }

    return (
        <div style={{
            position: "fixed",
            bottom: "0px",
            left: "0px",
            width: "100%",
            height: "300px",
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.85)",
            color: "white",
            overflowY: "auto",
        }}>
            <div className="container ">
                <div className="section">
                    <h6 className="title has-text-white">{props.title}</h6>
                    {props.text}
                    <div className="mt-4">
                    <button className="button mr-1 is-success" onClick={onContinue}>{props.continueText || "Continue"}</button>
                    <button className="button is-danger" onClick={props.abort}>{props.abortText || "Close"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TutorialDispatcher = (props) => props.children[props.position]


const Tutorial = () => {
    const position = useSelector(s => s.tutorial.position)
    const show = useSelector(s => s.tutorial.show)
    const dispatch = useDispatch()
    if(!show) return null

    return (
        <TutorialDispatcher position={position}>
            {panels.map((panel, i) => {
                return <TutorialPanel key={i} {...panel}  
                                      next={()=>dispatch(incrementPosition())}
                                      abort={()=>dispatch(setShowTutorial(false))}/>
            })}
        </TutorialDispatcher>
    )
}

export default Tutorial