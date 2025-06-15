import React, { useState } from "react";
import Table from "../components/Table";
import EditForm from "../components/EditForm";
import SearchBar from "../components/SearchBar";
import "../styles/product.css";

const Products = () => {
  const [data, setData] = useState([
    { id: 1, name: "T-Shirt", value: 200000, description: "Men's T-Shirt", all_rate: 4.5, category_id: 1, view: "https://example.com/image1.jpg" },
    { id: 2, name: "Dress Shirt", value: 300000, description: "Premium Dress Shirt", all_rate: 4.8, category_id: 1, view: "https://example.com/image2.jpg" },
    { id: 3, name: "Hat", value: 150000, description: "Fashionable Hat", all_rate: 4.2, category_id: 2, view: "https://example.com/image3.jpg" },
    { id: 4, name: "Sunglasses", value: 500000, description: "UV Protection Sunglasses", all_rate: 4.7, category_id: 2, view: "https://example.com/image4.jpg" },
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [editingItem, setEditingItem] = useState(null);
  const [adding, setAdding] = useState(false);


  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
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
    if (window.confirm("Are you sure you want to delete this product?")) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setFilteredData(newData);
    }
  };

  const handleBuy = (item) => {
    alert(`You have selected to buy: ${item.name} for ${item.value.toLocaleString()}₫`);
    // TODO: Thêm logic giỏ hàng ở đây
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "value", header: "Price" },
    { key: "description", header: "Description" },
    { key: "all_rate", header: "Rating" },
    { key: "category_id", header: "Category ID" },
    {
      key: "view",
      header: "View",
      render: (row) => (
        <img
          src={row.view}
          alt={row.name}
          width="50"
          height="50"
          className="product-img"
        />
      ),
    },
    {
      key: "buy",
      header: "Buy",
      render: (row) => (
        <button className="btn-buy" onClick={() => handleBuy(row)}>
          Buy
        </button>
      ),
    },
  ];

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="title">Products</h1>
        <button className="btn-add" onClick={() => setAdding(true)}>
          Add Product
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />

      <Table data={filteredData} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />

      {(editingItem || adding) && (
        <EditForm
          initialData={editingItem || { name: "", value: 0, description: "", all_rate: 0, category_id: 0, view: "" }}
          onSave={handleSave}
          onCancel={handleCancel}
          title={editingItem ? "Edit Product" : "Add Product"}
        />
      )}
    </div>
  );
};

export default Products;
