import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getData } from "./plotUtils";
import { useDispatchParameters, useGetParameters } from "./hooks";

const LargeDashPanel = (props) => {
    let dataVal = props?.value?.filter(x=>x != null)?.reverse()[0]?.toFixed(2)


    return (
        <div className="m-4 is-flex is-justify-content-center is-flex-grow-1" style={{
            border: "1px solid black",
            borderRadius: "5px"
        }}>
            <div className="is-flex is-flex-direction-column is-flex-grow-1" >
                <h3 className="p-3 is-uppercase is-justify-content-center is-flex-grow-1 is-flex" style={{
                    background: "#252243",
                    color: "#0abbef",
                    borderBottom: "1px solid black"
                }}>
                    {props.param.DisplayText}
                </h3>
                <span className="p-3 is-flex is-justify-content-center is-size-1">
                    {dataVal} {props.param.DisplayUnits}
                </span>
            </div>
        </div>
    )
}

const SmallDashPanel = (props) => {
    let dataVal = props?.value?.filter(x=>x != null)?.reverse()[0]?.toFixed(2)

    return (
        <div className="m-1 is-flex is-justify-content-center is-flex-grow-1" style={{
            border: "1px solid black",
            borderRadius: "5px"
        }}>
            <div className="is-flex is-flex-direction-row is-flex-grow-1" >
                <h3 className="is-uppercase is-justify-content-center is-flex-grow-1 is-flex is-size-7" style={{
                    // background: "#252243",
                    // color: "#0abbef",
                    // borderBottom: "1px solid black"
                }}>
                    {props.param.DisplayText}
                </h3>
                <span className="is-flex is-justify-content-center is-size-7 is-flex-grow-1">
                    {dataVal} {props.param.DisplayUnits}
                </span>
            </div>
        </div>
    )
}

const DashPanel = (props) => {
    if(props.size == "large") {
        return <LargeDashPanel {...props} />
    } else {
        return <SmallDashPanel {...props} />
    }
}



const Dashboard = () => {
    
    const [searchParams, _] = useSearchParams();
    const availableParams = useGetParameters()
    const parameters = searchParams.get("params").split(",")
    const isCompact = searchParams.get("compact") == "true"
    const size = isCompact ? "small" : "large"
    const [data, setData] = useState({})

    useEffect(() => {
        const end = Math.floor(new Date().getTime() / 1000) - 1
        const start = end - 5

        getData({params: parameters}, start, end).then(data => setData(data))
        const interval = setInterval(() => {
            const end = Math.floor(new Date().getTime() / 1000) - 1
            const start = end - 5
            getData({params: parameters}, start, end).then(rdata => setData(rdata))
        }, 1000)
        return () => clearInterval(interval)
    }, [setData])

    if(!availableParams) return null

    const filteredParams = availableParams.filter(x=>{
        return parameters.includes(x.ParameterName)
    })

    return (
        <div className="is-flex is-flex-wrap-wrap is-justify-content-center">
            {filteredParams.map(x => <DashPanel size={size} 
                                                key={x.ParameterName}
                                                param={x}
                                                value={data[x.ParameterName]}/>)}
        </div>
  
    )
}

export default Dashboard