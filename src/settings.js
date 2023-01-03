export const serverPrefix = "www.faam.ac.uk"
export const serverProtocol = "https"

export const badData = -999.99

export const apiEndpoints = {
    'parameters': '/livedata/parano.json',
    'data': '/livedata/livejson?db=1',
    'tank_status': '/livedata/parano.json',
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
    },
    'tank_status': (data) => {
        return {
            'topo': {
                'primary': 'www.faam.ac.uk',
                'secondaries': []
            }
        }
    }
}

export const presets = {
    'True air temperatures (C)': [521, 524],
    'Dew points (C)': [529, 550, 931],
    'Tephigram': [529, 521],
    'Pressure & radar alts (ft)': [],
}