import { useEffect, useState } from "react";

import "@assets/styles/app/home/post.scss";

import arrow from "@assets/img/post/caret-down-solid.svg";
import heart from "@assets/img/home/heart-regular.svg";
import heartSolid from "@assets/img/home/heart-solid.svg";
import comment from "@assets/img/home/comment-regular.svg";
import { usePost } from "@/features/app/context/PostContext";
import { Link } from "react-router-dom";

export interface IPost {
  id: string;
  author: string;
  description: string;
  images: {
    id: string;
    url: string;
  }[];
  lastChangeTime: string;
  lastChangeOperation: string;
  likes: string[];
  comments: string[];
  liked: boolean;
  tags: string[];
}

function Post(props: { post: IPost }) {
  const { post } = props;

  const [Post, setPost] = useState(post);

  const [images, setImages] = useState(
    post.images.map((image) => {
      const obj = {
        id: image.id,
        url: "",
        loaded: false,
      };
      return obj;
    })
  );

  const { likePost, fetchImage, fetchPreview } = usePost();

  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes.length);
  const [index, setIndex] = useState(0);
  const [shortDescription, setShortDescription] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    loadPreview();
    loadImage();
    setInterval(() => {
      setTime(calculateTime());
    }, 1000);
  }, []);

  const getShortDescription = (description: string) => {
    if (description.length > 150) {
      return description.slice(0, 150) + "...";
    }
    return description;
  };

  const handleNavClick = (direction: "previous" | "next") => {
    if (index === 0 && direction === "previous") {
      setIndex(post.images.length - 1);
    }
    if (index === post.images.length - 1 && direction === "next") {
      setIndex(0);
    }
    if (direction === "previous" && index > 0) {
      setIndex(index - 1);
    }
    if (direction === "next" && index < post.images.length - 1) {
      setIndex(index + 1);
    }
  };

  const loadImage = async () => {
    images.forEach(async (image, i) => {
      const url = await fetchImage(image.id);
      const newImages = [...images];
      newImages[i].url = url;
      newImages[i].loaded = true;
      setImages(newImages);
    });
  };

  const loadPreview = async () => {
    images.forEach(async (image, i) => {
      if (image.loaded) {
        return;
      }
      const url = await fetchPreview(image.id);
      const newImages = [...images];
      newImages[i].url = url;
      setImages(newImages);
    });
  };

  const handleLikeClick = () => {
    likePost(Post.id);
    setLiked(!liked);
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
  };

  const calculateTime = () => {
    const now = new Date();
    const postDate = new Date(Post.lastChangeTime);
    const diff = now.getTime() - postDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    if (days > 0) {
      return `${days}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    if (seconds > 0) {
      return `${seconds}s`;
    }
    return "now";
  };

  return (
    <div className="post">
      <div className="post__header">
        <div className="left">
          <div className="post__author">
            <div className="post__author__avatar">
              <Link to={`/profile/@${Post.author}`}>
                <img src="https://picsum.photos/50" alt="avatar" />
              </Link>
            </div>
            <div className="post__author__name">
              <Link to={`/profile/@${Post.author}`}>
                <span>@{Post.author}</span>
              </Link>
            </div>
          </div>
          <span className="dot"></span>
          <div className="post__time">
            <span>{time}</span>
          </div>
        </div>
        <div className="right">
          <button className="post__menu">...</button>
        </div>
      </div>
      <div className="post__content">
        <div className="post__image">
          <div className="image__wrapper">
            {images[index] && images[index].url ? (
              <>
                {!images[index].loaded && (
                  <div className="spinner">
                    <div className="circle-border">
                      <div className="circle-core"></div>
                    </div>
                  </div>
                )}
                {images.length > 1 && (
                  <button
                    className="previous"
                    onClick={() => handleNavClick("previous")}
                  >
                    <img src={arrow} alt="" />
                  </button>
                )}
                <img
                  src={images[index].url}
                  alt="post"
                  className={images[index].loaded ? "loaded" : "loading"}
                  draggable={false}
                />
                {images.length > 1 && (
                  <button
                    className="next"
                    onClick={() => handleNavClick("next")}
                  >
                    <img src={arrow} alt="" />
                  </button>
                )}
              </>
            ) : (
              <div className="loading"></div>
            )}
          </div>
        </div>
        <div className="post__actions">
          <div className="row">
            <div className="left">
              <button className="like" onClick={handleLikeClick}>
                {liked ? (
                  <img src={heartSolid} alt="like" />
                ) : (
                  <img src={heart} alt="like" />
                )}
              </button>
              <button className="comment">
                <img src={comment} alt="comment" />
              </button>
            </div>
            <div className="right"></div>
          </div>
          <div className="row">
            <span className="like-count left">
              {likes} {likes !== 1 ? "likes" : "like"}
            </span>
          </div>
        </div>
        <div className="post__description">
          <div className="desc">
            <span className="author">{Post.author}</span>
            {shortDescription ? (
              <span className="description">
                {getShortDescription(Post.description)}
              </span>
            ) : (
              <span className="description">{Post.description}</span>
            )}
          </div>
          {Post.description.length > 150 && (
            <button
              className="more"
              onClick={() => setShortDescription(!shortDescription)}
            >
              {shortDescription ? "more" : "less"}
            </button>
          )}
        </div>
        <div className="post__tags">
          {Post.tags &&
            Post.tags.map((tag) => (
              <Link className="tag" to={`/search/#${tag}`} key={tag}>
                #{tag}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
