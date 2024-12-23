export const getPaintProps = async (paint: Paint) => {
    let imageProps = {}
    if (paint.type === 'IMAGE') {
         imageProps = {
            image: paint.imageHash ? figma.getImageByHash(paint.imageHash) : undefined,
         }
    }

    return {
        ...paint,
        imageProps
    }
}