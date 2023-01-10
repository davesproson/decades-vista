import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useTutorialAction = (action, dispatched, clear) => {
    const dispatch = useDispatch()
    if(!action) action = () => {}
    useEffect(action, [])
    useEffect(() => {
        if(!dispatched?.length) return
        for(let d of dispatched) {
            dispatch(d())
        }
        return () => {
            if(!clear?.length) return
            for(let c of clear) {
                dispatch(c())
            }
        }
    }, [])
}

export { useTutorialAction }