const ImageGallery = () => {
  const [images, setImages] = React.useState([]);
  const [currentImage, setCurrentImage] = React.useState({
    img: "default.jpg"
  });
  React.useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const dataUrl = "resources/galleries/" + params.get("gallerySet");
      const response = await fetch(dataUrl);
      const config = await response.json();
      const galleryIndex = parseInt(params.get("img"));
      const galleryImages = config.gallery.elements[galleryIndex].images;
      setImages(galleryImages);
      setCurrentImage(galleryImages[0]);
    };

    fetchData();
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Image, {
    imageName: currentImage.img
  }));
};

const Image = props => {
  const actualPath = "/resources/img/" + props.imageName;
  return /*#__PURE__*/React.createElement("img", {
    src: actualPath
  });
};

document.querySelectorAll('.gallery-container').forEach(domContainer => {
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(ImageGallery, null));
});