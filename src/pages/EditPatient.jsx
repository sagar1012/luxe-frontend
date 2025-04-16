import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Paper,
} from "@mui/material";
import axios from "axios";

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        contactNo: "",
        address: "",
    });
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
    const [errors, setErrors] = useState({});

    const fetchPatient = useCallback(async () => {
        try {
            const res = await axios.get(`https://luxe-api-production-d5c9.up.railway.app/api/patients/${id}`);
            setFormData(res.data);
        } catch (err) {
            setSnack({ open: true, message: "Failed to load patient", severity: "error" });
        }
    }, [id]);

    useEffect(() => {
        fetchPatient();
    }, [fetchPatient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\+\d{10,15}$/;

        if (!formData.contactNo) {
            newErrors.contactNo = "Contact number is required";
        } else if (!phoneRegex.test(formData.contactNo)) {
            newErrors.contactNo = "Include country code, e.g. +1234567890";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await axios.put(`https://luxe-api-production-d5c9.up.railway.app/api/patients/${id}`, formData);
            setSnack({ open: true, message: "Patient updated successfully!", severity: "success" });
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (error) {
            setSnack({ open: true, message: "Failed to update patient", severity: "error" });
        }
    };

    const handleBack = () => navigate("/dashboard");

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f0f0",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 600,
                    borderRadius: "16px",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Edit Patient
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <TextField
                        label="Age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <TextField
                        label="Contact Number (with country code)"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.contactNo}
                        helperText={errors.contactNo}
                        placeholder="+1234567890"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{
                                borderColor: "#7b6e4b",
                                color: "#7b6e4b",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#7b6e4b",
                                    color: "#fff",
                                },
                            }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: "#7b6e4b",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#6a5c3d",
                                },
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                </form>

                <Snackbar
                    open={snack.open}
                    autoHideDuration={3000}
                    onClose={() => setSnack({ ...snack, open: false })}
                >
                    <Alert severity={snack.severity}>{snack.message}</Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default EditPatient;
