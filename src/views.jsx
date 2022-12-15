
import { useSelector, useDispatch } from 'react-redux'
import { addColumn, addRow, removeColumn, removeRow, setPlot, reset, saveView  } from './redux/viewSlice'
import { usePlotUrl } from './hooks'


const ViewConfigButtons = (props) => {
    const dispatch = useDispatch()
    const viewState = useSelector(s => s.view)

    const save = () => {
        const savedView = {
            plots: [...viewState.plots],
            nRows: viewState.nRows,
            nCols: viewState.nCols,
            name: "This is a test plot"
        }
        dispatch(saveView(savedView))
    }

    return (
        <>
            <div className="field is-grouped is-expanded">
                <button className="button is-info is-fullwidth">Plot</button>
            </div>
            <div className="field is-grouped is-expanded">
                <p className="control is-expanded">
                    <button className="button is-outlined is-primary is-fullwidth" onClick={save}>
                        Save
                    </button>
                </p>
                <p className="control is-expanded">
                    <button className="button  is-outlined is-primary is-fullwidth">Import</button>
                </p>
                <p className="control is-expanded">
                    <button className="button  is-outlined is-primary is-fullwidth">Export</button>
                </p>
                <p className="control is-expanded">
                    <button className="button is-outlined is-secondary is-fullwidth" onClick={()=>dispatch(reset())}>
                        Reset
                    </button>
                </p>
            </div>
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
        <div className="container">
            <div className="panel mt-2">
                <p className="panel-heading">
                    View Configuration
                </p>

                <div className="panel-block">
                    <div className="columns">
                        <ViewConfigNumSelector dim="Rows" selector={s => s.view.nCols}
                            reducers={[addColumn, removeColumn]} />

                        <ViewConfigNumSelector dim="Columns" selector={s => s.view.nRows}
                            reducers={[addRow, removeRow]} />
                    </div>
                </div>



            </div>

            <ViewConfigPlotSelector />
            <ViewConfigButtons />
        </div>
    )
}

export default ViewConfig