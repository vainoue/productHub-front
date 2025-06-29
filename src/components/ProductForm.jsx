import React, { useState } from "react";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import './ProductForm.css';

export default function ProductForm({ onAdd }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const navigate = useNavigate();

    const send = () => {
        if (!name || !price) {
            toast.warn("Please fill in all fields");
            return;
        }
        onAdd({ name, price: Number(price) });
        setName("");
        setPrice("");
    };

    return (
        <div className="product-form">
            <TextInput
                label="Name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextInput
                label="Price"
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <div className="button-group">
                <SubmitButton onClick={send}>ADD</SubmitButton>
                <button onClick={() => navigate("/products")} className="back-button">Back</button>
            </div>
        </div>
    );
}