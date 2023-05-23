import { useState, useRef } from "react";
import { usePost } from "@/features/app/context/PostContext";

import { Tag } from "@/components/post";

import "@assets/styles/pages/app/post.scss";

import arrow from "@assets/img/post/caret-down-solid.svg";
import imageIcon from "@assets/img/post/images-solid.svg";
import trashIcon from "@assets/img/post/trash-solid.svg";

function Post() {
  const { postImages } = usePost();

  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState<string>("");

  const [tags, setTags] = useState<string[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const images = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages(images);
      setImage(images[0]);
    }
  };

  const handleNavClick = (direction: "previous" | "next") => {
    const index = images.indexOf(image);

    if (direction === "previous") {
      if (index === 0) {
        setImage(images[images.length - 1]);
      } else {
        setImage(images[index - 1]);
      }
    } else {
      if (index === images.length - 1) {
        setImage(images[0]);
      } else {
        setImage(images[index + 1]);
      }
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const tag = e.currentTarget.value.trim();
      if (tag) {
        if (!tags.includes(tag) && tags.length < 20) {
          setTags([...tags, tag]);
          e.currentTarget.value = "";
        }
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageDrop = (
    e: React.DragEvent<HTMLLabelElement> | React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files) {
      const images = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages(images);
      setImage(images[0]);
    }
  };

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removePhoto = (photo: string) => {
    const index = images.indexOf(photo);
    const currentIndex = images.indexOf(image);
    if (index === currentIndex) {
      if (index === images.length - 1) {
        setImage(images[0]);
      } else {
        setImage(images[index + 1]);
      }
    }
    setImages(images.filter((image) => image !== photo));
  };

  const handleSubmit = async () => {
    const images = fileRef.current?.files;
    const description = descriptionRef.current?.value.trim();

    if (images && description && tags.length) {
      await postImages(images, description, tags);
    }
  };

  return (
    <div className="create-post">
      <h2>Create new post</h2>
      <div className="post_wrapper">
        <div className="post_content">
          <div className="post_image_wrapper">
            <div
              className="label"
              onDragEnter={preventDefault}
              onDragOver={preventDefault}
              onDrop={handleImageDrop}
            >
              {images.length > 0 ? (
                <div className="image__wrapper">
                  {images.length > 1 && (
                    <button
                      className="previous"
                      onClick={() => handleNavClick("previous")}
                    >
                      <img src={arrow} alt="" />
                    </button>
                  )}

                  <img src={image} alt="post" />
                  <button className="remove" onClick={() => removePhoto(image)}>
                    <img src={trashIcon} alt="" />
                  </button>
                  {images.length > 1 && (
                    <button
                      className="next"
                      onClick={() => handleNavClick("next")}
                    >
                      <img src={arrow} alt="" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="label_placeholder">
                  <img src={imageIcon} alt="" />
                  <span>Upload you photos here</span>
                  <label
                    htmlFor="image_input"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                  >
                    <div className="button">Select photos</div>
                  </label>
                </div>
              )}
              <input
                type="file"
                id="image_input"
                multiple
                name="image_input"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileRef}
              />
            </div>
          </div>
          <div className="post_input_wrapper">
            <div className="form__group">
              <label htmlFor="description">description</label>
              <textarea
                name="description"
                id="description"
                cols={30}
                rows={4}
                spellCheck={false}
                ref={descriptionRef}
              ></textarea>
            </div>
            <div className="form__group">
              <label htmlFor="tags">tags {tags.length}/20</label>
              <div className="tags__wrapper">
                <div className="selected_tags">
                  {tags.map((tag) => (
                    <Tag key={tag} tag={tag} removeTag={handleRemoveTag} />
                  ))}
                </div>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  onKeyDown={handleTagInput}
                />
              </div>
            </div>
            <div className="form__group">
              <button type="submit" onClick={handleSubmit}>
                post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
