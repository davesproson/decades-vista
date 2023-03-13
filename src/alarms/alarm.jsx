import { useState, useRef } from 'react'
import { useAlarm, useAlarmUrl } from './hooks'
import { encode } from 'base-64'
import { base as siteBase } from '../settings'

const AlarmEditor = (props) => {

    if (!props.display) return null

    const checkValid = (json) => {
        try {
            const parsed = JSON.parse(json)
            
            if (!Array.isArray(parsed)) return false
            for (let alarm of parsed) {
                if (!alarm.name) return false
                if (!alarm.description) return false
                if (!alarm.rule) return false
                if (!alarm.parameters) return false
            }
            return true
        } catch (e) {
            return false
        }
    }

    const jsonChanged = (e) => {
        const json = e.target.value
        props.onEdit(json)
    }

    const onLaunch = () => {
        if (!checkValid(props.text)) return null
        const urlPars = new URLSearchParams()
            for (let alarm of JSON.parse(props.text)) {
                urlPars.append("alarm", encode(JSON.stringify(alarm)))
            }

        return `${siteBase}alarms/?${urlPars.toString()}`
    }

    const bgClass = checkValid(props.text) ? "has-background-success-light" : "has-background-danger-light"

    return (
        <article className="message is-dark">
            <div className="message-header">
                <p>Alarm Editor</p>
            </div>
            <div className="message-body">
                <div className="block">
                    <div className="field">
                        <div className="control">
                            <textarea className={`textarea ${bgClass}`}
                                      type="text"
                                      placeholder="Type your json here..."
                                      rows={20}
                                      value={props.text} 
                                      style={{fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"}}
                                      onChange={jsonChanged} />
                        </div>
                    </div>
                </div>
                <div className="block">
                    <a className="button is-primary is-fullwidth" 
                            href={onLaunch()}
                            disabled={!checkValid(props.text)}
                            target={props.openExternal ? "_blank" : null}>
                        Launch
                    </a>
                </div>  
            </div>
        </article>
    )
}

const AlarmInfo = (props) => {
    
    if (!props.display) return null

    return (
        <article className="message is-dark">
            <div className="message-header">
                <p>Alarms</p>
                <button className="delete" aria-label="delete" onClick={props.hide}></button>
            </div>
            <div className="message-body">
                <div className="block">Alarms are a way to highlight when data are not falling within a certain range.</div>
                <div className="block">
                    Alarms are specified through a <strong>json</strong> file. For example, the json below will
                    create two alarms, one which fails whenever the temperature is below 0 degrees, and one which
                    fails whenever the temperature is above 30 degrees <strong>and</strong> then aircraft is
                    airborne.
                </div>
                <div className="block">
                    The <strong>rule</strong> of each alarm is evaluated every <strong>interval</strong> (default 5) seconds.
                    If the rule evaluates to <strong>false</strong> then the alarm is triggered.
                </div>
                <pre>
                    <code>
                        {`[
    {
        "name": "Temperature > 0",
        "description": "An alarm that fails when the temperature is below 0",
        "interval": 10,
        "parameters": ["deiced_true_air_temp_c"],
        "rule": "deiced_true_air_temp_c > 0",
        "failOnNoData": true
    },
    {
        "name": "Temperature above 30 when airborne",
        "description": "An alarm that fails when the temperature is above 30 and the aircraft is airborne",
        "parameters": ["deiced_true_air_temp_c", "prtaft01_wow_flag"],
        "rule": "deiced_true_air_temp_c < 30 | prtaft01_wow_flag == 1"
    }
]`}

                    </code>
                </pre>
            </div>
        </article>
    )
}

/**
 * Unloaded is a component that is displayed when the user has not loaded any alarms
 * it provides a button to load a file. When the file is loaded it parses the file and
 * sets the search params to the alarms in the file
 * 
 * @param {object} props
 * @param {boolean} props.openExternal - if true, the launch button will open the alarms in a new tab
 * 
 * 
 * @component
 * @example
 * return (
 * <Unloaded />
 * )
 */
const Unloaded = (props) => {
    const ref = useRef(null)
    
    const [showInfo, setShowInfo] = useState(true)

    const [alarmJson, setAlarmJson] = useState("")
    const [showEditor, setShowEditor] = useState(false)

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
                const newText = JSON.stringify(json, null, 2)
                setShowInfo(false)
                setShowEditor(true)
                setAlarmJson(newText)

            } catch (e) {
                console.error(e)
                alert("Error parsing file - please check it is a valid config file")
            }
        }
        reader.readAsText(selectedFile)
        ref.current.value = ""
    }

    const newJson = () => {
        setShowInfo(false)
        setAlarmJson("")
        setShowEditor(true)
    }

    return (
        <div className="container mt-2">

            <div className="section">
                <AlarmEditor display={showEditor} text={alarmJson} onEdit={setAlarmJson} openExternal={props.openExternal} />
                <AlarmInfo display={showInfo} hide={()=>setShowInfo(false)} />
                <button className="button  is-outlined is-secondary is-fullwidth mb-1" onClick={newJson}>New </button>
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
const AlarmList = (props) => {
    const [alarms, setAlarms] = useState([])
    const [removeAlarm, alarmParams] = useAlarmUrl(setAlarms)

    if (!alarms.length) return <Unloaded setAlarms={setAlarms} openExternal={props.openExternal} />

    return (
        <div className="container mt-2">
            {alarms.map((a) => <Alarm key={a.id} {...a} {...alarmParams} remove={() => removeAlarm(a.id)} />)}
        </div>
    )

}

const Alarm = (props) => {

    const passing = useAlarm(props)
    const [showRule, setShowRule] = useState(false)

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

    const rule = showRule
        ? <div className="block"><code>{props.rule}</code></div>
        : null

    if (props.display) {
        const tagSize = props.display === "compact" ? null : "is-large"
        return (
            <span className={`tag ${tagSize} ${messageClass} mr-1`}>{props.name}</span>
        )
    }

    return (
        <article className={`message mb-1 mt-1 is-small ${messageClass}`}>
            <div className="message-body">
                <span><strong><button style={{all: "unset", cursor: "pointer"}} onClick={()=>setShowRule(x=>!x)}>{props.name}</button></strong> - {props.description}</span>
                <span className="is-pulled-right">
                    <span className="mr-2">{messageText}</span>
                    <button className="delete" aria-label="delete" onClick={props.remove}></button>
                </span>
                {rule}

            </div>

        </article>
    )
}

export default AlarmList
