export const serverPrefix = "https://www.faam.ac.uk"

export const badData = -999.99

export const apiEndpoints = {
    'parameters': '/livedata/parano.json',
    'data': '/livedata/livejson?db=1',
}

export const apiTransforms = {
    'parameters': (data) => {
        const params = []
        for(let [k, v] of Object.entries(data)) {
            params.push({ParameterName: k, ...v})
            params[params.length-1].DisplayUnits = params[params.length-1].DisplayUnits
                                                                          .replace('(','')
                                                                          .replace(')', '')
                                                                          .replace('deg', '°')
        }
        return params
    }
}

export const presets = {
    'True air temperatures (C)': [521, 524],
    'Dew points (C)': [529, 550, 931],
    'Tephigram': [529, 521],
    'Pressure & radar alts (ft)': [],
}