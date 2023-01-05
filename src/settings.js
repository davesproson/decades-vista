export const serverPrefix = "www.faam.ac.uk"
export const serverProtocol = "https"
export const base = "/decades-demo/"

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

export const geoCoords = {
    'latitude': 'gin_latitude',
    'longitude': 'gin_longitude',
    'altitude': 'pressure_height_kft'
}

export const presets = {
    'True air temperatures (C)': [521, 524],
    'Dew points (C)': [529, 550, 931],
    'Tephigram': [529, 521],
    'Pressure & radar alts (ft)': [579, 977],
    'Neph. SP (Mm-1)': [622, 623, 624]
}

export const plotHeaderDefaults = [
    'gin_latitude', 'gin_longitude', 'pressure_height_kft', 'deiced_true_air_temp_c',
    'dew_point'
]