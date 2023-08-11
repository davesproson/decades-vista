import { useEffect } from "react"
import { useState } from "react"

import { Button } from "../components/buttons"

const TimerContainer = ({ name, time, buttons, inAlarm, inWarning }) => {

    const panelStyle = {
        border: "1px solid black",
        borderRadius: "5px",
        background: inAlarm
            ? "#ec6463"
            : inWarning
                ? "orange"
                : "white",
    }

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600)
        const minutes = `${Math.floor((time % 3600) / 60)}`.padStart(2, "0")
        const seconds = `${Math.floor(time % 60)}`.padStart(2, "0")
        return `${hours}:${minutes}:${seconds}`
    }

    return (
        <div className="m-2 is-flex is-justify-content-center is-flex-grow-1" style={panelStyle}>

            <div className={`is-flex is-flex-direction-column is-flex-grow-1`} >
                <div className={`is-flex is-flex-direction-row `} style={{
                    background: "#252243",
                    color: "#0abbef",
                    borderBottom: "1px solid black",
                }}>
                    <h3 className="p-3 is-uppercase is-justify-content-center is-flex-grow-1 is-flex">
                        <div className="is-flex is-justify-content-space-between">
                            {name}
                        </div>
                    </h3>
                    <div className="m-2">
                        {buttons?.map((b, i) => <Button.Info key={i} style={{
                            background: "#252243",
                            color: "#0abbef",
                            border: "1px solid #0abbef"
                        }} small onClick={b.onClick}>{b.text}</Button.Info>)}
                    </div>
                </div>

                <span className="p-3 is-flex is-justify-content-center is-size-3 is-flex-grow-1">
                    {formatTime(time)}
                </span>
            </div>
        </div>
    )
}

const CountUp = ({name}) => {
    const [time, setTime] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(t => t + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return <TimerContainer time={time} name={name} buttons={[
        { text: 'Reset', onClick: () => setTime(0) }
    ]} />
}

const CountDown = ({initialTime, name, warnBelow, alarmBelow}) => {
    const [time, setTime] = useState(parseInt(initialTime))

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(t => t === 0 ? 0 : t - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return <TimerContainer 
                time={time}
                inAlarm={time < (alarmBelow || 20)}
                inWarning={time < (warnBelow || 60)} 
                name={name} buttons={[
                    { text: 'Reset', onClick: () => setTime(initialTime)},
                    { text: '+1', onClick: () => setTime(t => t + 60)},
                    { text: '+5', onClick: () => setTime(t => t + 300)},
                ]} 
            />
}

const Timers = ({initialTimers}) => {
    const [timers, setTimers] = useState(initialTimers || [])
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 10, y: 10 })

    useEffect(() => {
        setShowContextMenu(timers.length === 0)
    }, [timers])

    const timerComponents = timers.map((t, i) => {
        if(t.type === "countdown") {
            return <CountDown key={i} {...t} />
        }
        return <CountUp key={i} {...t} />
    })

    const onContextMenu = (e) => {
        e.preventDefault()
        const x = e.clientX
        const y = e.clientY
        setContextMenuPosition({ x, y })
        setShowContextMenu(true)
        setTimeout(() => {
            setShowContextMenu(false)
        }, 3000)
    }

    const addCountdown = ({name, initialTime}) => {
        const newCountdown = { 
            type: "countdown",
            initialTime: initialTime || 60,
            name: name || "Countdown"
        }
        setTimers([...timers, newCountdown])
    }

    const addCountUp = ({name}) => {
        const newCountUp = {
            type: "timer",
            time: 0,
            name: name || "Timer"
        }
        setTimers([...timers, newCountUp])
    }

    return (
        <>
            <div style={{
                position: timers.length ? "absolute" : "relative",
                display: showContextMenu ? "block": "none",
                top: contextMenuPosition.y - 10,
                left: contextMenuPosition.x - 10,
                background: "#ffffff88",
                padding: "3px",
                border: timers.length ? "1px solid black" : "",
                zIndex: 100,
                borderRadius: "5px",
            }}
                onMouseLeave={() => {if(timers.length) setShowContextMenu(false)}}
            >
                <Button.Info extraClasses="mr-1" onClick={addCountUp}>New Timer</Button.Info>
                <Button.Info onClick={addCountdown}>New Countdown</Button.Info>
            </div>
            <div onContextMenu={onContextMenu}>
                <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                    {timerComponents}
                </div>
            </div>
        </>
    )
}

export default Timers