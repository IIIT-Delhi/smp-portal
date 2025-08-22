import React, { useState } from "react";
import { Card, Loading } from "../ui";
import axios from "axios";

const InitialSetup = ({ userDetails, onSetupComplete }) => {
    const [formData, setFormData] = useState({
        contact: "",
        imgSrc: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, photo: "Please select a valid image file (JPEG, PNG, GIF)" }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, photo: "File size must be less than 5MB" }));
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                setFormData(prev => ({
                    ...prev,
                    imgSrc: base64String
                }));
                setPhotoPreview(base64String);
                setErrors(prev => ({ ...prev, photo: "" }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.contact.trim()) {
            newErrors.contact = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contact.trim())) {
            newErrors.contact = "Please enter a valid 10-digit contact number";
        }

        if (!formData.imgSrc) {
            newErrors.photo = "Profile photo is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/completeInitialSetup/", {
                id: userDetails.id,
                contact: formData.contact.trim(),
                imgSrc: formData.imgSrc
            });

            if (response.data.first_login_completed) {
                onSetupComplete();
            }
        } catch (error) {
            console.error("Error completing setup:", error);
            setErrors({
                submit: error.response?.data?.error || "Failed to complete setup. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Loading fullScreen text="Setting up your profile..." size="lg" />
            </div>
        );
    }

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "500px",
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}>
                <Card headerTitle="Complete Your Profile" headerColor="primary">
                    <Card.Body>
                        <div className="text-center mb-4">
                            <h5 style={{ color: "var(--primary-dark-blue)", marginBottom: "8px" }}>
                                Welcome to SMP Portal!
                            </h5>
                            <p className="text-muted small">
                                Please update your contact details and upload a profile photo to get started.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Profile Photo Section */}
                            <div className="mb-4">
                                <label className="form-label" style={{ fontWeight: "600", color: "var(--primary-dark-blue)" }}>
                                    Profile Photo <span style={{ color: "var(--warning)" }}>*</span>
                                </label>

                                <div className="text-center">
                                    <div style={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "50%",
                                        border: "3px dashed var(--light-gray)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 16px auto",
                                        backgroundColor: "var(--light-gray)",
                                        backgroundImage: photoPreview ? `url(${photoPreview})` : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        overflow: "hidden"
                                    }}>
                                        {!photoPreview && (
                                            <span style={{ fontSize: "2rem", color: "var(--gray)" }}>📷</span>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        id="photoUpload"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        style={{ display: "none" }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('photoUpload').click()}
                                        style={{
                                            backgroundColor: "var(--accent-blue)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "8px 16px",
                                            fontSize: "0.875rem",
                                            fontWeight: "500",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {photoPreview ? "Change Photo" : "Upload Photo"}
                                    </button>
                                </div>

                                {errors.photo && (
                                    <div style={{ color: "var(--warning)", fontSize: "0.875rem", marginTop: "8px", textAlign: "center" }}>
                                        {errors.photo}
                                    </div>
                                )}
                            </div>

                            {/* Contact Number Section */}
                            <div className="mb-4">
                                <label className="form-label" style={{ fontWeight: "600", color: "var(--primary-dark-blue)" }}>
                                    Contact Number <span style={{ color: "var(--warning)" }}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    placeholder="Enter your 10-digit mobile number"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: `2px solid ${errors.contact ? "var(--warning)" : "var(--light-gray)"}`,
                                        borderRadius: "8px",
                                        fontSize: "1rem",
                                        outline: "none",
                                        transition: "border-color 0.3s ease"
                                    }}
                                    onFocus={(e) => {
                                        if (!errors.contact) {
                                            e.target.style.borderColor = "var(--accent-blue)";
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!errors.contact) {
                                            e.target.style.borderColor = "var(--light-gray)";
                                        }
                                    }}
                                />
                                {errors.contact && (
                                    <div style={{ color: "var(--warning)", fontSize: "0.875rem", marginTop: "4px" }}>
                                        {errors.contact}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        backgroundColor: "var(--primary-dark-blue)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        padding: "14px 24px",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.7 : 1,
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.target.style.backgroundColor = "var(--accent-blue)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.target.style.backgroundColor = "var(--primary-dark-blue)";
                                        }
                                    }}
                                >
                                    {loading ? "Setting up..." : "Complete Setup"}
                                </button>
                            </div>

                            {errors.submit && (
                                <div style={{
                                    color: "var(--warning)",
                                    fontSize: "0.875rem",
                                    marginTop: "12px",
                                    textAlign: "center",
                                    padding: "8px",
                                    backgroundColor: "rgba(220, 53, 69, 0.1)",
                                    borderRadius: "4px"
                                }}>
                                    {errors.submit}
                                </div>
                            )}
                        </form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default InitialSetup;
