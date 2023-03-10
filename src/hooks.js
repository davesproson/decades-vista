import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setParams, setParamStatus } from "./redux/parametersSlice";
import { setServer } from "./redux/optionsSlice";
import { 
    serverPrefix, serverProtocol, apiEndpoints, apiTransforms, badData, base as siteBase
} from "./settings";
import { getData } from "./plot/plotUtils";

const useTransform = (name) => {
    if(apiTransforms[name]) return apiTransforms[name];
    return (data) => data;
}

let parametersDispatched = false;
const useDispatchParameters = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {
        if(parametersDispatched) return;
        fetch(`${apiEndpoints.parameter_availability}`)
            .then(response => response.json())
            .then(data => {
                data = useTransform('parameters')(data)
                dispatch(setParams(data))
                parametersDispatched = true
            })
        }, [])
}

const useGetParameters = () => {
    const [params, setParams] = useState(null);

    useEffect(() => {
        fetch(`${apiEndpoints.parameters}`)
            .then(response => response.json())
            .then(data => useTransform('parameters')(data))
            .then(data => {
                setParams(data);
            })
            .catch((e) => {
                console.log("Error fetching parameters")
            })
    }, [setParams])

    return params
}

const useServers = () => {
    const [servers, setServers] = useState([]);
    const serverState = useSelector(state => state.options.server);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`${apiEndpoints.tank_status}`)
            .then(response => response.json())
            .then(data => useTransform('tank_status')(data))
            .then(data => {
                const reportedServers = data.topo.secondaries
                reportedServers.push(data.topo.primary)
                setServers(reportedServers);
                if(serverState === null) {
                    const serverToSet = reportedServers.sort(() => .5 - Math.random())[0]
                    dispatch(setServer(serverToSet))
                }
            })
            .catch((e) => {   
                console.log("Error fetching servers")
                dispatch(setServer(null))
            })   
            
        }, [])
    
    return servers;

}

export { 
    useDispatchParameters, useServers, useGetParameters
}