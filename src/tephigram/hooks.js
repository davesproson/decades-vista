import { useSelector } from "react-redux"
import { base as siteBase } from "../settings"

const useTephiUrl = () => {
    const params = useSelector(state => state.vars.params);
    const plotOptions = useSelector(state => state.options);
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);

    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const server = plotOptions.server
    
    let timeframe = ""
    if(useCustomTimeframe) {

    } else {
        timeframe = plotOptions.timeframes.find(x=>x.selected).value;
    }
    
    return origin + `${siteBase}tephigram?params=${selectedParams.join(',')}&timeframe=${timeframe}&server=${server}`
}

const useTephiAvailable = () => {
    const params = useSelector(state => state.vars.params);
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    
    const required_temps = [
        'deiced_true_air_temp_c', 'nondeiced_true_air_temp_c'
    ]

    const required_humids = [
        'dew_point'
    ]

    let has_required_temps = false
    let has_required_humids = false

    for(const param of selectedParams) {
        if(!required_humids.includes(param) && !required_temps.includes(param)) {
            return false
        }
        if(required_temps.includes(param)) {
            has_required_temps = true
        }
        if(required_humids.includes(param)) {
            has_required_humids = true
        }
    }

    return has_required_temps && has_required_humids
}

export {
    useTephiUrl, useTephiAvailable
}