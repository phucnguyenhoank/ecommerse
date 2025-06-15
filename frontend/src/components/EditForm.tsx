import React, { useState } from "react";
import "../styles/editForm.css";

const EditForm = ({ initialData, onSave, onCancel, title }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(initialData).map((key) => {
            // Bỏ qua id nếu không cần chỉnh sửa
            if(key === "id") return null;
            return (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                <input 
                  type={key === "all_rate" ? "number" : "text"} 
                  name={key} 
                  value={formData[key]} 
                  onChange={handleChange} 
                  required
                  step={key === "all_rate" ? "0.1" : undefined}
                />
              </label>
            );
          })}
          <div className="form-buttons">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;