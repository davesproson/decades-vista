const Button = ({kind, outlined, fullWidth, children, ...rest}) => {
    let buttonClass = "button"
    if(kind) buttonClass += ` is-${kind}`
    if(outlined) buttonClass += " is-outlined"
    if(fullWidth) buttonClass += " is-fullwidth"

    return (
        <button className={buttonClass} {...rest} >{children}</button>
    )
}

const Primary = (props) => {
    return (
        <Button kind="primary" {...props} />
    )
}

const Secondary = (props) => {
    return (
        <Button kind="secondary" {...props} />
    )
}   

const Danger = (props) => {
    return (
        <Button kind="danger" {...props} />
    )
}

const Success = (props) => {
    return (
        <Button kind="success" {...props} />
    )
}

const Warning = (props) => {
    return (
        <Button kind="warning" {...props} />
    )
}

const Info = (props) => {
    return (
        <Button kind="info" {...props} />
    )
}

const Light = (props) => {
    return (
        <Button kind="light" {...props} />
    )
}

const Dark = (props) => {
    return (
        <Button kind="dark" {...props} />
    )
}

Button.Primary = Primary
Button.Secondary = Secondary
Button.Danger = Danger
Button.Success = Success
Button.Warning = Warning
Button.Info = Info
Button.Light = Light
Button.Dark = Dark

export { Button }