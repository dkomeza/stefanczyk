import * as fs from "fs";
import formidable from "formidable";
import { ImageModel } from "../models/ImageModel.js";

class FileController {
  protected imageController: ImageController;

  constructor() {
    this.imageController = new ImageController();
  }

  public saveImage(album: string, images: formidable.File[]) {
    if (album && images) {
      this.imageController.saveImage(album, images);
    }
  }

  public removeAllImages() {
    this.imageController.removeAllImages();
  }
}

class ImageController {
  public saveImage(album: string, images: formidable.File[]) {
    this.checkAlbumExists(album);

    for (const image of images) {
      this.copyImage(album, image);
      this.removeImage(image);
      this.saveImageToDB(album, image);
    }
  }

  private checkAlbumExists(album: string) {
    if (!fs.existsSync(`./uploads/${album}`)) {
      fs.mkdirSync(`./uploads/${album}`);
    }
  }

  private copyImage(album: string, image: formidable.File) {
    fs.cpSync(image.filepath, `./uploads/${album}/${image.newFilename}`);
  }

  private removeImage(image: formidable.File) {
    if (fs.existsSync(image.filepath)) {
      fs.rmSync(image.filepath);
    }
  }

  public async removeAllImages() {
    const files = fs.readdirSync("./uploads");

    for (const file of files) {
      if (file !== ".gitignore") {
        fs.rmSync(`./uploads/${file}`, {
          recursive: true,
          force: true,
        });
      }
    }

    await ImageModel.deleteMany({}).exec();
  }

  private saveImageToDB(album: string, image: formidable.File) {
    const newImage = new ImageModel({
      album,
      originalName: image.originalFilename,
      path: `./uploads/${album}/${image.newFilename}`,
      lastChangeOperation: "create",
      history: [
        {
          desc: "Image created",
          operation: "create",
          path: `./uploads/${album}/${image.newFilename}`,
        },
      ],
    });
    newImage.save();
  }
}

export default new FileController();
