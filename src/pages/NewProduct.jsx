import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../services/api";
import { toast } from "react-toastify";
import "../App.css"

export default function NewProduct() {
    const navigate = useNavigate();

    const handleAdd = async (product) => {
        try {
            await createProduct(product);
            toast.success("New product added!");
            navigate("/products");
        } catch (error) {
            toast.error(error.message.includes("price") ? "Invalid price" : "Error: " + error.message);
        }
    };

    return (
        <div className="app-container">
            <h2>Add New Product</h2>
            <ProductForm onAdd={handleAdd} />
        </div>
    )
}