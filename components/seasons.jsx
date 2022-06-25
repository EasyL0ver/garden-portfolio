
const Seasons = () => {
    const [openPanelIndex, setOpenPanelIndex] = React.useState(null)

    const onPanelClick = React.useCallback((index) => setOpenPanelIndex(index))

    return (<div className="seasons-panels-container full-height full-width">
        <SeasonPanel key={"0" + openPanelIndex?.toString()} index={0} selectedIndex={openPanelIndex} onClick={onPanelClick} img={"bellingrat.jpeg"} clippedImg={"testowo2.jpg"}>
            <div className="top left font-large bold white seasons-panel-text-header">Lato</div>
            <div className="bottom right font-medium white seasons-panel-text-desc">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</div>
        </SeasonPanel>
        <SeasonPanel key={"1" + openPanelIndex?.toString()} index={1} selectedIndex={openPanelIndex} onClick={onPanelClick} img={"Keukenhof.jpg"} clippedImg={"Keukenhof.jpg"}>
            <div className="top left font-large bold white seasons-panel-text-header">Wiosna</div>
            <div className="bottom right font-medium white seasons-panel-text-desc">It is a long established fact that a reader will be </div>
        </SeasonPanel>
        <SeasonPanel key={"2" + openPanelIndex?.toString()} index={2} selectedIndex={openPanelIndex} onClick={onPanelClick} img={"testowo2.jpg"} clippedImg={"testowo2.jpg"}>
            <div className="top left font-large bold white seasons-panel-text-header">Jesień</div>
            <div className="bottom right font-medium white seasons-panel-text-desc">It is a long established fact that a reader will be </div>
        </SeasonPanel>
        <SeasonPanel key={"3" + openPanelIndex?.toString()} index={3} selectedIndex={openPanelIndex} onClick={onPanelClick} img={"wintergarden.jpg"} clippedImg={"wintergarden.jpg"}>
            <div className="top left font-large bold white seasons-panel-text-header">Zima</div>
            <div className="bottom right font-medium white seasons-panel-text-desc">It is a long established fact that a reader will be </div>
        </SeasonPanel>
    </div>)
}

const SeasonPanel = (props) => {
    const onPanelClick = React.useCallback(() => {

        if (props.selectedIndex === props.index) {
            props.onClick(null);
            return;
        }
        props.onClick(props.index);
    }, [props.onClick, props.index, props.selectedIndex])

    let imgPath = "resources/img/" + props.clippedImg

    let stateClass = "seasons-panel-neutral"

    if (props.selectedIndex != null) {
        stateClass = props.selectedIndex === props.index ? "seasons-panel-expanded" : "seasons-panel-collapsed"

        if (props.selectedIndex === props.index) {
            imgPath = "resources/img/" + props.img
        }
    }

    return (<div className={"seasons-panel " + stateClass} onClick={onPanelClick}>
        <img className="full-width full-height" src={imgPath}></img>
        {props.selectedIndex === props.index ? props.children : null}
    </div>)
}


document.querySelectorAll('.seasons-container')
    .forEach(domContainer => {
        const root = ReactDOM.createRoot(domContainer);
        root.render(
            <Seasons></Seasons>
        );
    });