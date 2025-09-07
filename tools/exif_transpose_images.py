import os

from PIL import Image, ImageOps

for subdir, dirs, files in os.walk("resources"):
    for filename in files:
        if filename.endswith(".jpg"):
            ## create full file path
            filePath = os.path.join(subdir, filename)
            print("Processing file:", filePath)
            image = Image.open(filePath)
            image = ImageOps.exif_transpose(image)

            image.save(filePath)  # Overwrite the original image


