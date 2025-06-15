import React from "react";

type Category = {
  id: number;
  name: string;
};

type Props = {
  newName: string;
  setNewName: (name: string) => void;
  selectedParent: number | null;
  setSelectedParent: (id: number | null) => void;
  flatCategories: Category[];
  handleAdd: () => void;
};

const CategoryForm: React.FC<Props> = ({
  newName,
  setNewName,
  selectedParent,
  setSelectedParent,
  flatCategories,
  handleAdd,
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Tên danh mục"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <select
        value={selectedParent ?? ""}
        onChange={(e) =>
          setSelectedParent(e.target.value ? parseInt(e.target.value) : null)
        }
      >
        <option value="">-- Không có cha --</option>
        {flatCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button onClick={handleAdd}>➕ Thêm</button>
    </div>
  );
};

export default CategoryForm;
