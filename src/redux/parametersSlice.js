import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export const paramSlice = createSlice({

	name: 'params',
	initialState: [
		{ id: 1, units: 'K', raw: "deiced_true_air_temp_k", name: 'True air temperature', selected: false },
		{ id: 2, units: 'C', raw: "ind_air_temp", name: 'Indicated air temperature', selected: false },
		{ id: 3, units: 'C', raw: "dew_point", name: 'Dew Point temperature', selected: false },
		{ id: 4, units: 'deg', raw: "lat_gin", name: 'Latitude (GIN)', selected: false },
		{ id: 5, units: 'deg', raw: "lon_gin", name: 'Longitude (GIN)', selected: false },
	],
	reducers: {
		addParam: (state, action) => {
			const param = {
				id: action.payload.id,
				name: action.payload.name,
                raw: action.payload.raw,
                units: action.payload.units,
				selected: false,
			};
			state.push(param);
		},
        toggleParamSelected: (state, action) => {
            const param = state.find(param => param.id === action.payload.id);
            if (param) {
                param.selected = !param.selected;
            }
        },
        unselectAllParams: (state) => {
            state.forEach(param => param.selected = false);
        }

	},
});


export const { addParam, toggleParamSelected, unselectAllParams } = paramSlice.actions;

export default paramSlice.reducer;