import { useEffect } from 'react'
import { useState, useRef } from 'react'

const Unloaded = (props) => {
    const ref = useRef(null)

    const showFileSelect = () => {
        ref.current.click()
    }

    const load = (e) => {
        const selectedFile = e.target.files[0]
        
        const reader = new FileReader()
        reader.onload = (e) => {
            //try {
                const text = e.target.result
                const json = JSON.parse(text)
                const alarmWithId = json.map((a, i) => ({...a, id: i}))
                props.setAlarms(alarmWithId)
            //} catch (e) {
               // alert("Error parsing file - please check it is a valid config file")
            //}
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

const AlarmList = () => {
    const [alarms, setAlarms] = useState([])

    if(!alarms.length) return <Unloaded setAlarms={setAlarms} />

    return (
        <div className="container mt-2">
            {alarms.map((a) => <Alarm key={a.id} {...a} />)}
        </div>
    )
    
}

const Alarm = (props) => {
  
    const [passing, setPassing] = useState(props.passing)

    useEffect(() => {
        const interval = setInterval(() => {
            const newPassing = Math.random() > 0.5
            setPassing(newPassing)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const messageClass = passing 
        ? "is-success"
        : passing === undefined 
            ? "is-secondary"
            : "is-danger"

    return (
        <article className={`message mb-1 mt-1 is-small ${messageClass}`}>
            <div className="message-body">
                <strong>{props.name}</strong> - {props.description}
            </div>
        </article>
    )
}

export default AlarmList
