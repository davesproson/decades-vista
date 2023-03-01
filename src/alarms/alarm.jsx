import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAlarm, useAlarmUrl } from './hooks'
import { encode } from 'base-64'

/**
 * Unloaded is a component that is displayed when the user has not loaded any alarms
 * it provides a button to load a file. When the file is loaded it parses the file and
 * sets the search params to the alarms in the file
 * 
 * @component
 * @example
 * return (
 * <Unloaded />
 * )
 */
const Unloaded = () => {
    const ref = useRef(null)
    const [_, setSearchParams] = useSearchParams()

    const showFileSelect = () => {
        ref.current.click()
    }

    const load = (e) => {
        const selectedFile = e.target.files[0]
        
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target.result
                const json = JSON.parse(text)
                
                const urlPars = new URLSearchParams()
                for(let alarm of json) {
                    urlPars.append("alarm", encode(JSON.stringify(alarm)))
                }
                setSearchParams(urlPars)

            } catch (e) {
                console.error(e)
                alert("Error parsing file - please check it is a valid config file")
            }
        }
        reader.readAsText(selectedFile)
        ref.current.value = ""
    }

    return (
        <div className="container">
            <div className="section">
                <span className="button  is-outlined is-secondary is-fullwidth" onClick={showFileSelect}>
                        Load <input ref={ref} type="file" style={{ display: "none" }} onChange={load} />
                </span>
            </div>
        </div>
    )
}

/**
 * AlarmList is a component that displays a list of alarms. It uses the useAlarmUrl hook to
 * parse alarms from the search params and remove them from the search params when the user
 * clicks the delete button
 * 
 * @component
 * @example
 * return (
 * <AlarmList />
 * )
 */
const AlarmList = () => {
    const [alarms, setAlarms] = useState([])
    const [removeAlarm, alarmParams] = useAlarmUrl(setAlarms)

    if(!alarms.length) return <Unloaded setAlarms={setAlarms} />

    return (
        <div className="container mt-2">
            {alarms.map((a) => <Alarm key={a.id} {...a} {...alarmParams} remove={()=>removeAlarm(a.id)}/>)}
        </div>
    )
    
}

const Alarm = (props) => {
  
    const passing = useAlarm(props)

    const messageClass = passing 
        ? "is-success"
        : passing === undefined 
            ? "is-secondary"
            : "is-danger"

    const messageText = passing 
        ? "PASS"
        : passing === undefined 
            ? "UNKNOWN"
            : "FAIL"

    if(props.display === "compact") {
        return (
            <span className={`tag ${messageClass} mr-1`}>{props.name}</span>
        )
    }

    return (
        <article className={`message mb-1 mt-1 is-small ${messageClass}`}>
            <div className="message-body">
                <span><strong>{props.name}</strong> - {props.description}</span>
                <span className="is-pulled-right">
                <span className="mr-2">{messageText}</span>
                <button className="delete" aria-label="delete" onClick={props.remove}></button>
                </span>
               
                
            </div>
            
        </article>
    )
}

export default AlarmList
