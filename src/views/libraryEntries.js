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
                `plot?timeframe=30min&params=pressure_height_kft,radar_height_kft&axis=pressure_height_kft&axis=radar_height_kft&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=gin_pitch,gin_roll&axis=gin_pitch,gin_roll&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `dashboard?params=gin_altitude,gin_heading,gin_latitude,gin_longitude,gin_pitch,gin_roll,gin_speed,gin_wind_angle,gin_wind_speed`,
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
                `plot?timeframe=30min&params=deiced_true_air_temp_c,nondeiced_true_air_temp_c&axis=deiced_true_air_temp_c,nondeiced_true_air_temp_c&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=buck_mirror_temp,dew_point,specific_humidity&axis=buck_mirror_temp,dew_point&axis=specific_humidity&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=adc_eastwards_wind_component,adc_northwards_wind_component,adc_wind_speed&axis=adc_eastwards_wind_component,adc_northwards_wind_component&axis=adc_wind_speed&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=turb_probe_attack_diff,turb_probe_pitot_static,turb_probe_sideslip_diff&axis=turb_probe_attack_diff,turb_probe_sideslip_diff&axis=turb_probe_pitot_static&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
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
                `tephigram?timeframe=30min&params=deiced_true_air_temp_c,dew_point`,
                `view?nRows=1&nCols=3&plot=cGxvdD90aW1lZnJhbWU9MzBtaW4mcGFyYW1zPWFkY193aW5kX2FuZ2xlLGFkY193aW5kX3NwZWVkJmF4aXM9YWRjX3dpbmRfc3BlZWQmYXhpcz1hZGNfd2luZF9hbmdsZSZzd2FweHk9dHJ1ZSZzY3JvbGxpbmc9ZmFsc2UmZGF0YV9oZWFkZXI9ZmFsc2Umc3R5bGU9bGluZSZvcmR2YXI9cHJlc3N1cmVfaGVpZ2h0X2tmdA==&plot=cGxvdD90aW1lZnJhbWU9MzBtaW4mcGFyYW1zPW5ldnpvcm92X2xpcXVpZF93YXRlcixuZXZ6b3Jvdl90b3RhbF93YXRlciZheGlzPW5ldnpvcm92X2xpcXVpZF93YXRlcixuZXZ6b3Jvdl90b3RhbF93YXRlciZzd2FweHk9dHJ1ZSZzY3JvbGxpbmc9ZmFsc2UmZGF0YV9oZWFkZXI9ZmFsc2Umc3R5bGU9bGluZSZvcmR2YXI9cHJlc3N1cmVfaGVpZ2h0X2tmdA==&plot=cGxvdD90aW1lZnJhbWU9MzBtaW4mcGFyYW1zPWNwY19jb3VudHMmYXhpcz1jcGNfY291bnRzJnN3YXB4eT10cnVlJnNjcm9sbGluZz1mYWxzZSZkYXRhX2hlYWRlcj1mYWxzZSZzdHlsZT1saW5lJm9yZHZhcj1wcmVzc3VyZV9oZWlnaHRfa2Z0`
            ]
        }
    }
]

export { libraryViews }