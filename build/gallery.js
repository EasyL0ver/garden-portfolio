const GalleryFunctional = props => {
  const [galleryConfiguration, setGalleryConfiguration] = React.useState({
    "elements": []
  });
  React.useEffect(() => {
    const fetchData = async () => {
      const dataUrl = "/resources/galleries/" + props.galleryConfigName;
      const response = await fetch(dataUrl);
      const config = await response.json();
      setGalleryConfiguration(config.gallery);
    };

    fetchData();
  }, []);
  return /*#__PURE__*/React.createElement(GalleryThumbnailsView, {
    config: galleryConfiguration
  });
};

const GalleryThumbnailsView = props => {
  const galleryElements = props.config.elements.map((e, i) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "gallery-grid-box",
      key: i
    }, /*#__PURE__*/React.createElement(GalleryThumbnail, {
      details: e.thumbnail,
      images: e.images
    }));
  });
  const columnTemplate = "1fr ".repeat(props.config.columns);
  const rowTemplate = "1fr ".repeat(props.config.rows);
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-grid-container",
    style: {
      gridTemplateColumns: columnTemplate,
      gridTemplateRows: rowTemplate
    }
  }, galleryElements);
};

const GalleryThumbnail = props => {
  const dataUrl = "/resources/img/" + props.details.img;
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-thumbnail-container"
  }, /*#__PURE__*/React.createElement("img", {
    src: dataUrl
  }));
};

document.querySelectorAll('.gallery-container').forEach(domContainer => {
  const gallerySet = domContainer.dataset.set;
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(GalleryFunctional, {
    galleryConfigName: gallerySet
  }));
});