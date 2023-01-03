
import { usePlotUrl } from './hooks';
import { PlotOptionCard } from './plotOptions';
import { AxisOptionsCard } from './axisOptions';

const AddressBar = () => {
    const address = usePlotUrl()
    return (
        <div className="field has-addons">
            <div className='control is-flex-grow-1'>
                <input className="input" type="text" value={address} readOnly />
            </div>
            <div className='control'>
                <button className="button is-info" onClick={() => navigator.clipboard.writeText(address)}>Copy</button>
            </div>
        </div>
    )
}

const Options = () => {
    return (
        <div className="container has-navbar-fixed-top">
            <div className="section">
                <AddressBar />
                <PlotOptionCard />
                <AxisOptionsCard />
            </div>
        </div>
    )
}

export default Options 