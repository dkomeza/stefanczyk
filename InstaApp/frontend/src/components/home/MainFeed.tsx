import { useEffect, useState } from "react";
import { usePost } from "@/features/app/context/PostContext";
import Post, { IPost } from "./Post";

function MainFeed() {
  const { fetchPosts } = usePost();
  const [posts, setPosts] = useState([] as IPost[]);

  useEffect(() => {
    async function loadPosts() {
      const posts = await fetchPosts();
      const parsedPosts = [] as IPost[];
      posts.forEach((post) => {
        const parsedImages = post.images.map((image) => {
          const obj = {
            id: image,
            url: "",
          };
          return obj;
        });
        parsedPosts.push({ ...post, images: parsedImages });
      });
      setPosts(parsedPosts);
      // loadImages(parsedPosts);
    }
    loadPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default MainFeed;
