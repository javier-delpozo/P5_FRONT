import { useSignal } from "@preact/signals";

export default function SearchPage() {
  const search = useSignal("");
  const results = useSignal<any[]>([]);
  const loading = useSignal(false);

  const fetchResults = async (term: string) => {
    if (term.trim() === "") {
      results.value = [];
      return;
    }

    loading.value = true;
    try {
      const res = await fetch(`https://back-p5-y0e1.onrender.com/api/posts?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      results.value = data.data?.posts || [];
    } catch (error) {
      console.error("Error al buscar posts:", error);
      results.value = [];
    } finally {
      loading.value = false;
    }
  };

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    search.value = value;
    fetchResults(value);
  };

  return (
    <div>
      <h1>Búsqueda de Posts</h1>

      <input
        type="text"
        placeholder="Escribe para buscar..."
        value={search.value}
        onInput={handleInput}
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />

      {loading.value && <p>Buscando...</p>}

      <ul>
        {results.value.length === 0 ? (
          <li>No hay resultados.</li>
        ) : (
          results.value.map((post) => (
            <li key={post._id} style={{ marginBottom: "10px" }}>
              <strong>{post.title}</strong> — {post.author}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
