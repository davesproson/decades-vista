import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setParams } from "./redux/parametersSlice";

const useParameters = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        fetch("http://192.168.101.108/live/parano.json")
            .then(response => response.json())
            .then(data => {
                dispatch(setParams(data));
            });
    }, [])
}

const usePlotUrl = () => {
    const [plotUrl, setPlotUrl] = useState("");

    const plotOptions = useSelector(state => state.options);
    const vars = useSelector(state => state.vars);
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
            `http://${plotOptions.server.ip}/decades-viz/viz/plot?`
            + `timeframe=30min`
            + `&params=${selectedParams.join(',')}`
            + axisArgs
            + `&swapxy=${plotOptions.swapOrientation}`
            + `&scrolling=${plotOptions.scrollingWindow}`
            + `&data_header=${plotOptions.dataHeader}`
            + `&style=${plotOptions.plotStyle.value}`
            + `&ordvar=${plotOptions.ordinateAxis}`
            + `&server=${plotOptions.server.ip}`
        );
    }, [plotOptions, params])

    return plotUrl;
}

export { usePlotUrl, useParameters }