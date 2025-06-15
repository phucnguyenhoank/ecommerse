import React from "react";

type Category = {
  id: number;
  name: string;
  parent_id?: number | null;
  children?: Category[];
};

type Props = {
  categories: Category[];
  expandedIds: number[];
  onToggleExpand: (id: number) => void;
  onEdit: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  editingId: number | null;
  editingName: string;
  setEditingName: (name: string) => void;
  handleUpdate: () => void;
  cancelEdit: () => void;
};

const CategoryTree: React.FC<Props> = ({
  categories,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
  editingId,
  editingName,
  setEditingName,
  handleUpdate,
  cancelEdit
}) => {

  const renderTree = (list: Category[], level = 0) => {
    return list.map((cat) => (
      <div key={cat.id} style={{ paddingLeft: level * 20, marginBottom: 5 }}>
        {cat.children && cat.children.length > 0 && (
          <span
            style={{ cursor: "pointer", marginRight: 5, fontWeight: "bold" }}
            onClick={() => onToggleExpand(cat.id)}
          >
            {expandedIds.includes(cat.id) ? "▼" : "▶"}
          </span>
        )}

        {editingId === cat.id ? (
          <>
            <input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />
            <button onClick={handleUpdate}>💾</button>
            <button onClick={cancelEdit}>❌</button>
          </>
        ) : (
          <>
            {cat.name}{" "}
            <button onClick={() => onEdit(cat.id, cat.name)}>Sửa</button>
            <button onClick={() => onDelete(cat.id)}>Xoá</button>
          </>
        )}

        {expandedIds.includes(cat.id) && cat.children && renderTree(cat.children, level + 1)}
      </div>
    ));
  };

  return <div>{renderTree(categories)}</div>;
};

export default CategoryTree;
