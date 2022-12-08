
import { usePlotUrl } from './hooks';
import { PlotOptionCard } from './plotOptions';
import { AxisOptionsCard } from './axisOptions';

const AddressBar = () => {
    const address = usePlotUrl()
    return (
        <input className="input" type="text" value={address} readOnly />
    )
}

const Options = () => {
    return (
        <div className="section">
            <AddressBar />
            <PlotOptionCard />
            <AxisOptionsCard />
        </div>

    )
}

export { Options }