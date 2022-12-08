import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const usePlotUrl = () => {
    const [plotUrl, setPlotUrl] = useState("");

    const plotOptions = useSelector(state => state.options);
    const params = useSelector(state => state.params);

    const selectedParams = params.filter(param => param.selected)
                                 .map(param => param.raw)
    
    useEffect(() => {
        setPlotUrl(
            `http://${plotOptions.server.ip}/decades-vista/plot?`
            + `timeframe=30min`
            + `&params=${selectedParams.join(',')}`
            + `&swapxy=${plotOptions.swapOrientation}`
            + `&scrolling=${plotOptions.scrollingWindow}`
            + `&data_header=${plotOptions.dataHeader}`
            + `&style=${plotOptions.plotStyle.value}`
            + `&ordvar=${plotOptions.ordinateAxis}`
            + `&server=${plotOptions.server.ip}`
        );
    }, [plotOptions, params])

    // if (selectedParams.length === 0) {
    //     return "No parameters selected!";
    // }

    return plotUrl;
}

export { usePlotUrl }