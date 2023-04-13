export const GroupedField = (props) => {
    return (
        <div className="field is-grouped">
            {props.children}
        </div>
    )
}

export const Field = (props) => {
    return (
        <div className="field">
            {props.children}
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