import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const res = await fetch("https://back-p5-y0e1.onrender.com/api/posts");
    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status);
      return ctx.render({ posts: [] });
    }
    const json = await res.json();
    const posts = json?.data?.posts || [];
    return ctx.render({ posts });
  },
};

export default function Home({ data }: PageProps<{ posts: any[] }>) {
  const { posts } = data;

  return (
    <div>
      <h1>Listado de Posts</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {posts.map((post) => (
          <div
            key={post._id}
            style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
          >
            <h2>{post.title}</h2>
            <img src={post.cover} alt={post.title} style={{ width: "100px" }} />
            <p>{post.content}</p>
            <p>Autor: {post.author}</p>
            <p>Likes: {post.likes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
