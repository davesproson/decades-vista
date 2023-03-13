import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { base as siteBase } from '../settings'
import { getData } from '../plot/plotUtils';

const useDashboardUrl = () => {
    const params = useSelector(state => state.vars.params);
    const options = useSelector(state => state.options);
    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const server = options.server
    return origin + `${siteBase}dashboard?params=${selectedParams.join(',')}&server=${server}`
}

const useDashboardData = (dataOptions) => {
    const [data, setData] = useState({})

    useEffect(() => {
        getData(dataOptions).then(data => setData(data))
                            .catch(() => setData([]))
                            
        const interval = setInterval(() => {
            getData(dataOptions).then(data => setData(data))
                                .catch(() => setData([]))
        }, 1000)
        return () => clearInterval(interval)
    }, [setData])

    return data
}

export { useDashboardUrl, useDashboardData }