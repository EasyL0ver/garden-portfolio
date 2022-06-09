function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const GalleryFunctional = props => {
  const [galleryConfiguration, setGalleryConfiguration] = React.useState({
    "elements": []
  });
  React.useEffect(() => {
    const fetchData = async () => {
      const dataUrl = "resources/galleries/" + props.galleryConfigName;
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
  const columnTemplate = "minmax(0, 1fr) ".repeat(props.config.columns);
  const rowTemplate = "minmax(0, 1fr) ".repeat(props.config.rows);
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-grid-container",
    style: {
      gridTemplateColumns: columnTemplate,
      gridTemplateRows: rowTemplate
    }
  }, galleryElements);
};

function useHover() {
  const [hovering, setHovering] = React.useState(false);
  const onHoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false)
  };
  return [hovering, onHoverProps];
}

const GalleryThumbnail = props => {
  const [thumbnailHovering, hoverProps] = useHover();
  const dataUrl = "/resources/img/" + props.details.img;
  const imageClasses = thumbnailHovering ? "blurred " : "";
  const descriptionVisibility = thumbnailHovering ? "" : "hidden ";
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "gallery-thumbnail-container"
  }, hoverProps), /*#__PURE__*/React.createElement("div", {
    className: "gallery-image-wrapper"
  }, /*#__PURE__*/React.createElement("a", {
    href: "google.com"
  }, /*#__PURE__*/React.createElement("img", {
    className: imageClasses,
    src: dataUrl
  }), /*#__PURE__*/React.createElement("div", {
    className: descriptionVisibility + "gallery-thumbnail-description main-font white"
  }, /*#__PURE__*/React.createElement("div", {
    className: descriptionVisibility + "font-large bold"
  }, props.details.title), /*#__PURE__*/React.createElement("div", {
    className: descriptionVisibility + "font-medium"
  }, props.details.description)))));
};

document.querySelectorAll('.thumbnails-container').forEach(domContainer => {
  const gallerySet = domContainer.dataset.set;
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(GalleryFunctional, {
    galleryConfigName: gallerySet
  }));
});