import { createSlice } from '@reduxjs/toolkit';

const reducePlots = (state) => {
    state.plots = [...state.plots.slice(0, state.nRows * state.nCols)];
}

const addPlots = (state) => {
    const nPlots = state.nRows * state.nCols;
    const nPlotsToAdd = nPlots - state.plots.length;
    for (let i = 0; i < nPlotsToAdd; i++) {
        state.plots.push("");
    }
}

export const viewSlice = createSlice({
	name: 'view',
	initialState: {
        nRows: 1,
        nCols: 1,
        plots: [""],
        savedViews: [],
        advancedConfig: {
            "type": "view",
            "rows": 1,
            "columns": 1,
            "rowPercent": [100],
            "columnPercent": [100],
            "elements": []
        },
        advancedConfigSaved: true
    },
	reducers: {
        setAdvancedConfig: (state, action) => {
            console.log(action.payload)
            if(action.payload === null) {
                state.advancedConfig = {
                    "type": "view",
                    "rows": 1,
                    "columns": 1,
                    "rowPercent": [100],
                    "columnPercent": [100],
                    "elements": []
                }
                return;
            }
            state.advancedConfig = action.payload;
        },
        setAdvancedConfigSaved: (state, action) => {
            state.advancedConfigSaved = action.payload;
        },
		addColumn: (state) => {
            state.nCols += 1;
            addPlots(state);
        },
        addRow: (state) => {
            state.nRows += 1;
            addPlots(state);
        },
        removeColumn: (state) => {
            if (state.nCols > 1) {
                state.nCols -= 1;
                reducePlots(state);
            }
        },
        removeRow: (state) => {
            if (state.nRows > 1) {
                state.nRows -= 1;
                reducePlots(state);
            }
        },
        setPlot: (state, action) => {
            const plots = [...state.plots];
            plots[action.payload.index] = action.payload.url;
            state.plots = plots;
        },
        setConfig: (state, action) => {
            state.nRows = action.payload.nRows;
            state.nCols = action.payload.nCols;
            state.plots = action.payload.plots;
        },
        reset: (state) => {
            state.nRows = 1;
            state.nCols = 1;
            state.plots = [""];
        },
        saveView: (state, action) => {
            const savedViews = [...state.savedViews];
            savedViews.push(action.payload);
            state.savedViews = savedViews;
        },
        loadSavedView: (state, action) => {
            const savedView = state.savedViews.find(x => x.id === action.payload.id);
            state.nRows = savedView.nRows;
            state.nCols = savedView.nCols;
            state.plots = savedView.plots;
        },
        clearSavedViews: (state) => {
            state.savedViews = [];
        }
	},
});   

export const { 
    addColumn, addRow, removeColumn, removeRow, setPlot, reset, saveView, loadSavedView,
    setConfig, clearSavedViews, setAdvancedConfig, setAdvancedConfigSaved
} = viewSlice.actions;

export default viewSlice.reducer;