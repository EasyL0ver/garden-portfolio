
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

    const buttonPressUrl = `gallery.html?gallerySet=${props.galleryName}&subGalleryIndex=${i}&currentIndex=0`

    return (<div className="gallery-grid-box" key={i}>
      <GalleryThumbnail details={e.thumbnail} images={e.images} navigateUrl={buttonPressUrl} ></GalleryThumbnail>
    </div>)
  })

  return (
    <div className={"gallery-grid-container " + props.config.layoutName} >
      {galleryElements}
    </div>)
}


const GalleryThumbnail = (props) => {
  const dataUrl = "resources/img/" + props.details.img

  return (<div className="gallery-thumbnail-container">
    <div className="gallery-image-wrapper">
      <a href={props.navigateUrl}>
        <img src={dataUrl}></img>
        <div className={"gallery-thumbnail-description main-font white"}>
          <div className={"font-large bold align-center"}>{props.details.title}</div>
          <div className={"font-medium align-center"}>{props.details.description}</div>
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