export const GroupedField = (props) => {
    return (
        <div className="field is-grouped">
            {props.children}
        </div>
    )
}

export const Field = ({children, addons, grouped, expanded}) => {
    let fieldClass = "field"
    if(addons) fieldClass += " has-addons"
    if(grouped) fieldClass += " is-grouped"
    if(expanded) fieldClass += " is-expanded"

    return (
        <div className={fieldClass}>
            {children}
        </div>
    )
}

export const Input = (props) => {
    return (
        <div className="control">
            <input  className="input" 
                    {...props} />
        </div>
    )
}

export const FieldInput = (props) => {
    return (
        <Field>
            <Input {...props} />
        </Field>
    )
}

export const Control = ({children, expanded}) => {
    let controlClass = "control"
    if(expanded) controlClass += " is-expanded"

    return (
        <div className={controlClass}>
            {children}
        </div>
    )
}

export const Label = ({children}) => {
    return (
        <label className="label">
            {children}
        </label>
    )
}