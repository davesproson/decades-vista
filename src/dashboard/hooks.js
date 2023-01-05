import { useSelector } from 'react-redux'
import { base as siteBase } from '../settings'

const useDashboardUrl = () => {
    const params = useSelector(state => state.vars.params);
    const options = useSelector(state => state.options);
    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const server = options.server
    return origin + `${siteBase}dashboard?params=${selectedParams.join(',')}&server=${server}`
}

export { useDashboardUrl }