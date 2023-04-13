/**
 * A tag that displays a boolean value as a green or red tag.
 * 
 * @param {boolean} value - The value to be displayed. If true, the tag will be green, 
 *                          if false, the tag will be red.
 * @param {string} text - The text to be displayed in the tag.
 * 
 * @returns {JSX.Element} A tag with the text and color corresponding to the value.
 * 
 * @component
 * @example
 * return (
 * <BooleanTag value={true} text="True" />
 * )
 */
export const BooleanTag = ({ value, text }) => {
    const tagClass = value ? "tag is-success" : "tag is-danger"
    if(!text) {
        text = value ? "True" : "False"
    }
    return <span className={tagClass}>{text}</span>
}

/**
 * Renders a tag with the given text and color.
 * 
 * @param {string} text - The text to be displayed in the tag.
 * @param {string} is - The color of the tag. Can be any of the colors in Bulma.
 * @param {string} extraClasses - Any extra classes to be added to the tag.
 * 
 * @returns {JSX.Element} A tag with the text and color corresponding to the value.
 * 
 * @component
 * @example
 * return (
 * <Tag text="Tag" is="success" extraClasses="is-light" />
 * )
 */
export const Tag = ({ text, is, extraClasses }) => {
    const tagClass = `tag is-${is} ${extraClasses}`
    return <span className={tagClass}>{text}</span>
}

