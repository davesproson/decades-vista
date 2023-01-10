
import { setFilterText } from "../redux/filterSlice"
import { unselectAllParams, toggleParamSelected } from "../redux/parametersSlice"

const panels = [
    {
        title: "Welcome to the DECADES visualisation software",
        text: "Would you like to take a quick tour?",
        continueText: "Yes, Please",
        abortText: "No, Thanks",
    },
    {
        title: "Parameter Selection",
        text: `This is the main parameter selection menu. Available parameters are 
                highlighted in green. Click on a parameter to select it, and click
                again to deselect it. You can select as many parameters as you like.`,
    },
    {
        title: "Parameter Selection",
        text: `You can filter the list of parameters by typing in the search box 
               at the top of the screen. I've typed "temperature" for you. Try typing 
               something yourself.`,
        dispatch: [()=>setFilterText({filterText: "temperature"})],
        clear: [()=>setFilterText({filterText: ""})]
    },
    {
        title: "Plotting",
        text: `The most important part of the DECADES display software is the plot.
               Once at least one parameter is selected, you can click the "Plot" button,
               which will open a new window with the plot. Try it now, I've selected a
               temperature and a dewpoint parameter for you.`,
        dispatch: [
            () => unselectAllParams(),
            () => toggleParamSelected({id: "521"}),
            () => toggleParamSelected({id: "529"}),
        ],
        clear: [() => unselectAllParams()],
    },
    {
        title: "Plotting",
        text: `The plot window has a number of features. You can zoom in and out by
                clicking and dragging on the plot, or by using the zoom buttons at the
                top of the plot. You can also pan the plot by clicking and dragging
                anywhere on the plot while holding ctrl. Double clicking will reset the
                plot. You can also use the buttons in the top right of the plot. Try it now.`,
    },
    {
        title: "Customising the Plot",
        text: `Plots are very customisable. The timeframe over which to plot can be
               changed by clicking on the "Timeframe" menu at the top of the page.
               I've done this for you.`,
        action: () => {document.getElementById("timeframe-navbar-item").click()}
    },
    {
        title: "Customising the Plot",
        text: `You can either select a preset timeframe, or enter a custom timeframe.
               Let's see how to do that. Click on the "Custom..." menu item, and/or click 
               Continue.`,
    },
    {
        title: "To be continued...",
        text: `More to be written`,
        continueText: "Finish",
        abortText: "Finish, but red",
    }
]

export { panels }