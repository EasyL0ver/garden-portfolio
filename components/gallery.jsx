const ImageGallery = () => {
    const [images, setImages] = React.useState([{img: "default.jpg"}])
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
    
    React.useEffect(() => {
        const fetchData = async () => {
            const params = new URLSearchParams(window.location.search)
            const dataUrl = "resources/galleries/" + params.get("gallerySet")
            const response = await fetch(dataUrl)
            const config = await response.json()


            const galleryIndex = parseInt(params.get("subGalleryIndex"))
            const galleryImages = config.gallery.elements[galleryIndex].images

            const index = parseInt(params.get("currentIndex") ?? "0")

            setCurrentImageIndex(index)
            setImages(galleryImages)
          }
        fetchData()
    }, [])

    const onImageClicked = React.useCallback((selectedImageIndex) => {
        const params = new URLSearchParams(window.location.search)
        params.set("currentIndex", selectedImageIndex)
        history.replaceState(null, null, "?"+params.toString());

        setCurrentImageIndex(selectedImageIndex)
    }, [setCurrentImageIndex])

    return (
        <div className="gallery-container-inner">
            <div className="nav-overlay">
                <NavArrow key={"right" + currentImageIndex} direction="right" selectedIndex={currentImageIndex} elementsCount={images.length} clickCallback={onImageClicked}></NavArrow>
                <div className="nav-overlay-flex-space"></div>
                <NavArrow key={"left" + currentImageIndex} direction="left" selectedIndex={currentImageIndex} elementsCount={images.length} clickCallback={onImageClicked}></NavArrow>
            </div>
            <div className="main-image-container">
                <Image imageName={images[currentImageIndex].img}></Image>
            </div>
            <div className="thumbnails-container">
                {images.map((image, index) => <MiniImage key={index} isSelected={index === currentImageIndex} imageName={image.img} imageIndex={index} clickCallback={onImageClicked}></MiniImage>)}
            </div>
        </div>
    )
}

const NavArrow = (props) => {
    const navigate = React.useCallback(() => {
        let newIndex = props.selectedIndex;

        if(props.direction == "left") {
            newIndex--
        }

        if(props.direction == "right") {
            newIndex++
        }

        if(newIndex < 0) return;
        if(newIndex > props.elementsCount - 1) return;

        props.clickCallback(newIndex)
    }, [props.clickCallback])

    let visible = true;

    if(props.direction == "left" && props.selectedIndex == 0) {
        visible = false
    }

    if(props.direction == "right" && props.selectedIndex == props.elementsCount - 1) {
        visible = false
    }

    const wrapperClasses = visible ? "nav-arrow-wrapper" : "nav-arrow-wrapper inactive-arrow click-disable"
    const arrowDir = props.direction == "left" ? "arrow-left" : "arrow-right"
    const arrowActive = visible ? "arrow-active" : "arrow-inactive"

    return <div className={wrapperClasses} onClick={navigate}>
        <i className={"nav-arrow " + arrowDir + " " + arrowActive}></i>
    </div>

}

const MiniImage = (props) => {
    const miniImageClicked = React.useCallback(() => {
        props.clickCallback(props.imageIndex)
    })

    const miniImageClasses = props.isSelected ? "mini-image-wrapper mini-selected" : "mini-image-wrapper"

    return (<div className={miniImageClasses} onClick={miniImageClicked}>
        <Image imageName={props.imageName}></Image>
    </div>)
}

const Image = (props) => {
    const actualPath = "/resources/img/" + props.imageName

    return (
        <img className="fit" src={actualPath}></img>
    )
}




document.querySelectorAll('.gallery-container')
  .forEach(domContainer => {
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <ImageGallery></ImageGallery>
    );
  });