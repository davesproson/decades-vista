import { useDispatch } from "react-redux"
import { useState } from "react"
import { setFilterText } from "./redux/filterSlice"
import { Link, useLocation } from "react-router-dom"
import { toggleParamSelected, unselectAllParams } from "./redux/parametersSlice"
import { setOrdinateAxis, setTimeframe } from "./redux/optionsSlice"
import { useSelector } from "react-redux"
import { usePlotUrl, useDashboardUrl, useTephiAvailable, useTephiUrl } from "./hooks"
import { Outlet } from "react-router-dom"
import { loadSavedView } from "./redux/viewSlice"
import { useNavigate } from "react-router-dom"
import { presets } from "./settings"

const NavSearchInput = (props) => {
    const dispatch = useDispatch()

    const setFilter = (e) => {
        dispatch(setFilterText({filterText: e.target.value}))
    }

    return (
        <input
            className="m-2 input is-primary"
            type="text"
            placeholder="Filter..."
            onChange={setFilter}
            value={props.filterText}
        />
    )
}

const NavTimeFrameSelector = (props) => {

    const [visible, setVisible] = useState(false)
    const dispatch = useDispatch()

    const timeframes = useSelector(state => state.options.timeframes)
    const selectedTimeframes = timeframes.filter(x => x.selected)
    const customActiveClass = selectedTimeframes.length == 0 ? "has-text-success is-underlined" : ""

    const toggleVisible = (e) => {
        setVisible(!visible)
    }

    const timeFrameElements = timeframes.map(x => {
        const active = x.selected ? "has-text-success is-underlined" : ""

        const onSetTimeframe = (e) => {
            dispatch(setTimeframe({value: e}))
        }

        return (
            <a className="navbar-item" key={x.value} onClick={()=>{onSetTimeframe(x.value);toggleVisible()}}>
                <span className={active}>{x.label}</span>
            </a>
        )
    })

    const visibleClass = visible ? "is-active" : ""

    return (
        <div className={`navbar-item has-dropdown ${visibleClass}`} onMouseLeave={()=>setVisible(false)}>
            <a className="navbar-link" onClick={toggleVisible}>
                Timeframe
            </a>

            <div className="navbar-dropdown" >
                {timeFrameElements}
                <hr className="navbar-divider" />
                <div  onClick={toggleVisible}>
                <Link to="/timeframe" className="navbar-item" >
                    <span className={customActiveClass}>Custom...</span>
                </Link>
                </div>
            </div>
        </div>
    )
}

const PresetSelector = (props) => {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    const toggleVisible = (e) => {
        setVisible(!visible)
    }

    const setPreset = (presets) => {
        dispatch(unselectAllParams())
        for(let p of presets) {
            dispatch(toggleParamSelected({id: p.toString()}))
        }
        setVisible(false)
    }

    const visibleClass = visible ? "is-active" : ""
    const presetOptions = Object.entries(presets).map(x => {
        
        return (
            <a className="navbar-item" key={x[0]} onClick={()=>setPreset(x[1])}>
                <span>{x[0]}</span>
            </a>
        )
    })

    return (
        <div className={`navbar-item has-dropdown ${visibleClass}`} onMouseLeave={()=>setVisible(false)}>
            <a className="navbar-link" onClick={toggleVisible}>
                Presets
            </a>
            <div className="navbar-dropdown">
                {presetOptions}
            </div>
        </div>
    )
}

const ViewsSelector = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const savedViews = useSelector(state => state.view.savedViews)
    const [visible, setVisible] = useState(false)

    const visibleClass = visible ? "is-active" : ""

    const goto = (id) => {
        dispatch(loadSavedView({id: id}))
        navigate("/config-view")
    }

    const toggleVisible = (e) => {
        setVisible(!visible)
    }

    const viewElements = savedViews.map((x, i) => {
        return (
            <a className="navbar-item" key={i} onClick={()=>goto(x.id)}>
                <span>{x.name}</span>
            </a>
        )
    })


    return (
        <div className={`navbar-item has-dropdown ${visibleClass}`}>
            <a className="navbar-link" onClick={toggleVisible}>
                Views
            </a>
            <div className="navbar-dropdown" onClick={()=>setVisible(false)} onMouseLeave={()=>setVisible(false)}>
                <Link to="/config-view"  className="navbar-item">
                    Config...
                </Link>
                <hr className="navbar-divider" />
                {viewElements}
            </div>
        </div>
    )
}

const PlotButton = (props) => {
    const params = useSelector(state => state.vars.params)
    const disable = params.filter(x => x.selected).length == 0

    const plotUrl = usePlotUrl()

    if(disable) {
        return (
            <button className="button is-primary" disabled>Plot</button>
        )
    }
    
    return (
        <a href={plotUrl} target="_blank" rel="noopener noreferrer" className="button is-primary">
            Plot
        </a>
    )
}

const TephiButton = (props) => {

    const available = useTephiAvailable()
    const url = useTephiUrl()

    if(!available) {
        return (
            <button className="button is-primary" disabled>Tephigram</button>
        )
    }

    return (
        <a href={url} className="button is-primary" target="_blank" rel="noopener noreferrer">
            Tephigram
        </a>
    )
}

const DashButton = (props) => {
    const params = useSelector(state => state.vars.params)
    const disable = params.filter(x => x.selected).length == 0
    const dashUrl = useDashboardUrl()

    if(disable) {
        return (
            <button className="button is-primary" disabled>Dashboard</button>
        )
    }

    return (
        <a href={dashUrl} className="button is-primary" target="_blank"
           rel="noopener noreferrer">
            Dashboard
        </a>
    )
}

const OptionsButton = () => {

    const location = useLocation()
    
    const to = location.pathname === "/" ? "/options" : "/"
    const text = location.pathname !== "/" ? "Home" : "Options"

    return (
        <Link to={to} className="button is-dark is-outlined">
            {text}
        </Link>
    )
}

const ClearButton = (props) => {
    const dispatch = useDispatch()

    const clear = () => {
        dispatch(unselectAllParams())
        dispatch(setFilterText({filterText: ""}))
        dispatch(setOrdinateAxis('utc_time'))
    }

    return (
        <a className="button is-info is-outlined" onClick={clear}>
            Clear
        </a>
    )
}

const NavbarMenu = (props) => {

    const navbarClass = props.active ? "navbar-menu is-active" : "navbar-menu"
    const filterText = useSelector(state => state.paramfilter.filterText)

    return(
        <div id="navbar" className={navbarClass}>
            <div className="navbar-start">
                <NavSearchInput filterText={filterText} />
                <NavTimeFrameSelector />
                <PresetSelector />  
                <ViewsSelector />
            </div>

            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <ClearButton />
                        <OptionsButton />
                        <PlotButton />
                        <TephiButton />
                        <DashButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Navbar = (props) => {
    const [active, setActive] = useState(false)

    const toggleActive = () => {
        setActive(!active)
    }

    const burgerClass = active ? "navbar-burger is-active" : "navbar-burger"

    return (
        <>
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                
                <a  role="button" className={burgerClass} 
                    aria-label="menu" aria-expanded="false" 
                    data-target="navbar" onClick={toggleActive}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <NavbarMenu active={active} />
            
        </nav>
        <Outlet />
        </>
    )
}

export default Navbar
