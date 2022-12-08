import { createSlice } from '@reduxjs/toolkit';

export const optionsSlice = createSlice({
	name: 'options',
	initialState: {
        swapOrientation: false,
        plotStyle: {
            options: ['line', 'scatter'],
            value: 'line'
        },
        scrollingWindow: false,
        dataHeader: false,
        ordinateAxis: 'javascript_time',
        server: {
            name: 'fish',
            ip: '192.168.101.108'
        }
    },
	reducers: {
        toggleSwapOrientation: (state) => {
            state.swapOrientation = !state.swapOrientation;
        },
        toggleScrollingWindow: (state) => {
            state.scrollingWindow = !state.scrollingWindow;
        },
        toggleDataHeader: (state) => {
            state.dataHeader = !state.dataHeader;
        },
        togglePlotStyle: (state) => {
            if (state.plotStyle.value === state.plotStyle.options[0]) {
                state.plotStyle.value = state.plotStyle.options[1];
            } else {
                state.plotStyle.value = state.plotStyle.options[0];
            }
        }
	},
});


export const { 
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle
} = optionsSlice.actions;

export default optionsSlice.reducer;