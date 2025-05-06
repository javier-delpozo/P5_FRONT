import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";

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
  const isGridView = useSignal(true);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Listado de Posts</h1>
        <button onClick={() => isGridView.value = !isGridView.value}>
          {isGridView.value ? "Vista Lista" : "Vista Cuadrícula"}
        </button>
      </div>

      {isGridView.value ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.cover && <img src={post.cover} alt={post.title} />}
              <h2>{post.title}</h2>
              <p>Autor: {post.author}</p>
              <p style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", 
                         WebkitLineClamp: "3", WebkitBoxOrient: "vertical" }}>
                {post.content}
              </p>
              <p>Likes: {post.likes}</p>
              <a href={`/post/${post._id}`}>Ver más</a>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post._id} className="post-card" style={{ marginBottom: "20px" }}>
              <h2>{post.title}</h2>
              <p>Autor: {post.author}</p>
              <p style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", 
                         WebkitLineClamp: "2", WebkitBoxOrient: "vertical" }}>
                {post.content}
              </p>
              <p>Likes: {post.likes}</p>
              <a href={`/post/${post._id}`}>Ver más</a>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <a href="/search"><button>Ir a Buscar</button></a>
        <a href="/post/create"><button>Crear Nuevo Post</button></a>
      </div>
    </div>
  );
}