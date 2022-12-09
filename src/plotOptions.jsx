import { useSelector, useDispatch } from 'react-redux'
import { 
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle,
    setServer
} from './redux/optionsSlice';
import { useServers } from './hooks'


const ToggleSwitch = (props) => {

    const dispatch = useDispatch()

    const onClass = `button ${props.on ? "is-success" : "is-light"}`;
    const offClass = `button ${props.on ? "is-light" : "is-danger"}`;

    const toggle = () => dispatch(props.toggle())

    return (
        <div className="field has-addons">
            <p className="control">
                <button className={onClass} onClick={toggle}>on</button>
            </p>
            <p className="control">
                <button className={offClass} onClick={toggle}>off</button>
            </p>
        </div>
    )
}

const OptionSwitch = (props) => {
    const dispatch = useDispatch()

    const offClass = "button is-light"
    const onClass = "button is-info"

    const leftClass = props.value === props.options[0] ? onClass : offClass
    const rightClass = props.value === props.options[1] ? onClass : offClass

    const toggle = () => dispatch(props.toggle())

    return (
        <div className="field has-addons">
            <p className="control">
                <button className={leftClass} onClick={toggle}>{props.options[0]}</button>
            </p>
            <p className="control">
                <button className={rightClass} onClick={toggle}>{props.options[1]}</button>
            </p>
        </div>
    )
}

const OptionBlock = (props) => {

    const flexDirectionClass = props.flexDirection 
        ? props.flexDirection == 'column'
            ? 'is-flex-direction-column'
            : 'is-flex-direction-row'
        : 'is-flex-direction-row'

    const classOpts = "is-flex is-justify-content-space-between " + flexDirectionClass
    const styleOpts = {
        padding: "0.8em",
        border: "1px solid #dddddd"
    }

    const titleElem = props.title ? <span className="mt-2">{props.title}</span> : null

    return (
        <div className={classOpts} style={styleOpts}>
            {titleElem}
            {props.optionComponent}
        </div>
    )
    return null
}

const ParameterSelectorDropdown = (props) => {
    const params = [{name: 'Time', id: -1, raw: "utc_time"}, ...useSelector(state => state.vars.params)]
    const options = params.map(p=>{
        return <option key={p.id}>{p.name}</option>
    })
    return (
        <div className="select">
            <select>
                {options}
            </select>
        </div>
    )
}

const ServerSelectorDropDown = (props) => {

    const servers = useServers()
    const server = useSelector(state => state.options.server)
    const dispatch = useDispatch()

    const options = servers.map(s=>{
        return <option key={s} value={s}>{s}</option>
    })

    const onChange = (e) => {
        dispatch(setServer(e.target.value))
    }

    return (
        <div className="select">
            <select value={server} onChange={onChange}>
                {options}
            </select>
        </div>
    )
}

const PlotOptionCard = () => {

    const swapToggleOn = useSelector(s=>s.options.swapOrientation)
    const scrollingOn = useSelector(s=>s.options.scrollingWindow)
    const dataHeaderOn = useSelector(s=>s.options.dataHeader)
    const plotStyle = useSelector(s=>s.options.plotStyle)

    const ordinateSwapToggleSwitch = <ToggleSwitch on={swapToggleOn} toggle={toggleSwapOrientation}/>
    const plotStyleToggleSwitch = <OptionSwitch options={plotStyle.options} value={plotStyle.value} toggle={togglePlotStyle} />
    const scrollingWindowToggleSwitch = <ToggleSwitch on={scrollingOn} toggle={toggleScrollingWindow} />
    const dataHeaderToggleSwitch = <ToggleSwitch on={dataHeaderOn} toggle={toggleDataHeader} />
    const paramSelector = <ParameterSelectorDropdown />
    const serverSelector = <ServerSelectorDropDown />

    return (
        <nav className="panel mt-4">
            <p className="panel-heading">
                
                Plot options
            </p>
            <div className="p-4">
            <OptionBlock title="Swap ordinate/coordinate orientation" optionComponent={ordinateSwapToggleSwitch}/>
            <OptionBlock title="Plot Style" optionComponent={plotStyleToggleSwitch}/>
            <OptionBlock title="Scrolling Window" optionComponent={scrollingWindowToggleSwitch} />
            <OptionBlock title="Data Header" optionComponent={dataHeaderToggleSwitch} />
            <OptionBlock title="Ordinate Axis" optionComponent={paramSelector}/>
            <OptionBlock title="Server" optionComponent={serverSelector} />
            </div>
        </nav>
    )
}

export { PlotOptionCard, OptionBlock }