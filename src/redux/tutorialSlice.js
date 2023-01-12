import { createSlice } from '@reduxjs/toolkit';

export const tutorialSlice = createSlice({
	name: 'tutorial',
	initialState: {
        position: 0,
        show: true
    },
	reducers: {
		incrementPosition: (state, action) => {
			state.position += 1
		},
        decrementPosition: (state, action) => {
            state.position -= 1
            if(state.position < 0) {
                state.position = 0;
            }
        },
        setShowTutorial: (state, action) => {
            state.show = action.payload;
            if(!action.payload) {
                window.sessionStorage.setItem('showTutorial', 'false');
            }
        }
	},
});   

export const { incrementPosition, decrementPosition, setShowTutorial } = tutorialSlice.actions;

export default tutorialSlice.reducer;