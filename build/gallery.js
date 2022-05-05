const GalleryFunctional = props => {
  return /*#__PURE__*/React.createElement("div", null, props.gallerySet);
};

document.querySelectorAll('.gallery-container').forEach(domContainer => {
  const gallerySet = domContainer.dataset.set;
  const root = ReactDOM.createRoot(domContainer);
  root.render( /*#__PURE__*/React.createElement(GalleryFunctional, {
    gallerySet: gallerySet
  }));
});