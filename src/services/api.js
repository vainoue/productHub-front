const API_BASE = import.meta.env.VITE_API_URL;

const PRODUCT_API_URL = `${API_BASE}/api/Products`;
const USER_API_URL = `${API_BASE}/api/Users`;

export async function getProducts() {
    const res = await fetch(PRODUCT_API_URL);
    return res.json();
}

export async function createProduct(product) {
    const res = await fetch(PRODUCT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Product could not be created");
    }
    return res.json();
}

export async function removeProduct(id) {
    return fetch(`${PRODUCT_API_URL}/${id}`, {
        method: "DELETE",
    });
}

export async function editProduct(id, data) {
    const res = await fetch(`${PRODUCT_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update product");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
}

export async function registerUser(userData) {
    const res = await fetch(`${USER_API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson || "User could not be created");
    }
    return res.json();
}

export async function loginUser(userData) {
    const res = await fetch(`${USER_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Username or password invalid");
    }
    return res.json();
}

export async function updateUser(userData) {
    const res = await fetch(`${USER_API_URL}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update user");
    }
    return res.json();
}

export async function updateUserPhoto(formData) {
    const res = await fetch(`${USER_API_URL}/update-photo`, {
        method: "PUT",
        body: formData,
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to upload photo");
    }
    return res.json();
}

export async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === parseInt(id));
}
