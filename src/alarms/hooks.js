import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getData } from '../plot/plotUtils'
import { badData } from '../settings'
import { decode, encode } from 'base-64'
import { evaluate } from 'mathjs'


const useAlarmUrl = (setAlarms, props) => {

    const [searchParams, setSearchParams] = useSearchParams()

    const removeAlarm = (id) => {
        const alarms = searchParams.getAll("alarm").map(x=>JSON.parse(decode(x)))
                                                   .filter(x=>x.name !== id)
        
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
            setAlarms(urlAlarms.map((a, i) => ({...a, id: a.name})))
        } catch (e) {
            alert("Error parsing alarms specified in URL")
            setSearchParams(new URLSearchParams())
            console.log("Error parsing URL alarms")
            console.error(e)
        }
    }, [searchParams, setSearchParams])

    
    if(props.alarms) {
        return [null, {}]
    }

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
                data = await getData({params: props.parameters, start: start})
            } catch (e) {
                const alarmValue = props.failOnNoData ? false : undefined
                setPassing(alarmValue)
                return
            }
            
            for(let param of Object.keys(data)) {
                try {
                    data[param] = data[param].filter((d) => d !== null)
                                             .filter((d) => d !== badData)
                                             .reverse()[0]
                    if(data[param] === undefined) throw("No data")
                } catch (e) {
                    data[param] = null
                    const alarmValue = props.failOnNoData ? false : undefined
                    setPassing(alarmValue)
                    return
                }
            }
            
            try {
                const passing = evaluate(props.rule, {...data})
                setPassing(passing)
            } catch (e) {
                console.log("Error evaluating alarm rule")
                console.log(e)

                const alarmValue = props.failOnNoData ? false : undefined
                setPassing(alarmValue)
            }
            
        }

        runAlarms()
        
        const interval = setInterval(runAlarms, props.interval ? props.interval * 1000 : 5000)
        return () => clearInterval(interval)
    }, [setPassing])

    return passing
}

export { useAlarm, useAlarmUrl }