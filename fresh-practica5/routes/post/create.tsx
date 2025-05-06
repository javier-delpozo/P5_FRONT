import { useSignal } from "@preact/signals";

export default function CreatePost() {
  const title = useSignal("");
  const cover = useSignal("");
  const content = useSignal("");
  const author = useSignal("");
  const message = useSignal({ text: "", isError: false });
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (title.value.length < 3) {
      message.value = { text: "El título debe tener al menos 3 caracteres", isError: true };
      return;
    }
    if (content.value.length < 10) {
      message.value = { text: "El contenido debe tener al menos 10 caracteres", isError: true };
      return;
    }
    if (author.value.length < 3) {
      message.value = { text: "El autor debe tener al menos 3 caracteres", isError: true };
      return;
    }

    loading.value = true;
    const body = { 
      title: title.value, 
      cover: cover.value, 
      content: content.value, 
      author: author.value 
    };
    
    try {
      const res = await fetch("https://back-p5-y0e1.onrender.com/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      if (res.ok) {
        message.value = { 
          text: `Post creado exitosamente con ID ${data.data?.post?._id || 'N/A'}`, 
          isError: false 
        };
        title.value = "";
        cover.value = "";
        content.value = "";
        author.value = "";
      } else {
        message.value = { 
          text: `Error: ${data.message || "No se pudo crear el post"}`, 
          isError: true 
        };
      }
    } catch (error) {
      message.value = { text: "Error de red al intentar crear el post", isError: true };
    } finally {
      loading.value = false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Nuevo Post</h1>
      
      <div>
        <label>Título*</label>
        <input
          type="text"
          placeholder="Título del post"
          value={title.value}
          onInput={(e) => title.value = e.currentTarget.value}
          required
        />
        <p style={{ fontSize: "12px", marginTop: "5px" }}>Mínimo 3 caracteres</p>
      </div>
      
      <div>
        <label>URL de la imagen de portada</label>
        <input
          type="text"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={cover.value}
          onInput={(e) => cover.value = e.currentTarget.value}
        />
      </div>
      
      <div>
        <label>Contenido*</label>
        <textarea
          placeholder="Escribe el contenido del post aquí..."
          value={content.value}
          onInput={(e) => content.value = e.currentTarget.value}
          rows={6}
          required
        />
        <p style={{ fontSize: "12px", marginTop: "5px" }}>Mínimo 10 caracteres</p>
      </div>
      
      <div>
        <label>Autor*</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={author.value}
          onInput={(e) => author.value = e.currentTarget.value}
          required
        />
        <p style={{ fontSize: "12px", marginTop: "5px" }}>Mínimo 3 caracteres</p>
      </div>
      
      <button type="submit" disabled={loading.value}>
        {loading.value ? "Creando..." : "Crear Post"}
      </button>
      
      {message.value.text && (
        <p style={{ 
          padding: "10px",
          backgroundColor: message.value.isError ? "#ffebee" : "#e8f5e9",
          color: message.value.isError ? "#c62828" : "#2e7d32"
        }}>
          {message.value.text}
        </p>
      )}
    </form>
  );
}