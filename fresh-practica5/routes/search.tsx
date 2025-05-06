import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export default function Search() {
  const searchTerm = useSignal("");
  const results = useSignal([]);

  useEffect(() => {
    if (searchTerm.value.length === 0) {
      results.value = [];
      return;
    }
    fetch(`https://back-p5-y0e1.onrender.com/api/posts?search=${searchTerm.value}`)
      .then(res => res.json())
      .then(data => results.value = data);
  }, [searchTerm.value]);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar posts..."
        value={searchTerm.value}
        onInput={(e) => searchTerm.value = e.currentTarget.value}
      />
      <ul>
        {results.value.map((post: any) => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>Autor: {post.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
