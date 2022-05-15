
const GalleryFunctional = (props) => {
  const [galleryConfiguration, setGalleryConfiguration] = React.useState({ "elements": [] });
  React.useEffect(() => {
    const fetchData = async () => {
      const dataUrl = "/resources/galleries/" + props.galleryConfigName
      const response = await fetch(dataUrl)
      const config = await response.json()
      setGalleryConfiguration(config.gallery)
    }
    fetchData()
  }, [])

  return (
    <GalleryThumbnailsView config={galleryConfiguration}></GalleryThumbnailsView>
  )
}

const GalleryThumbnailsView = (props) => {
  const galleryElements = props.config.elements.map((e,i) => {

    return (<div className="gallery-grid-box" key={i}>
      <GalleryThumbnail details={e.thumbnail} images={e.images} ></GalleryThumbnail>
    </div>)
  })

  const columnTemplate = "1fr ".repeat(props.config.columns)
  const rowTemplate = "1fr ".repeat(props.config.rows)

  return (
    <div className="gallery-grid-container" style={{ gridTemplateColumns: columnTemplate, gridTemplateRows: rowTemplate }} >
      {galleryElements}
    </div>)
}


const GalleryThumbnail = (props) => {
  const dataUrl = "/resources/img/" + props.details.img
  return (<div className="gallery-thumbnail-container">
    <img src={dataUrl}></img>
  </div>)
}


document.querySelectorAll('.gallery-container')
  .forEach(domContainer => {
    const gallerySet = domContainer.dataset.set;
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <GalleryFunctional galleryConfigName={gallerySet}></GalleryFunctional>
    );
  });