
import { usePlotUrl } from '../plot/hooks';
import { PlotOptionCard } from './plotOptions';
import { AxisSelectionCard, AxisScalingCard } from './axisOptions';
import { Button } from '../components/buttons';

/**
 * This is a horrible name for a component. It's the little text box that displays the url
 * for the plot.
 * 
 * @returns {JSX.Element}
 */
const AddressBar = () => {
    const address = usePlotUrl()
    return (
        <div className="field has-addons">
            <div className='control is-flex-grow-1'>
                <input className="input" type="text" value={address} readOnly />
            </div>
            <div className='control'>
                <Button.Info onClick={() => navigator.clipboard.writeText(address)}>Copy</Button.Info>
            </div>
        </div>
    )
}

/**
 * The options page. This is the page that displays the plot options, axis options, and
 * the address bar.
 * 
 * @returns {JSX.Element}
 */
const Options = () => {
    return (
        <div className="container has-navbar-fixed-top">
            <div className="section">
                <AddressBar />
                <PlotOptionCard />
                <AxisSelectionCard />
                <AxisScalingCard />
            </div>
        </div>
    )
}

export default Options 