import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setParams } from "./redux/parametersSlice";
import { setServer } from "./redux/optionsSlice";

const serverPrefix = "http://192.168.101.108/"

const useParameters = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`${serverPrefix}live/parano.json`)
            .then(response => response.json())
            .then(data => {
                dispatch(setParams(data));
            });
    }, [])
}

const useServers = () => {
    const [servers, setServers] = useState([]);
    const serverState = useSelector(state => state.options.server);
    const dispatch = useDispatch();
    console.log('userServers')

    useEffect(() => {
        fetch(`${serverPrefix}tank_status`)
            .then(response => response.json())
            .then(data => {
                const reportedServers = data.topo.secondaries
                reportedServers.push(data.topo.primary)
                setServers(reportedServers);
                if(!serverState) {
                    const serverToSet = reportedServers.sort(() => .5 - Math.random())[0]
                    dispatch(setServer(serverToSet))
                }
            })
        }, [])
    
    return servers;

}

const usePlotUrl = () => {
    const [plotUrl, setPlotUrl] = useState("");

    const plotOptions = useSelector(state => state.options);
    const vars = useSelector(state => state.vars);
    const server = useSelector(state => state.options.server);

    const timeframe = plotOptions.timeframes.find(x=>x.selected).value;
    const params = vars.params
    const axes = {}
    for(const ax of vars.axes) {
        axes[ax.id] = []
    }

    for(const param of params.filter(x=>x.selected)) {
        axes[param.axisId].push(param.raw)
    }

    const axisStrings = Object.values(axes).filter(x=>x.length).map(x=>x.join(','))

    const selectedParams = params.filter(param => param.selected)
                                 .map(param => param.raw)


    useEffect(() => {
        let axisArgs = ""
        for(const axStr of axisStrings) {
            axisArgs += `&axis=${axStr}`
        }

        setPlotUrl(
            `http://${server}/decades-viz/viz/plot?`
            + `timeframe=${timeframe}`
            + `&params=${selectedParams.join(',')}`
            + axisArgs
            + `&swapxy=${plotOptions.swapOrientation}`
            + `&scrolling=${plotOptions.scrollingWindow}`
            + `&data_header=${plotOptions.dataHeader}`
            + `&style=${plotOptions.plotStyle.value}`
            + `&ordvar=${plotOptions.ordinateAxis}`
            + `&server=${server}`
        );
    }, [plotOptions, params])

    return plotUrl;
}

export { usePlotUrl, useParameters, useServers }