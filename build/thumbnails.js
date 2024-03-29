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
    config: galleryConfiguration,
    galleryName: props.galleryConfigName
  });
};

const GalleryThumbnailsView = props => {
  const galleryElements = props.config.elements.map((e, i) => {
    const buttonPressUrl = `gallery.html?gallerySet=${props.galleryName}&subGalleryIndex=${i}&currentIndex=0`;
    return /*#__PURE__*/React.createElement("div", {
      className: "gallery-grid-box",
      key: i
    }, /*#__PURE__*/React.createElement(GalleryThumbnail, {
      details: e.thumbnail,
      images: e.images,
      navigateUrl: buttonPressUrl
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-grid-container " + props.config.layoutName
  }, galleryElements);
};

const GalleryThumbnail = props => {
  const dataUrl = "resources/img/" + props.details.img;
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-thumbnail-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gallery-image-wrapper"
  }, /*#__PURE__*/React.createElement("a", {
    href: props.navigateUrl
  }, /*#__PURE__*/React.createElement("img", {
    src: dataUrl
  }), /*#__PURE__*/React.createElement("div", {
    className: "gallery-thumbnail-description main-font white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-large bold align-center"
  }, props.details.title), /*#__PURE__*/React.createElement("div", {
    className: "font-medium align-center"
  }, props.details.description)))));
};

document.querySelectorAll('.thumbnails-container').forEach(domContainer => {
  const gallerySet = domContainer.dataset.set;
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(GalleryFunctional, {
    galleryConfigName: gallerySet
  }));
});