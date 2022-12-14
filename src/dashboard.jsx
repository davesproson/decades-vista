import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const DashPanel = (props) => {
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
                    {props.param.name}
                </h3>
                <span className="p-3 is-flex is-justify-content-center is-size-1">
                    {dataVal} {props.param.units}
                </span>
            </div>
        </div>
    )
}



const Dashboard = () => {
    const [searchParams, _] = useSearchParams();
    let availableParams = useSelector(state => state.vars.params)
    const parameters = searchParams.get("params").split(",")
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = () => {
            const end = Math.floor(new Date().getTime() / 1000) - 1
            const start = end - 5

            let url = `http://192.168.101.108/livedata?frm=${start}&to=${end}`
            for (const para of parameters) {
                url += `&para=${para}`
            }

            fetch(url)
                .then(result => result.json())
                .then(data => setData(data))
        }
        
        fetchData()
        const interval = setInterval(fetchData, 1000)
        return () => clearInterval(interval)
    }, [setData])

    if(!availableParams) return null

    availableParams = availableParams.filter(x=>parameters.includes(x.raw))

    return (
        <div className="is-flex is-flex-wrap-wrap is-justify-content-center">
            {availableParams.map(x => <DashPanel key={x.raw} param={x} value={data[x.raw]}/>)}
        </div>
  
    )
}

export { Dashboard }