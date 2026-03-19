function Categories({ categories, selected, setSelected }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
      <button
        className="btn"
        style={{ background: selected === "All" ? "#00abf0" : "rgba(255,255,255,0.1)", color: "#fff" }}
        onClick={() => setSelected("All")}
      >
        All
      </button>
      {categories.map((c, i) => (
        <button
          key={i}
          className="btn"
          style={{ background: selected === c ? "#00abf0" : "rgba(255,255,255,0.1)", color: "#fff" }}
          onClick={() => setSelected(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default Categories;