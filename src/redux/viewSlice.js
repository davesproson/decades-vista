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
        savedViews: []
    },
	reducers: {
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
        reset: (state) => {
            state.nRows = 1;
            state.nCols = 1;
            state.plots = [""];
        },
        saveView: (state, action) => {
            const savedViews = [...state.savedViews];
            savedViews.push(action.payload);
            state.savedViews = savedViews;
        }
	},
});   

export const { 
    addColumn, addRow, removeColumn, removeRow, setPlot, reset, saveView
} = viewSlice.actions;

export default viewSlice.reducer;