import { createSlice } from '@reduxjs/toolkit';

const getNewAxis = (units, id) => {
    return {
        id: id,
        units: units,
    }
}

export const paramSlice = createSlice({

	name: 'params',
	initialState: {
        params: [
            // { axisId: null, id: 1, units: 'K', raw: "deiced_true_air_temp_k", name: 'True air temperature', selected: false },
            // { axisId: null, id: 2, units: 'C', raw: "ind_air_temp", name: 'Indicated air temperature', selected: false },
            // { axisId: null, id: 3, units: 'C', raw: "dew_point", name: 'Dew Point temperature', selected: false },
            // { axisId: null, id: 4, units: 'deg', raw: "lat_gin", name: 'Latitude (GIN)', selected: false },
            // { axisId: null, id: 5, units: 'deg', raw: "lon_gin", name: 'Longitude (GIN)', selected: false },
        ],
        axes: [

        ]
    },
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
        setParams: (state, action) => {
            const params = action.payload;
            state.params = [];
            for(const param of params) {
                const paramToAdd = {
                    id: param.ParameterIdentifier,
                    raw: param.ParameterName,
                    name: param.DisplayText,
                    units: param.DisplayUnits,
                    selected: false,
                    axisId: null,
                }
                
                state.params.push(paramToAdd);
            }
        },
        toggleParamSelected: (state, action) => {
            const param = state.params.find(param => param.id === action.payload.id);
            if (param) {
                param.selected = !param.selected;
                if(param.selected) {
                    const pAxis = state.axes.find(axis => axis.units === param.units)
                    if(!pAxis) {
                        const newAxis = getNewAxis(param.units, state.axes.length + 1);
                        state.axes.push(newAxis);
                        param.axisId = newAxis.id;
                    } else {
                        param.axisId = pAxis.id;
                    }
                } else {
                    const axisId = param.axisId;
                    param.axisId = null;
                    const nParamsOnAxis = state.params.filter(param => param.axisId === axisId).length;
                    if(nParamsOnAxis === 0) {
                        const axisIndex = state.axes.findIndex(axis => axis.id === axisId);
                        state.axes.splice(axisIndex, 1);
                    }
                }
            }
        },
        unselectAllParams: (state) => {
            state.params.forEach(param => param.selected = false);
        },
        addNewAxis: (state, action) => {
            const paramId = action.payload.paramId;
            const param = state.params.find(param => param.id === paramId);
            const nParamsWithUnit = state.params.filter(p => p.selected && p.units === param.units).length;

            if(nParamsWithUnit === 1) return
            const newAxis = getNewAxis(param.units, Math.max(...state.axes.map(x => x.id))+1);
            state.axes.push(newAxis);
            param.axisId = newAxis.id;
        },
        selectAxis: (state, action) => {
            const paramId = action.payload.paramId;
            const axisId = action.payload.axisId;
            const param = state.params.find(param => param.id === paramId);
            param.axisId = axisId;

            const usedAxes = [...new Set(
                state.params.filter(param => param.selected).map(param => param.axisId)
            )];

            state.axes = state.axes.filter(axis => usedAxes.includes(axis.id));
        }
	},
});


export const { 
    addParam, setParams, toggleParamSelected, unselectAllParams, addNewAxis,
    selectAxis
} = paramSlice.actions;

export default paramSlice.reducer;