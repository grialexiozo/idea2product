import { tr } from "@faker-js/faker";

export const styles = [
  {
    "id": "photoRestoration",
    "nameKey": "styles.photoRestoration.name",
    "descriptionKey": "styles.photoRestoration.description",
    "prompt": "restore and colorize this photo. Repair the damaged white background. Maintain the consistency between the characters and the background",
    "previewImage": "/styles/image1.png",
    "resultImage": "/styles/p1.png",
    "isMulti": false
  },
  {
    "id": "styleTransfer",
    "nameKey": "styles.styleTransfer.name",
    "descriptionKey": "styles.styleTransfer.description",
    "prompt": "Transform to $Style$, while maintaining women and pose unchanged",
    "previewImage": "/styles/image2.png",
    "resultImage": "/styles/p2.png",
    "isMulti": false
  },
  {
    "id": "imageFusion",
    "nameKey": "styles.imageFusion.name",
    "descriptionKey": "styles.imageFusion.description",
    "prompt": "Change image to the man and women to hug together, while maintaining the same facial features, hairstyle, and expression",
    "previewImage": "/styles/image3.png",
    "resultImage": "/styles/p3.png",
    "isMulti": true
  },
  {
    "id": "productShowcase",
    "nameKey": "styles.productShowcase.name",
    "descriptionKey": "styles.productShowcase.description",
    "prompt": "Place the item in the picture on the table. Keep the items, the table and the background unchanged.",
    "previewImage": "/styles/image4.png",
    "resultImage": "/styles/p4.png",
    "isMulti": true
  },
  {
    "id": "modelProductFusion",
    "nameKey": "styles.modelProductFusion.name",
    "descriptionKey": "styles.modelProductFusion.description",
    "prompt": "The change involved a woman holding a blue bag for a live stream display, maintaining the consistency of the character unchanged",
    "previewImage": "/styles/image5.png",
    "resultImage": "/styles/p5.png",
    "isMulti": false
  },
  // {
  //   "id": "modelProductFusion",
  //   "nameKey": "styles.modelProductFusion.name",
  //   "descriptionKey": "styles.modelProductFusion.description",
  //   "prompt": "The change involved a woman holding a blue bag for a live stream display, maintaining the consistency of the character unchanged",
  //   "previewImage": "/styles/image6.png",
  //   "resultImage": "/styles/p6.png",
  //   "isMulti": true
  // },
  {
    "id": "nailArt",
    "nameKey": "styles.nailArt.name",
    "descriptionKey": "styles.nailArt.description",
    "prompt": "Make a nail art pattern on the fingernails. Nail Art, $style$ Printed pattern on Nail Art, beautiful, bright, comforting, soft lighting. Do not make any changes except for your fingernails.",
    "previewImage": "/styles/image7.png",
    "resultImage": "/styles/p7.png",
    "isMulti": false
  },


  {
    "id": "backgroundReplacement",
    "nameKey": "styles.backgroundReplacement.name",
    "descriptionKey": "styles.backgroundReplacement.description",
    "prompt": "Change the background to in the classroom of the school, keep the subject in the exact same position and pose",
    "previewImage": "/styles/image8.png",
    "resultImage": "/styles/p8.png",
    "isMulti": false
  },
  {
    "id": "objectRemoval",
    "nameKey": "styles.objectRemoval.name",
    "descriptionKey": "styles.objectRemoval.description",
    "prompt": "Remove the watermarks and text from the picture, while keeping all other details unchanged",
    "previewImage": "/styles/image9.png",
    "resultImage": "/styles/p9.png",
    "isMulti": false
  },
  {
    "id": "ipAdapterStyleTransfer",
    "nameKey": "styles.ipAdapterStyleTransfer.name",
    "descriptionKey": "styles.ipAdapterStyleTransfer.description",
    "prompt": "Using this image style, a woman and a man are looking up at the sky by the stream, 18-years-old",
    "previewImage": "/styles/image10.png",
    "resultImage": "/styles/p10.png",
    "isMulti": false
  },  
  {
    "id": "addModelToClothing",
    "nameKey": "styles.addModelToClothing.name",
    "descriptionKey": "styles.addModelToClothing.description",
    "prompt": "Add a model to the clothing, keep the clothing and the background unchanged",
    "previewImage": "/styles/image11.png",
    "resultImage": "/styles/p11.png",
    "isMulti": false
  },
  {
    "id": "partialEdit",
    "nameKey": "styles.partialEdit.name",
    "descriptionKey": "styles.partialEdit.description",
    "prompt": "Partial adjustment, only modify the selected part (e.g. hair color, clothes, accessories), keep all other details unchanged.",
    "previewImage": "/styles/image12.png",
    "resultImage": "/styles/p12.png",
    "isMulti": false
  }
]