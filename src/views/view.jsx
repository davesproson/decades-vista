import { useSearchParams } from 'react-router-dom'
import { decode } from 'base-64';

const View = () => {
    const [searchParams, _] = useSearchParams();
    const encodedUrls = searchParams.getAll('plot')
    const urls = encodedUrls.map(url => decode(url))
    const nRows = parseInt(searchParams.get('nRows')) || urls.length
    const nCols = parseInt(searchParams.get('nCols')) || 1

    const width = `${99 / nCols}%`
    const height = `${99 / nRows}%`

    return (
        <div style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute' }}>
            {urls.map((url, i) => {
                return (
                    <iframe key={i} src={url} scrolling="no" width={width} frameBorder="0"
                        height={height} />
                )
            })}
        </div>
    )
}

export default View