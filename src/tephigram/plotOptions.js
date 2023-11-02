export const getPlotlyTephiOptions = (darkMode) => {
    const layout = {
        margin: {t: 0, l: 0, r: 0, b: 0},   
        plot_bgcolor: darkMode ? "black" : "white",
        paper_bgcolor: darkMode ? "black" : "white",
        legend: {   
            font: { 
                size: 8,   
                color: darkMode ? "white" : "black"
            },  
            x: 0,   
            y: 0,
            bgcolor: darkMode ? "black" : "white",
        },  
        
        hoverinfo: 'none',  
        yaxis: {    
            range: [1678, 1820],    
            showline: false,    
            ticks: '',  
            showgrid: false,    
            showticklabels: false   
        },  
        xaxis: {    
            range: [1600, 1780],    
            showline: false,    
            ticks: '',  
            showgrid: false,    
            showticklabels: false   
        }   
    }

    const config = {
        responsive: true,
        displaylogo: false,
        displayModeBar: false
    }

    return [layout, config]
}

export const getEmptyDataTrace = (name, index) => {
    const colors = [
        "#0000aa", "#00aa00", "#aa0000", "#00aaaa", "#aa00aa"
    ]

    return {
        x: [],
        y: [],
        showlegend: true,
        mode: 'lines',
        hoverinfo: 'none',
        name: name,
        line: {
            width: 5,
            color: colors[index%colors.length]
        }
    }
}