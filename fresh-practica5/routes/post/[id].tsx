import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    try {
      const res = await fetch(`https://back-p5-y0e1.onrender.com/api/posts/${id}`);
      if (!res.ok) {
        return ctx.render({ post: null });
      }
      const json = await res.json();
      return ctx.render({ post: json.data?.post || null });
    } catch (error) {
      console.error("Error fetching post:", error);
      return ctx.render({ post: null });
    }
  },
};

export default function PostPage({ data }: PageProps<{ post: any }>) {
  // Asegurarnos de que data no sea null
  const post = data?.post;
  const likeMessage = useSignal("");
  const loading = useSignal(false);

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Post no encontrado</h1>
        <a href="/" style={{ color: "#0066cc" }}>Volver al inicio</a>
      </div>
    );
  }

  const handleLike = async () => {
    loading.value = true;
    likeMessage.value = "";
    try {
      const res = await fetch(
        `https://back-p5-y0e1.onrender.com/api/posts/${post._id}/like`,
        { method: "POST" }
      );
      
      if (res.ok) {
        likeMessage.value = "¡Gracias por tu like!";
        setTimeout(() => location.reload(), 1000);
      } else {
        const errorData = await res.json();
        likeMessage.value = errorData.message || "Error al enviar el like";
      }
    } catch (error) {
      likeMessage.value = "Error de red al enviar el like";
    } finally {
      loading.value = false;
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <a href="/" style={{ display: "inline-block", marginBottom: "20px", color: "#0066cc" }}>
        ← Volver al listado
      </a>
      
      <div style={{ 
        backgroundColor: "#b2f2bb",
        padding: "20px",
        border: "1px solid #000",
        marginBottom: "20px"
      }}>
        {post.cover && (
          <img 
            src={post.cover} 
            alt={post.title} 
            style={{ maxWidth: "100%", marginBottom: "15px", border: "1px solid #000" }}
          />
        )}
        <h1 style={{ margin: "0 0 10px 0" }}>{post.title}</h1>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <p style={{ margin: "0" }}>Autor: {post.author}</p>
          <button 
            onClick={handleLike} 
            disabled={loading.value}
            style={{ 
              backgroundColor: loading.value ? "#cccccc" : "#b2f2bb",
              border: "1px solid #000",
              padding: "5px 15px",
              cursor: loading.value ? "not-allowed" : "pointer"
            }}
          >
            {loading.value ? "Enviando..." : `❤️ Like (${post.likes || 0})`}
          </button>
        </div>
        
        <p style={{ whiteSpace: "pre-line", margin: "0 0 15px 0" }}>{post.content}</p>
        
        {likeMessage.value && (
          <p style={{ 
            padding: "10px",
            backgroundColor: likeMessage.value.includes("Gracias") ? "#e8f5e9" : "#ffebee",
            color: likeMessage.value.includes("Gracias") ? "#2e7d32" : "#c62828",
            margin: "10px 0 0 0"
          }}>
            {likeMessage.value}
          </p>
        )}
      </div>
      
      <div style={{ 
        backgroundColor: "#b2f2bb",
        padding: "20px",
        border: "1px solid #000"
      }}>
        <h3 style={{ margin: "0 0 15px 0" }}>Comentarios</h3>
        
        {post.comments && post.comments.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
            {post.comments.map((c: any) => (
              <li key={c._id} style={{ 
                padding: "10px",
                borderBottom: "1px solid #000",
                marginBottom: "10px"
              }}>
                <p style={{ margin: "0 0 5px 0" }}>{c.text}</p>
                <p style={{ margin: "0", fontStyle: "italic", fontSize: "0.9em" }}>
                  — {c.author}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: "0" }}>No hay comentarios aún.</p>
        )}
      </div>
    </div>
  );
}