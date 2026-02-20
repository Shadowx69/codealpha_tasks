import React, { useState } from "react";
import axios from "../utils/axios.js";
import "../styles/Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("addCategory");
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (endpoint) => {
    try {
      const response = await axios.post(endpoint, formData);
      setMessage(response.data.message);
      setFormData({});
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  const renderForm = (fields, submitEndpoint) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(submitEndpoint);
      }}
    >
      {fields.map(({ label, name, type = "text" }) => (
        <div key={name}>
          <label>{label}</label>
          <input
            type={type}
            name={name}
            value={formData[name] || ""}
            onChange={handleInputChange}
            required
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "addCategory":
        return renderForm(
          [
            { label: "Category Name", name: "CategoryName" },
            { label: "Description", name: "Description" },
          ],
          "/adminR/add-category"
        );
      case "updateCategory":
        return renderForm(
          [
            { label: "Category ID", name: "CategoryID" },
            { label: "Category Name", name: "CategoryName" },
            { label: "Description", name: "Description" },
          ],
          "/adminR/update-category"
        );
      case "deleteCategory":
        return renderForm(
          [{ label: "Category ID", name: "CategoryID" }],
          "/adminR/delete-category"
        );
      case "addProduct":
        return renderForm(
          [
            { label: "Product Name", name: "ProductName" },
            { label: "Description", name: "Description" },
            { label: "Price", name: "Price", type: "number" },
            { label: "Stock", name: "Stock", type: "number" },
            { label: "Category ID", name: "CategoryID", type: "number" },
            { label: "Cover (URL)", name: "Cover" },
          ],
          "/adminR/add-product"
        );
      case "updateProduct":
        return renderForm(
          [
            { label: "Product ID", name: "ProductID", type: "number" },
            { label: "Product Name", name: "ProductName" },
            { label: "Description", name: "Description" },
            { label: "Price", name: "Price", type: "number" },
            { label: "Stock", name: "Stock", type: "number" },
            { label: "Category ID", name: "CategoryID", type: "number" },
            { label: "Cover (URL)", name: "Cover" },
          ],
          "/adminR/update-product"
        );
      case "deleteProduct":
        return renderForm(
          [{ label: "Product ID", name: "ProductID", type: "number" }],
          "/adminR/delete-product"
        );
      default:
        return <div>Select a tab to manage data</div>;
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <nav>
          <button
            className={activeTab === "addCategory" ? "active" : ""}
            onClick={() => setActiveTab("addCategory")}
          >
            Add Category
          </button>
          <button
            className={activeTab === "updateCategory" ? "active" : ""}
            onClick={() => setActiveTab("updateCategory")}
          >
            Update Category
          </button>
          <button
            className={activeTab === "deleteCategory" ? "active" : ""}
            onClick={() => setActiveTab("deleteCategory")}
          >
            Delete Category
          </button>
          <button
            className={activeTab === "addProduct" ? "active" : ""}
            onClick={() => setActiveTab("addProduct")}
          >
            Add Product
          </button>
          <button
            className={activeTab === "updateProduct" ? "active" : ""}
            onClick={() => setActiveTab("updateProduct")}
          >
            Update Product
          </button>
          <button
            className={activeTab === "deleteProduct" ? "active" : ""}
            onClick={() => setActiveTab("deleteProduct")}
          >
            Delete Product
          </button>
        </nav>
      </header>
      <div className="admin-content">
      
        {message && (
          <p
            className={`message-box${message.includes("error") ? " error" : ""}`}
          >
            {message}
          </p>
        )}
        {renderTabContent()}
     
      </div>
    </div>
  );
};

export default Admin;
