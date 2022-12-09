import { useDispatch } from "react-redux"
import { useState } from "react"
import { setFilterText } from "./redux/filterSlice"
import { Link, useLocation } from "react-router-dom"
import { unselectAllParams } from "./redux/parametersSlice"
import { setTimeframe } from "./redux/optionsSlice"
import { useSelector } from "react-redux"

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

    const dispatch = useDispatch()

    const timeframes = useSelector(state => state.options.timeframes)
    const timeFrameElements = timeframes.map(x => {
    const active = x.selected ? "has-text-success is-underlined" : ""

    const onSetTimeframe = (e) => {
        dispatch(setTimeframe({value: e}))
    }

    return (
        <a className="navbar-item" key={x.value} onClick={()=>onSetTimeframe(x.value)}>
            <span className={active}>{x.label}</span>
        </a>
    )
    })

    return (
        <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
                Timeframe
            </a>

            <div className="navbar-dropdown">
                {timeFrameElements}
            </div>
        </div>
    )
}

const PresetSelector = (props) => {
    return (
        <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
                Presets
            </a>
        </div>
    )
}

const ViewsSelector = (props) => {
    return (
        <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
                Views
            </a>
            <div className="navbar-dropdown">
                <Link to="/config-view"  className="navbar-item">
                    Config...
                </Link>
                <hr className="navbar-divider" />
            </div>
        </div>
    )
}

const PlotButton = (props) => {

    
    return (
        <a href="plot/" className="button is-primary" >
            Plot
        </a>
    )
}

const TephiButton = (props) => {
    return (
        <a className="button is-primary " disabled>
            Tephigram
        </a>
    )
}

const DashButton = (props) => {
    return (
        <a className="button is-primary">
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
    )
}

export default Navbar
