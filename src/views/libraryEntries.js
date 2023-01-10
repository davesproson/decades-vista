const libraryViews = [
    {
        title: "Aircraft position and attitude",
        description: `2x2 grid which displays a map, a plot of altitudes, 
                      a plot of aircraft pitch and roll, and a dashboard`,
        config: {
            nRows: 2,
            nCols: 2,
            plots: [
                "https://www.faam.ac.uk/gluxe/position",
                "http://localhost:5173/decades-demo/plot?timeframe=30min&params=pressure_height_kft,radar_height_kft&axis=pressure_height_kft,radar_height_kft&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time&server=www.faam.ac.uk",
                "http://localhost:5173/decades-demo/plot?timeframe=30min&params=gin_pitch,gin_roll&axis=gin_pitch,gin_roll&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time&server=www.faam.ac.uk",
                "http://localhost:5173/decades-demo/dashboard?params=gin_altitude,gin_heading,gin_latitude,gin_longitude,gin_pitch,gin_roll,gin_speed,gin_wind_angle,gin_wind_speed&server=www.faam.ac.uk"
            ]
        }
    }, 
    {
        title: "Basic Meteorology",
        description: `2x2 grid of basic met parameters`,
        config: {
            nRows: 2,
            nCols: 2,
            plots: [
                "http://localhost:5173/decades-demo/plot?timeframe=30min&params=deiced_true_air_temp_c,nondeiced_true_air_temp_c&axis=deiced_true_air_temp_c,nondeiced_true_air_temp_c&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time&server=www.faam.ac.uk",
                "http://localhost:5173/decades-demo/plot?timeframe=30min&params=aerack01_buck_mirr_temp,dew_point,specific_humidity&axis=aerack01_buck_mirr_temp,dew_point&axis=specific_humidity&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time&server=www.faam.ac.uk",
                "http://localhost:5173/decades-demo/plot?timeframe=30min&params=gin_eastwards_wind_component,gin_northwards_wind_component,gin_wind_speed&axis=gin_eastwards_wind_component,gin_northwards_wind_component&axis=gin_wind_speed&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time&server=www.faam.ac.uk",
                "http://localhost:5173/decades-demo/plot?timeframe=30min&params=turb_probe_attack_diff,turb_probe_pitot_static,turb_probe_sideslip_diff&axis=turb_probe_attack_diff,turb_probe_sideslip_diff&axis=turb_probe_pitot_static&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time&server=www.faam.ac.uk"
            ]
        }
    }
]

export { libraryViews }