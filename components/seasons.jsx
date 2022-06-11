
function determineCollasedState(openPanelIndex, currentIndex) {

}

const Seasons = () => {
    const [openPanelIndex, setOpenPanelIndex] = React.useState(null)

    const onPanelClick = React.useCallback((index) => setOpenPanelIndex(index))

    return (<div className="seasons-panels-container full-height full-width">
        <SeasonPanel key={"0" + openPanelIndex?.toString()} background="red" index={0} selectedIndex={openPanelIndex} onClick={onPanelClick}></SeasonPanel>
        <SeasonPanel key={"1" + openPanelIndex?.toString()} background="blue" index={1} selectedIndex={openPanelIndex} onClick={onPanelClick}></SeasonPanel>
        <SeasonPanel key={"2" + openPanelIndex?.toString()} background="pink" index={2} selectedIndex={openPanelIndex} onClick={onPanelClick}></SeasonPanel>
        <SeasonPanel key={"3" + openPanelIndex?.toString()} background="orange" index={3} selectedIndex={openPanelIndex} onClick={onPanelClick}></SeasonPanel>
    </div>)
}

const SeasonPanel = (props) => {
    const onPanelClick = React.useCallback(() => {

        if(props.selectedIndex === props.index) {
            props.onClick(null);
            return;
        }
        props.onClick(props.index);
    }, [props.onClick, props.index, props.selectedIndex])

    const style = { backgroundColor: props.background }

    let stateClass = "seasons-panel-neutral"

    if (props.selectedIndex != null) {
        stateClass = props.selectedIndex === props.index ? "seasons-panel-expanded" : "seasons-panel-collapsed"
    }

    return (<div style={style} className={"seasons-panel " + stateClass} onClick={onPanelClick}>PANEL PORY ROKU</div>)
}


document.querySelectorAll('.seasons-container')
    .forEach(domContainer => {
        const root = ReactDOM.createRoot(domContainer);
        root.render(
            <Seasons></Seasons>
        );
    });