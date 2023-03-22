const JsonEditor = (props) => {

    if (!props.display) return null

    const checkValid = () => {
        try {
            JSON.parse(props.text)
        } catch (e) {
            return false
        }
        if(props.checkValid) return props.checkValid(props.text)
        return true
    }

    const jsonChanged = (e) => {
        const json = e.target.value
        props.onEdit(json)
    }

    const getUrl = () => {
        if(props.getUrl) return props.getUrl(props.text)
        return null
    }

    const onLaunch = () => {
        if (!checkValid()) return null
        if(props.onLaunch) return props.onLaunch(props.text)
        return null
    }
 
    const bgClass = checkValid(props.text) ? "has-background-success-light" : "has-background-danger-light"


    return (
        <article className="message is-dark">
            <div className="message-header">
                <p>Alarm Editor</p>
            </div>
            <div className="message-body">
                <div className="block">
                    <div className="field">
                        <div className="control">
                            <textarea className={`textarea ${bgClass}`}
                                      type="text"
                                      placeholder="Type your json here..."
                                      rows={20}
                                      value={props.text} 
                                      style={{fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"}}
                                      onChange={jsonChanged} />
                        </div>
                    </div>
                </div>
                <div className="block">
                    <a className="button is-primary is-fullwidth" 
                            href={getUrl()}
                            disabled={!checkValid(props.text)}
                            target={props.openExternal ? "_blank" : null}
                            onClick={onLaunch}>
                        Launch
                    </a>
                </div>  
            </div>
        </article>
    )
}

export { JsonEditor }