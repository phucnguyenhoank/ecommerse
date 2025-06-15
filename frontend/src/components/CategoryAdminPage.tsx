import React, { JSX, useEffect, useState } from "react";

// ==== TYPES ====
type Product = {
  id: number;
  name: string;
  description: string;
  all_rate: number;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
  products: Product[];
  parent?: { id: number; name: string } | null;
  children?: Category[];
};

// ==== COMPONENT ====
const CategoryAdminPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [newName, setNewName] = useState("");
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        setFlatCategories(data);
        setCategories(buildTree(data));
      });
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setExpandedIds([]);
      setSearching(false);
      return;
    }

    const matchedIds: number[] = [];

    const findMatches = (cats: Category[]) => {
      cats.forEach((cat) => {
        const match = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (match) {
          let parent = cat.parent;
          while (parent) {
            matchedIds.push(parent.id);
            parent = flatCategories.find((c) => c.id === parent?.id)?.parent || null;
          }
        }
        if (cat.children?.length) {
          findMatches(cat.children);
        }
      });
    };

    findMatches(categories);
    setExpandedIds([...new Set(matchedIds)]);
    setSearching(true);
  }, [searchTerm]);

  const buildTree = (flatList: Category[]): Category[] => {
    const idMap: { [key: number]: Category & { children: Category[] } } = {};
    const roots: Category[] = [];

    flatList.forEach((cat) => {
      idMap[cat.id] = { ...cat, children: [] };
    });

    flatList.forEach((cat) => {
      const parentId = cat.parent?.id ?? null;
      if (parentId) {
        idMap[parentId].children.push(idMap[cat.id]);
      } else {
        roots.push(idMap[cat.id]);
      }
    });

    return roots;
  };

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("Vui lòng nhập tên");
      return;
    }
    fetch("http://localhost:3001/api/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, parent_id: selectedParent }),
    }).then(() => window.location.reload());
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:3001/api/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    }).then(() => window.location.reload());
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn xoá?")) {
      fetch(`http://localhost:3001/api/categories/${id}/delete`, {
        method: "DELETE",
      }).then(() => window.location.reload());
    }
  };

  const renderFlatList = (list: Category[], level = 0): JSX.Element[] => {
    let items: JSX.Element[] = [];

    list.forEach((cat) => {
      const match = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingChildren =
        cat.children?.some((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (searchTerm && !match && !hasMatchingChildren) return;

      items.push(
        <div
          key={cat.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderBottom: "1px solid #eee",
            paddingLeft: `${level * 20}px`,
            background: "#fff",
          }}
        >
          {cat.children && cat.children.length > 0 ? (
            <span
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                width: "20px",
                textAlign: "center",
                padding: "20px",
              }}
              onClick={() => handleToggleExpand(cat.id)}
            >
              {expandedIds.includes(cat.id) ? "▼" : "▶"}
            </span>
          ) : (
            <span style={{ width: "20px", padding: "20px" }}></span>
          )}

          {editingId === cat.id ? (
            <>
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                style={{ flex: 1, padding: "4px" }}
              />
              <button onClick={handleUpdate}>💾</button>
              <button onClick={() => setEditingId(null)}>❌</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1 }}>
                {searchTerm ? (
                  <>{cat.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, idx) =>
                    part.toLowerCase() === searchTerm.toLowerCase()
                      ? <mark key={idx}>{part}</mark>
                      : <span key={idx}>{part}</span>
                  )}</>
                ) : (
                  cat.name
                )}
              </span>
              <button onClick={() => handleEdit(cat.id, cat.name)}>✏️ Sửa</button>
              <button onClick={() => handleDelete(cat.id)}>🗑️ Xoá</button>
            </>
          )}
        </div>
      );

      if (expandedIds.includes(cat.id) && cat.children?.length) {
        items = items.concat(renderFlatList(cat.children, level + 1));
      }
    });

    return items;
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center", padding: "20px" }}>🗂️ Quản lý danh mục</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Tên danh mục"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: "8px", flex: "1 1 200px" }}
        />
        <select
          value={selectedParent ?? ""}
          onChange={(e) =>
            setSelectedParent(e.target.value ? parseInt(e.target.value) : null)
          }
          style={{ padding: "8px", flex: "1 1 200px" }}
        >
          <option value="">Không có danh mục cha</option>
          {flatCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder=" Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", flex: "1 1 200px" }}
        />
        <button onClick={handleAdd} style={{ padding: "8px 16px" }}>
          ➕ Thêm
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {renderFlatList(categories)}
      </div>
    </div>
  );
};

export default CategoryAdminPage;
