import { encode } from 'base-64';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
    addColumn, addRow, removeColumn, removeRow, setPlot, reset, saveView, setConfig 
} from '../redux/viewSlice'
import { usePlotUrl } from '../hooks'
import { useRef, useState } from 'react';


const useViewUrl = () => {
    const ViewConfig = useSelector(s => s.view)
    const nRows = ViewConfig.nRows
    const nCols = ViewConfig.nCols
    const plots = ViewConfig.plots
    const encodedPlots = plots.map(x => encode(x))
    let url = `/view?nRows=${nRows}&nCols=${nCols}`
    for (let eurl of encodedPlots) {
        url += `&plot=${eurl}`
    }

    return url
}

const ViewConfigButtons = (props) => {
    const dispatch = useDispatch()
    const viewState = useSelector(s => s.view)
    const viewUrl = useViewUrl()
    const ref = useRef(null)
    const [saveModalActive, setSaveModalActive] = useState(false)

    const download = () => {
        const json = {
            config: {
                nRows: viewState.nRows,
                nCols: viewState.nCols,
            },
            plots: [...viewState.plots],
            version: 2
        }

        const element = document.createElement("a");
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(json)));
        element.setAttribute('download', "view-config.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const showFileSelect = () => {
        ref.current.click()
    }

    const parseV2 = (json) => {
        const nRows = json.config.nRows
        const nCols = json.config.nCols
        const plots = json.plots
        dispatch(setConfig({ nRows, nCols, plots }))
    }

    const importView = (e) => {
        const parseMap = {
            1: () => alert("Version 1 not supported"),
            2: parseV2
        }
        const selectedFile = e.target.files[0]
        if (!selectedFile) {
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            const json = JSON.parse(text)
            const version = json.version || 1
            parseMap[version](json)
        }
        reader.readAsText(selectedFile)
    }

    return (
        <>
            <div className="field is-grouped is-expanded">
                <Link to={viewUrl} className="button is-info is-fullwidth" target="_blank">Plot</Link>
            </div>
            <div className="field is-grouped is-expanded">
                <p className="control is-expanded">
                    <button className="button is-outlined is-primary is-fullwidth" onClick={()=>setSaveModalActive(true)}>
                        Save
                    </button>
                </p>
                <p className="control is-expanded">
                    <span className="button  is-outlined is-primary is-fullwidth" onClick={showFileSelect}>
                        Import <input ref={ref} type="file" style={{ display: "none" }} onChange={importView} />
                    </span>
                </p>
                <p className="control is-expanded">
                    <button className="button  is-outlined is-primary is-fullwidth" onClick={download}>
                        Export
                    </button>
                </p>
                <p className="control is-expanded">
                    <button className="button is-outlined is-secondary is-fullwidth" onClick={() => dispatch(reset())}>
                        Reset
                    </button>
                </p>
            </div>
            <SaveModal active={saveModalActive} close={()=>setSaveModalActive(false)}/>
        </>
    )
}

const PlotInputBlock = (props) => {
    const dispatch = useDispatch()
    const url = useSelector(s => s.view.plots)
    const plotUrl = usePlotUrl()

    const onChange = (e) => {
        dispatch(setPlot({ index: props.n, url: e.target.value }))
    }

    const onUseCurrentConfig = (e) => {
        dispatch(setPlot({ index: props.n, url: plotUrl }))
    }

    return (
        <div className="panel-block">
            <div className="field is-grouped is-flex-grow-1">
                <p className="control is-expanded">
                    <input className="input" type="text" value={url[props.n]}
                        onChange={onChange} placeholder="Plot URL..." />
                </p>
                <p className="control">
                    <button className="button is-info" onClick={onUseCurrentConfig}>
                        Use current config
                    </button>
                </p>
            </div>
        </div>
    )
}

const ViewConfigPlotSelector = (props) => {
    const plots = useSelector(s => s.view.plots)

    return (

        <div className="panel mt-2">
            <p className="panel-heading">
                Plot Configurations
            </p>
            {plots.map((url, i) => <PlotInputBlock key={i} n={i} url={url} />)}


        </div>

    )
}

const SaveModal = (props) => {
    const dispatch = useDispatch()
    const viewState = useSelector(s => s.view)
    const [viewName, setViewName] = useState("")

    const active = props.active;
    const modalClass = active ? "modal is-active" : "modal"
    const close = props.close

    const save = () => {
        const savedView = {
            plots: [...viewState.plots],
            nRows: viewState.nRows,
            nCols: viewState.nCols,
            name: viewName,
            id: new Date().getTime()
        }
        dispatch(saveView(savedView))
        setViewName("")
        close()
    }

    const onViewNameChange = (e) => {
        setViewName(e.target.value)
    }

    const checkKey = (e) => {
        if (e.key === "Enter") {
            save()
        }
    }

    return (
        <div className={modalClass}>
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <p className="is-size-5 mb-2">Save Current View</p>
                    <input className="input" type="text" value={viewName} onKeyDown={checkKey} onChange={onViewNameChange} placeholder="View Name" />
                    <div className="field is-grouped mt-2">
                        <div className="control is-expanded">
                    <button className="button is-primary is-fullwidth" onClick={save}>Save</button>
                    </div>
                    <div className="control is-expanded">
                    <button className="button is-secondary is-fullwidth" onClick={close}>Cancel</button>
                    </div>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={close}></button>
        </div>
    )
}

const ViewConfigNumSelector = (props) => {

    const value = useSelector(props.selector)
    const dispatch = useDispatch()

    const add = () => dispatch(props.reducers[0]())
    const remove = () => dispatch(props.reducers[1]())

    return (
        <div className="column is-6">
            <div className="field is-grouped">
                <div className="control">
                    <label className="label mt-2">{props.dim}</label>
                </div>
                <div className="control">
                    <input className="input" type="text" value={value} readOnly />
                </div>
                <div className="field has-addons">
                    <div className="control">
                        <button className="button is-outlined is-primary" onClick={add}>+</button>
                    </div>
                    <div className="control">
                        <button className="button is-outlined is-primary" onClick={remove}>-</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ViewConfig = (props) => {

    return (
        <div className="container has-navbar-fixed-top">
            <div className="panel mt-2">
                <p className="panel-heading">
                    View Configuration
                </p>

                <div className="panel-block">
                    <div className="columns">
                        <ViewConfigNumSelector dim="Rows" selector={s => s.view.nRows}
                            reducers={[addRow, removeRow]} />

                        <ViewConfigNumSelector dim="Columns" selector={s => s.view.nCols}
                            reducers={[addColumn, removeColumn]} />
                    </div>
                </div>
            </div>
            <ViewConfigPlotSelector />
            <ViewConfigButtons />
        </div>
    )
}


export default ViewConfig