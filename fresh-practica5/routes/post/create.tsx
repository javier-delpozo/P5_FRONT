import { useSignal } from "@preact/signals";

export default function CreatePost() {
  const title = useSignal("");
  const cover = useSignal("");
  const content = useSignal("");
  const author = useSignal("");
  const message = useSignal("");
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (title.value.length < 3 || content.value.length < 5 || author.value.length < 3) {
      message.value = "Por favor completa todos los campos con longitud mínima.";
      return;
    }
    loading.value = true;
    const body = { title: title.value, cover: cover.value, content: content.value, author: author.value };
    try {
      const res = await fetch("https://back-p5-y0e1.onrender.com/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        message.value = `Creado con ID ${data.id}`;
      } else {
        message.value = `Error: ${data.message || "No se pudo crear"}`;
      }
    } catch {
      message.value = "Error de red.";
    } finally {
      loading.value = false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Título" value={title.value} onInput={(e) => title.value = e.currentTarget.value} required />
      <input type="text" placeholder="Cover URL" value={cover.value} onInput={(e) => cover.value = e.currentTarget.value} />
      <textarea placeholder="Contenido" value={content.value} onInput={(e) => content.value = e.currentTarget.value} required />
      <input type="text" placeholder="Autor" value={author.value} onInput={(e) => author.value = e.currentTarget.value} required />
      <button type="submit" disabled={loading.value}>{loading.value ? "Enviando..." : "Crear"}</button>
      <p>{message.value}</p>
    </form>
  );
}