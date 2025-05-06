import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const res = await fetch(`https://back-p5-y0e1.onrender.com/api/posts/${id}`);
    const post = await res.json();
    return ctx.render({ post });
  },
};

export default function PostPage({ data }: PageProps) {
  const { post } = data;
  const likeMessage = useSignal("");

  const handleLike = async () => {
    const res = await fetch(`https://back-p5-y0e1.onrender.com/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      likeMessage.value = "¡Me gusta enviado!";
      location.reload();
    } else {
      likeMessage.value = "Error al enviar me gusta.";
    }
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.cover} width="300" />
      <p>{post.content}</p>
      <p>Autor: {post.author}</p>
      <button onClick={handleLike}>Me gusta ({post.likes})</button>
      <p>{likeMessage.value}</p>
      <h3>Comentarios</h3>
      <ul>
        {post.comments.map((c: any) => (
          <li>{c.text} - <i>{c.author}</i></li>
        ))}
      </ul>
    </div>
  );
}
