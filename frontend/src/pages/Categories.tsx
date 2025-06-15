import React, { useState } from "react";
import Table from "../components/Table";
import EditForm from "../components/EditForm";
import SearchBar from "../components/SearchBar";
import "../styles/categories.css";

const Categories = () => {
  const [data, setData] = useState([
    { id: 1, name: "T-shirt", category: "Clothing" },
    { id: 2, name: "Shirt", category: "Clothing" },
    { id: 3, name: "Hat", category: "Accessories" },
    { id: 4, name: "Sunglasses", category: "Accessories" },
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [editingItem, setEditingItem] = useState(null);
  const [adding, setAdding] = useState(false);

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "category", header: "Category" },
  ];

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.category.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  };

  const handleEdit = (item) => setEditingItem(item);

  const handleSave = (updatedItem) => {
    if (updatedItem.id) {
      setData(data.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    } else {
      const newId = data.length ? Math.max(...data.map((item) => item.id)) + 1 : 1;
      setData([...data, { ...updatedItem, id: newId }]);
    }
    setEditingItem(null);
    setAdding(false);
    setFilteredData(data);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setFilteredData(newData);
    }
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1 className="title">Categories</h1>
        <button className="btn-add" onClick={() => setAdding(true)}>Add Category</button>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Display Table */}
      <Table data={filteredData} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />

      {(editingItem || adding) && (
        <EditForm
          initialData={editingItem || { name: "", category: "" }}
          onSave={handleSave}
          onCancel={handleCancel}
          title={editingItem ? "Edit Category" : "Add Category"}
        />
      )}
    </div>
  );
};

export default Categories;