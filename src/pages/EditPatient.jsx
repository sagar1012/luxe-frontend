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
    Grid,
} from "@mui/material";
import axios from "axios";

// Helper function to format phone number
const formatPhoneNumber = (value) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, ""); // Remove all non-digit characters
    const match = cleaned.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?/);

    if (match) {
        return `(${match[1] || ""}) ${match[2] || ""}${match[3] ? `-${match[3]}` : ""}`;
    }
    return value;
};

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        contactNo: "",
        age: "",
        startDate: "",
    });
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPatient = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://luxe-api-production-d5c9.up.railway.app/api/patients/${id}`);
            setFormData(res.data);
        } catch (err) {
            setSnack({ open: true, message: "Failed to load patient", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPatient();
    }, [fetchPatient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactNo") {
            setFormData((prev) => ({
                ...prev,
                [name]: formatPhoneNumber(value), // Format phone number as user types
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Phone format: (123) 456-7890

        if (!formData.contactNo) {
            newErrors.contactNo = "Contact number is required";
        } else if (!phoneRegex.test(formData.contactNo)) {
            newErrors.contactNo = "Format should be (123) 456-7890";
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

    if (loading) {
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
                <Typography variant="h6">Loading patient data...</Typography>
            </Box>
        );
    }

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
                    maxWidth: 800,
                    borderRadius: "16px",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Edit Patient
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Contact Number"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.contactNo}
                                helperText={errors.contactNo}
                                placeholder="(123) 456-7890"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Zipcode"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                name="startDate"
                                value={formData.startDate?.slice(0, 10) || ""}
                                onChange={handleChange}
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Box mt={3} display="flex" justifyContent="space-between">
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
