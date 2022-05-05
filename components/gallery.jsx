const GalleryFunctional = (props) => {
  return (
    <div>{props.gallerySet}</div>
  )
}

document.querySelectorAll('.gallery-container')
  .forEach(domContainer => {
    const gallerySet = domContainer.dataset.set;
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <GalleryFunctional gallerySet={gallerySet}></GalleryFunctional>
    );
  });