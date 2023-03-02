import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getData } from '../plot/plotUtils'
import { badData } from '../settings'
import { decode, encode } from 'base-64'
import { evaluate } from 'mathjs'

const useAlarmUrl = (setAlarms) => {
    const [searchParams, setSearchParams] = useSearchParams()

    const removeAlarm = (id) => {
        const alarms = searchParams.getAll("alarm").map(x=>JSON.parse(decode(x)))
        alarms.splice(id, 1)
        
        const newSearchParams = new URLSearchParams()
        for(let alarm of alarms) {
            newSearchParams.append("alarm", encode(JSON.stringify(alarm)))
        }
        setSearchParams(newSearchParams)
    }

    const alarmParams = {}
    for(let k of searchParams.keys()) {
        
        if(k !== "alarm") {
            alarmParams[k] = searchParams.getAll(k)
            if(alarmParams[k].length === 1) alarmParams[k] = alarmParams[k][0]
        }
    }

    useEffect(() => {
        try {
            const urlAlarms = searchParams.getAll("alarm").map(x=>JSON.parse(decode(x)))
            setAlarms(urlAlarms.map((a, i) => ({...a, id: i})))
        } catch (e) {
            alert("Error parsing alarms specified in URL")
            setSearchParams(new URLSearchParams())
            console.log("Error parsing URL alarms")
            console.error(e)
        }
    }, [searchParams, setSearchParams])

    return [removeAlarm, alarmParams]
}

const useAlarm = (props) => {

    const [passing, setPassing] = useState(props.passing)

    useEffect(() => {
        const runAlarms = async () => {
                
            const end = Math.floor(new Date().getTime() / 1000)
            const start = end - (props.interval || 5)

            let data
            try {
                data = await getData({params: props.parameters, start: start, end: end})
            } catch (e) {
                setPassing(undefined)
                return
            }
            
            for(let param of Object.keys(data)) {
                try {
                    data[param] = data[param].filter((d) => d !== null)
                                             .filter((d) => d !== badData)
                                             .reverse()[0]
                } catch (e) {
                    data[param] = null
                    setPassing(undefined)
                    return
                }
            }
            
            try {
                const passing = evaluate(props.rule, {...data})
                setPassing(passing)
            } catch (e) {
                console.log("Error evaluating alarm rule")
                setPassing(undefined)
            }
            
        }

        runAlarms()
        
        const interval = setInterval(runAlarms, props.interval ? props.interval * 1000 : 5000)
        return () => clearInterval(interval)
    }, [setPassing])

    return passing
}

export { useAlarm, useAlarmUrl }