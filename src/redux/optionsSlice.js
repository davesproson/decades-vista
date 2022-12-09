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
        ordinateAxis: 'utc_time',
        server: "",
        timeframes: [
            {selected: false, value: 'all', label: 'All'},
            {selected: false, value: '2hr', label: '2 hours'},
            {selected: false, value: '1hr', label: '1 hour'},
            {selected: true, value: '30min', label: '30 minutes'},
            {selected: false, value: '5min', label: '5 minutes'},
            {selected: false, value: '1min', label: '1 minute'},
        ]
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
        },
        setTimeframe: (state, action) => {
            for(const timeframe of state.timeframes) {
                timeframe.selected = false;
            }
            state.timeframes.find(x=>x.value===action.payload.value).selected = true;
        },
        setServer: (state, action) => {
            state.server = action.payload;
        }
	},
});


export const { 
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle,
    setTimeframe, setServer
} = optionsSlice.actions;

export default optionsSlice.reducer;