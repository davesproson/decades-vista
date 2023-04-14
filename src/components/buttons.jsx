import { Link } from "react-router-dom"
import { PropTypes } from "prop-types"

/**
 * A Simple button component. The button can be a link, a div, react router Link or a button.
 * 
 * @param {Object} props - The props for the component
 * @param {string} props.kind - The kind of button. Can be "primary", "secondary", "danger", "success" etc
 * @param {boolean} props.outlined - Whether the button is outlined
 * @param {boolean} props.fullWidth - Whether the button is full width
 * @param {boolean} props.small - Whether the button is small
 * @param {boolean} props.anchor - Whether the button is an anchor
 * @param {boolean} props.div - Whether the button is a div
 * @param {boolean} props.rrLink - Whether the button is a react router link
 * @param {Object} props.children - The children of the button
 * @param {Object} props.rest - The rest of the props to pass to the element
 * 
 * @component
 * @example
 * <Button>My Button</Button>
 */
const Button = ({kind, outlined, fullWidth, small, anchor, div, rrLink, children, ...rest}) => {

    // Build the class name
    let buttonClass = "button"
    if(kind) buttonClass += ` is-${kind}`
    if(outlined) buttonClass += " is-outlined"
    if(fullWidth) buttonClass += " is-fullwidth"
    if(small) buttonClass += " is-small"

    // Return the correct element
    // ...an anchor
    if(anchor) {
        return (
            <a className={buttonClass} {...rest} role="button">{children}</a>
        )
    }

    //...a div
    if(div) {
        return (
            <div className={buttonClass} {...rest} role="button">{children}</div>
        )
    }

    //...a react router link
    if(rrLink) {
        return (
            <Link className={buttonClass} {...rest} role="button">{children}</Link>
        )
    }

    //...a button
    return (
        <button className={buttonClass} {...rest} >{children}</button>
    )
}
Button.propTypes = {
    kind: PropTypes.string,
    outlined: PropTypes.bool,
    fullWidth: PropTypes.bool,
    small: PropTypes.bool,
    anchor: PropTypes.bool,
    div: PropTypes.bool,
    rrLink: PropTypes.bool,
    children: PropTypes.node.isRequired
}

// A partial application of the button component to create a primary button
const Primary = (props) => {
    return (
        <Button kind="primary" {...props} />
    )
}

// A partial application of the button component to create a secondary button
const Secondary = (props) => {
    return (
        <Button kind="secondary" {...props} />
    )
}   

// A partial application of the button component to create a danger button
const Danger = (props) => {
    return (
        <Button kind="danger" {...props} />
    )
}

// A partial application of the button component to create a success button
const Success = (props) => {
    return (
        <Button kind="success" {...props} />
    )
}

// A partial application of the button component to create a warning button
const Warning = (props) => {
    return (
        <Button kind="warning" {...props} />
    )
}

// A partial application of the button component to create a info button
const Info = (props) => {
    return (
        <Button kind="info" {...props} />
    )
}

// A partial application of the button component to create a light button
const Light = (props) => {
    return (
        <Button kind="light" {...props} />
    )
}

// A partial application of the button component to create a dark button
const Dark = (props) => {
    return (
        <Button kind="dark" {...props} />
    )
}

// Export the button component
Button.Primary = Primary
Button.Secondary = Secondary
Button.Danger = Danger
Button.Success = Success
Button.Warning = Warning
Button.Info = Info
Button.Light = Light
Button.Dark = Dark

export { Button }