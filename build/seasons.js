const Seasons = () => {
  const [openPanelIndex, setOpenPanelIndex] = React.useState(null);
  const onPanelClick = React.useCallback(index => setOpenPanelIndex(index));
  return /*#__PURE__*/React.createElement("div", {
    className: "seasons-panels-container full-height full-width"
  }, /*#__PURE__*/React.createElement(SeasonPanel, {
    key: "0" + openPanelIndex?.toString(),
    background: "red",
    index: 0,
    selectedIndex: openPanelIndex,
    onClick: onPanelClick,
    img: "bellingrat.jpeg",
    clippedImg: "testowo2.jpg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top left font-large bold white seasons-panel-text-header"
  }, "Lato"), /*#__PURE__*/React.createElement("div", {
    className: "bottom right font-medium white seasons-panel-text-desc"
  }, "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).")), /*#__PURE__*/React.createElement(SeasonPanel, {
    key: "1" + openPanelIndex?.toString(),
    background: "blue",
    index: 1,
    selectedIndex: openPanelIndex,
    onClick: onPanelClick,
    img: "Keukenhof.jpg",
    clippedImg: "Keukenhof.jpg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top left font-large bold white seasons-panel-text-header"
  }, "Wiosna"), /*#__PURE__*/React.createElement("div", {
    className: "bottom right font-medium white seasons-panel-text-desc"
  }, "It is a long established fact that a reader will be ")), /*#__PURE__*/React.createElement(SeasonPanel, {
    key: "2" + openPanelIndex?.toString(),
    background: "pink",
    index: 2,
    selectedIndex: openPanelIndex,
    onClick: onPanelClick,
    img: "testowo2.jpg",
    clippedImg: "testowo2.jpg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top left font-large bold white seasons-panel-text-header"
  }, "Jesie\u0144"), /*#__PURE__*/React.createElement("div", {
    className: "bottom right font-medium white seasons-panel-text-desc"
  }, "It is a long established fact that a reader will be ")), /*#__PURE__*/React.createElement(SeasonPanel, {
    key: "3" + openPanelIndex?.toString(),
    background: "orange",
    index: 3,
    selectedIndex: openPanelIndex,
    onClick: onPanelClick,
    img: "wintergarden.jpg",
    clippedImg: "wintergarden.jpg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top left font-large bold white seasons-panel-text-header"
  }, "Zima"), /*#__PURE__*/React.createElement("div", {
    className: "bottom right font-medium white seasons-panel-text-desc"
  }, "It is a long established fact that a reader will be ")));
};

const SeasonPanel = props => {
  const onPanelClick = React.useCallback(() => {
    if (props.selectedIndex === props.index) {
      props.onClick(null);
      return;
    }

    props.onClick(props.index);
  }, [props.onClick, props.index, props.selectedIndex]);
  const style = {
    backgroundColor: props.background
  };
  let imgPath = "resources/img/" + props.clippedImg;
  let stateClass = "seasons-panel-neutral";

  if (props.selectedIndex != null) {
    stateClass = props.selectedIndex === props.index ? "seasons-panel-expanded" : "seasons-panel-collapsed";

    if (props.selectedIndex === props.index) {
      imgPath = "resources/img/" + props.img;
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    style: style,
    className: "seasons-panel " + stateClass,
    onClick: onPanelClick
  }, /*#__PURE__*/React.createElement("img", {
    className: "full-width full-height",
    src: imgPath
  }), props.selectedIndex === props.index ? props.children : null);
};

document.querySelectorAll('.seasons-container').forEach(domContainer => {
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(Seasons, null));
});