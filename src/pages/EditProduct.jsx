import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, editProduct as updateProduct } from "../services/api";
import EditProductForm from "../components/EditProductForm";
import { toast } from "react-toastify";
import "../App.css"

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            const product = await getProductById(id);
            if (product) {
                setProduct(product);
            } else {
                toast.error("Product not found");
                navigate("/products");
            }
        };
        loadProduct();
    }, [id, navigate]);

    const handleSave = async (product) => {
        try {
            await updateProduct(product.id, product);
            toast.success("Product updated!");
            navigate("/products");
        } catch (error) {
            toast.error("Error updating product: " + error.message);
        }
    };

    const handleCancel = () => {
        navigate("/products");
    };

    return (
        <div className="app-container">
            <h2>Edit Product</h2>
            {product && (<EditProductForm
                product={product}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            )}
        </div>
    )
}