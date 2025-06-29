import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import { updateUser, updateUserPhoto } from "../services/api";
import { useNavigate } from "react-router-dom";
import './Style.css';

export default function EditProfile() {
    const { user, updateUserContext } = useAuth();
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState(user?.birthdate || "");
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const currentPhoto = user?.photo ? `data:image/*;base64,${user.photo}` : null;

    useEffect(() => {
        /*console.log("user:", user);*/
        if (user?.photo) {
            /*setPreview(`data:image/*;base64,${user.photo}`);*/
            setPreview(null);
        }
        if (user?.email && email === "") {
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const normalizedEmail = email.trim();

        if (!normalizedEmail && !birthdate && !photo) {
            toast.warn("Please fill at least one field");
            return;
        }

        try {
            if (normalizedEmail || birthdate) {
                const userUpdateData = {
                    username: user.username,
                    ...(normalizedEmail && { email: normalizedEmail }),
                    ...(birthdate && { birthdate }),
                };
                await updateUser(userUpdateData);
                updateUserContext({
                    ...(normalizedEmail && { email: normalizedEmail }),
                    ...(birthdate && { birthdate }),
                });
            }

            if (photo) {
                const formData = new FormData();
                formData.append("userId", user.id.toString());
                formData.append("file", photo);

                await updateUserPhoto(formData);
                updateUserContext({ photo: await convertToBase64(photo) });
            }

            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error("Error updating profile");
        }
    };

    const handlePhoto = (e) => {

        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setIsPreviewModalOpen(true);
            setPreview(URL.createObjectURL(file));
        }

    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="edit-profile-center">
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>
                {currentPhoto && (<img src={currentPhoto} alt="Current Photo" className="photo-preview" />)}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="photo">Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        className="file-input"
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="birthdate">Birthdate</label>
                    <input
                        type="date"
                        value={birthdate?.split("T")[0] || ""}
                        onChange={(e) => setBirthdate(e.target.value)}
                    />
                    <button type="submit" className="submit-button">Save changes</button>
                    <button type="button" onClick={() => navigate("/products")} className="submit-button">Back</button>
                </form>
                {isPreviewModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Preview new photo</h3>
                            {preview && <img src={preview} alt="Preview" className="photo-preview" />}
                            <div className="modal-buttons">
                                <button onClick={() => setIsPreviewModalOpen(false)} className="submit-button">Ok</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}