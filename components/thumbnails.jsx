
const GalleryFunctional = (props) => {
  const [galleryConfiguration, setGalleryConfiguration] = React.useState({ "elements": [] });
  React.useEffect(() => {
    const fetchData = async () => {
      const dataUrl = "resources/galleries/" + props.galleryConfigName
      const response = await fetch(dataUrl)
      const config = await response.json()
      setGalleryConfiguration(config.gallery)
    }
    fetchData()
  }, [])

  return (
    <GalleryThumbnailsView config={galleryConfiguration} galleryName={props.galleryConfigName}></GalleryThumbnailsView>
  )
}

const GalleryThumbnailsView = (props) => {
  const galleryElements = props.config.elements.map((e, i) => {

    const buttonPressUrl = `/gallery.html?gallerySet=${props.galleryName}&subGalleryIndex=${i}&currentIndex=0`

    return (<div className="gallery-grid-box" key={i}>
      <GalleryThumbnail details={e.thumbnail} images={e.images} navigateUrl={buttonPressUrl} ></GalleryThumbnail>
    </div>)
  })

  const columnTemplate = "minmax(0, 1fr) ".repeat(props.config.columns)
  const rowTemplate = "minmax(0, 1fr) ".repeat(props.config.rows)

  return (
    <div className="gallery-grid-container" style={{ gridTemplateColumns: columnTemplate, gridTemplateRows: rowTemplate }} >
      {galleryElements}
    </div>)
}


function useHover() {
  const [hovering, setHovering] = React.useState(false)
  const onHoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  }
  return [hovering, onHoverProps]
}

const GalleryThumbnail = (props) => {
  const [thumbnailHovering, hoverProps] = useHover()
  const dataUrl = "/resources/img/" + props.details.img

  const imageClasses = thumbnailHovering ? "blurred " : "";
  const descriptionVisibility = thumbnailHovering ? "" : "hidden "

  return (<div className="gallery-thumbnail-container" {...hoverProps}>
    <div className="gallery-image-wrapper">
      <a href={props.navigateUrl}>
        <img className={imageClasses} src={dataUrl}></img>
        <div className={descriptionVisibility + "gallery-thumbnail-description main-font white"}>
          <div className={descriptionVisibility + "font-large bold"}>{props.details.title}</div>
          <div className={descriptionVisibility + "font-medium"}>{props.details.description}</div>
        </div>
      </a>
    </div>
  </div>)
}


document.querySelectorAll('.thumbnails-container')
  .forEach(domContainer => {
    const gallerySet = domContainer.dataset.set;
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <GalleryFunctional galleryConfigName={gallerySet}></GalleryFunctional>
    );
  });