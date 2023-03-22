import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { JsonEditor } from "../components/jsonEditor"
import { setAdvancedConfig, setAdvancedConfigSaved } from "../redux/viewSlice"

const checkValid = (text) => {
    try {
        JSON.parse(text)
    } catch (e) {
        return false
    }
    return true
}

const onLaunch = (text) => {
    localStorage.setItem("viewConfig", JSON.stringify(JSON.parse(text)))
}

const JsonViewConfig = () => {
    const initialText = useSelector(s => s.view.advancedConfig)
    const [text, setText] = useState(JSON.stringify(initialText, null, 2))
    const dispatch = useDispatch()

    const checkAndSetText = (text) => {
        setText(text)
        if(checkValid(text)) {
            dispatch(setAdvancedConfig(JSON.parse(text)))
            dispatch(setAdvancedConfigSaved(true))
        }
    }

    return  <JsonEditor display={true} 
                        text={text}
                        title={"View Editor"}
                        onEdit={checkAndSetText}
                        checkValid={checkValid}
                        getUrl={()=>"jsonview"} 
                        openExternal={true}
                        onLaunch={onLaunch} />
}

export { JsonViewConfig }