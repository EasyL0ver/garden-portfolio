const ImageGallery = () => {
  const [images, setImages] = React.useState([{
    img: "default.jpg"
  }]);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  React.useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const dataUrl = "resources/galleries/" + params.get("gallerySet");
      const response = await fetch(dataUrl);
      const config = await response.json();
      const galleryIndex = parseInt(params.get("subGalleryIndex"));
      const galleryImages = config.gallery.elements[galleryIndex].images;
      const index = parseInt(params.get("currentIndex") ?? "0");
      setCurrentImageIndex(index);
      setImages(galleryImages);
    };

    fetchData();
  }, []);
  const onImageClicked = React.useCallback(selectedImageIndex => {
    const params = new URLSearchParams(window.location.search);
    params.set("currentIndex", selectedImageIndex);
    history.replaceState(null, null, "?" + params.toString());
    setCurrentImageIndex(selectedImageIndex);
  }, [setCurrentImageIndex]);
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-container-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-overlay"
  }, /*#__PURE__*/React.createElement(NavArrow, {
    key: "right" + currentImageIndex,
    direction: "right",
    selectedIndex: currentImageIndex,
    elementsCount: images.length,
    clickCallback: onImageClicked
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav-overlay-flex-space"
  }), /*#__PURE__*/React.createElement(NavArrow, {
    key: "left" + currentImageIndex,
    direction: "left",
    selectedIndex: currentImageIndex,
    elementsCount: images.length,
    clickCallback: onImageClicked
  })), /*#__PURE__*/React.createElement("div", {
    className: "main-image-container"
  }, /*#__PURE__*/React.createElement(Image, {
    imageName: images[currentImageIndex].img
  })), /*#__PURE__*/React.createElement("div", {
    className: "thumbnails-container"
  }, images.map((image, index) => /*#__PURE__*/React.createElement(MiniImage, {
    key: index,
    isSelected: index === currentImageIndex,
    imageName: image.img,
    imageIndex: index,
    clickCallback: onImageClicked
  }))));
};

const NavArrow = props => {
  const navigate = React.useCallback(() => {
    let newIndex = props.selectedIndex;

    if (props.direction == "left") {
      newIndex--;
    }

    if (props.direction == "right") {
      newIndex++;
    }

    if (newIndex < 0) return;
    if (newIndex > props.elementsCount - 1) return;
    props.clickCallback(newIndex);
  }, [props.clickCallback]);
  let visible = true;

  if (props.direction == "left" && props.selectedIndex == 0) {
    visible = false;
  }

  if (props.direction == "right" && props.selectedIndex == props.elementsCount - 1) {
    visible = false;
  }

  const wrapperClasses = visible ? "nav-arrow-wrapper" : "nav-arrow-wrapper inactive-arrow click-disable";
  const arrowDir = props.direction == "left" ? "arrow-left" : "arrow-right";
  const arrowActive = visible ? "arrow-active" : "arrow-inactive";
  return /*#__PURE__*/React.createElement("div", {
    className: wrapperClasses,
    onClick: navigate
  }, /*#__PURE__*/React.createElement("i", {
    className: "nav-arrow " + arrowDir + " " + arrowActive
  }));
};

const MiniImage = props => {
  const miniImageClicked = React.useCallback(() => {
    props.clickCallback(props.imageIndex);
  });
  const miniImageClasses = props.isSelected ? "mini-image-wrapper mini-selected" : "mini-image-wrapper";
  return /*#__PURE__*/React.createElement("div", {
    className: miniImageClasses,
    onClick: miniImageClicked
  }, /*#__PURE__*/React.createElement(Image, {
    imageName: props.imageName
  }));
};

const Image = props => {
  const actualPath = "/resources/img/" + props.imageName;
  return /*#__PURE__*/React.createElement("img", {
    className: "fit",
    src: actualPath
  });
};

document.querySelectorAll('.gallery-container').forEach(domContainer => {
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(ImageGallery, null));
});