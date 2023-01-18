import { base } from "../settings"
import { onLuxe } from "../utils"

const libraryViews = [
    {
        title: "Aircraft position and attitude",
        description: `2x2 grid which displays a map, a plot of altitudes, 
                      a plot of aircraft pitch and roll, and a dashboard`,
        config: {
            nRows: 2,
            nCols: 2,
            plots: [
                onLuxe() ? "http://192.168.101.105/gluxe/position" : "https://www.faam.ac.uk/gluxe/position",
                `${base}plot?timeframe=30min&params=pressure_height_kft,radar_height_kft&axis=pressure_height_kft,radar_height_kft&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `${base}plot?timeframe=30min&params=gin_pitch,gin_roll&axis=gin_pitch,gin_roll&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `${base}dashboard?params=gin_altitude,gin_heading,gin_latitude,gin_longitude,gin_pitch,gin_roll,gin_speed,gin_wind_angle,gin_wind_speed`,
            ]
        }
    }, 
    {
        title: "Basic Meteorology",
        description: `2x2 grid of basic met parameters, including true air temperatures, dew point
                      temperatures and humidity, wind speed and direction, and turbulence probe 
                      differential pressures.`,
        config: {
            nRows: 2,
            nCols: 2,
            plots: [
                `${base}plot?timeframe=30min&params=deiced_true_air_temp_c,nondeiced_true_air_temp_c&axis=deiced_true_air_temp_c,nondeiced_true_air_temp_c&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `${base}plot?timeframe=30min&params=aerack01_buck_mirr_temp,dew_point,specific_humidity&axis=aerack01_buck_mirr_temp,dew_point&axis=specific_humidity&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `${base}plot?timeframe=30min&params=gin_eastwards_wind_component,gin_northwards_wind_component,gin_wind_speed&axis=gin_eastwards_wind_component,gin_northwards_wind_component&axis=gin_wind_speed&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `${base}plot?timeframe=30min&params=turb_probe_attack_diff,turb_probe_pitot_static,turb_probe_sideslip_diff&axis=turb_probe_attack_diff,turb_probe_sideslip_diff&axis=turb_probe_pitot_static&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
            ]
        }
    },
    {
        title: "Vertical profiles",
        description: `A tephigram on the left, and vertical profiles of wind speed and direction,
                      bulk water (Nevzorov), and aerosol (CPC) on the right.`,
        config: {
            nRows: 1,
            nCols: 2,
            plots: [
                `${base}tephigram?timeframe=30min&params=deiced_true_air_temp_c,dew_point`,
                `${base}view?nRows=1&nCols=3&plot=L2RlY2FkZXMtZGVtby9wbG90P3RpbWVmcmFtZT0zMG1pbiZwYXJhbXM9Z2luX3dpbmRfYW5nbGUsZ2luX3dpbmRfc3BlZWQmYXhpcz1naW5fd2luZF9zcGVlZCZheGlzPWdpbl93aW5kX2FuZ2xlJnN3YXB4eT10cnVlJnNjcm9sbGluZz1mYWxzZSZkYXRhX2hlYWRlcj1mYWxzZSZzdHlsZT1saW5lJm9yZHZhcj1wcmVzc3VyZV9oZWlnaHRfa2Z0&plot=L2RlY2FkZXMtZGVtby9wbG90P3RpbWVmcmFtZT0zMG1pbiZwYXJhbXM9bmV2em9yb3ZfbGlxdWlkX3dhdGVyLG5ldnpvcm92X3RvdGFsX3dhdGVyJmF4aXM9bmV2em9yb3ZfbGlxdWlkX3dhdGVyLG5ldnpvcm92X3RvdGFsX3dhdGVyJnN3YXB4eT10cnVlJnNjcm9sbGluZz1mYWxzZSZkYXRhX2hlYWRlcj1mYWxzZSZzdHlsZT1saW5lJm9yZHZhcj1wcmVzc3VyZV9oZWlnaHRfa2Z0&plot=L2RlY2FkZXMtZGVtby9wbG90P3RpbWVmcmFtZT0zMG1pbiZwYXJhbXM9Y3BjMzc4MDFfY291bnRzJmF4aXM9Y3BjMzc4MDFfY291bnRzJnN3YXB4eT10cnVlJnNjcm9sbGluZz1mYWxzZSZkYXRhX2hlYWRlcj1mYWxzZSZzdHlsZT1saW5lJm9yZHZhcj1wcmVzc3VyZV9oZWlnaHRfa2Z0`
            ]
        }
    }
]

export { libraryViews }