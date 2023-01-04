import { createSlice } from '@reduxjs/toolkit';

const getNewAxis = (units, axes) => {
    for(let i=1; i<axes.length+1; i++) {
        if(!axes.find(axis => axis.id === i)) {
            return {
                id: i,
                units: units,
            }
        }
    }
    const id = axes.length + 1;
    return {
        id: id,
        units: units,
    }
}

const paramFromDecadesParam = (param) => {
    return {
        id: param.ParameterIdentifier,
        raw: param.ParameterName,
        name: param.DisplayText,
        units: param.DisplayUnits,
        selected: false,
        axisId: null,
        status: null
    }
}

export const paramSlice = createSlice({

	name: 'params',
	initialState: {
        // Params = {axisId=null, id, name, raw, units, selected=False, status=null}
        params: [],
        axes: []
    },
	reducers: {
		addParam: (state, action) => {
			const param = {
				id: action.payload.id.toString(),
				name: action.payload.name,
                raw: action.payload.raw,
                units: action.payload.units,
				selected: false,
                status: null
			};
			state.push(param);
		},
        setParams: (state, action) => {
            const params = action.payload;
            state.params = new Array();
            for(const param of params) {
                const paramToAdd = paramFromDecadesParam(param)     
                state.params.push(paramToAdd);
            }
        },
        setParamStatus: (state, action) => {
            const param = state.params.find(param => param.id === action.payload.id);
            if (param) {
                param.status = action.payload.status;
            }
        },
        toggleParamSelected: (state, action) => {
            const param = state.params.find(param => param.id === action.payload.id);
            if (param) {
                param.selected = !param.selected;
                if(param.selected) {
                    const pAxis = state.axes.find(axis => axis.units === param.units)
                    if(!pAxis) {
                        const newAxis = getNewAxis(
                            param.units, state.axes
                        );
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
                const usedAxes = [...new Set(
                    state.params.filter(param => param.selected).map(param => param.axisId)
                )];
    
                state.axes = state.axes.filter(axis => usedAxes.includes(axis.id));
            }
        },
        unselectAllParams: (state) => {
            state.params.forEach(param => param.selected = false);
            state.axes = []
        },
        addNewAxis: (state, action) => {
            const paramId = action.payload.paramId;
            const param = state.params.find(param => param.id === paramId);
            const nParamsWithUnit = state.params.filter(p => p.selected && p.units === param.units).length;

            if(nParamsWithUnit === 1) return
            const newAxis = getNewAxis(param.units, state.axes);
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
    selectAxis, setParamStatus
} = paramSlice.actions;

export default paramSlice.reducer;