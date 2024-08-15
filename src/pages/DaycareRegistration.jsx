import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8000/api/v1";

// Styled components
const Container = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    marginTop: 25,
});

const FormContainer = styled(Box)({
    padding: '30px',
    border: "2px solid silver",
    maxWidth: "450px",
    backgroundColor: "white",
});

const StyledTextField = styled(TextField)({
    marginTop: "20px",
});

const ButtonContainer = styled(Box)({
    display: 'flex',
    marginTop: "10px",
});

const DaycareRegistration = () => {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login-register");
        }
        if (role !== "DAYCARE_OWNER") {
            navigate("/");
        }
    }, [token, role, navigate]);

    const cityOptions = [
        "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane",
        "Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi",
        "Panaji", "Margao", "Vasco da Gama", "Mapusa"
    ];

    const [daycareData, setDaycareData] = useState({
        name: "",
        lowerAgeLimit: "",
        higherAgeLimit: "",
        city: "",
        fullAddress: "",
        contactNumber: "",
        aboutUs: "",
    });

    const [image, setImage] = useState(null);

    const [daycareDataError, setDaycareDataError] = useState({
        name: "",
        lowerAgeLimit: "",
        higherAgeLimit: "",
        city: "",
        fullAddress: "",
        contactNumber: "",
        aboutUs: "",
        image: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDaycareData((prev) => ({ ...prev, [name]: value }));
        setDaycareDataError((prev) => ({ ...prev, [name]: "" }));
    };

    const createFormData = (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]); 
        }
        formData.append("registrationFee", 500);
        formData.append("image", image);

        return formData;
    };

    const validate = () => {
        let tempErrors = {};
        if (!daycareData.name) tempErrors.name = "Name is required";
        if (!image) tempErrors.image = "Image is required";
        if (!daycareData.city) tempErrors.city = "City is required";
        if (!daycareData.fullAddress) tempErrors.fullAddress = "Address is required";
        if (!daycareData.aboutUs) tempErrors.aboutUs = "About us is required";
        if (!daycareData.lowerAgeLimit) tempErrors.lowerAgeLimit = "Lower Age Limit is required";
        else if (isNaN(daycareData.lowerAgeLimit) || daycareData.lowerAgeLimit <= 0) tempErrors.lowerAgeLimit = "Lower age limit must be a positive number";
        if (!daycareData.higherAgeLimit) tempErrors.higherAgeLimit = "Higher Age Limit is required";
        else if (isNaN(daycareData.higherAgeLimit) || daycareData.higherAgeLimit <= 0) tempErrors.higherAgeLimit = "Higher age limit must be a positive number";
        if (!daycareData.contactNumber) tempErrors.contactNumber = "Contact Number is required";
        if (!/^[6-9]\d{9}$/.test(daycareData.contactNumber)) tempErrors.contactNumber = "Please enter a valid 10-digit contact number";

        setDaycareDataError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const response = await axios({
                    method: "post",
                    url: BASE_URL + "/daycare",
                    data: createFormData(daycareData),
                    headers: {
                        "content-type": "multipart/form-data",
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.data) {
                    toast.success("Daycare registered successfully.");
                    navigate(`/daycare-dashboard/${response.data.id}`);
                }
            } catch (err) {
                toast.error("An error occurred during registration!");
                console.error(err);
            }
        }
    };

    return (
        <Container>
            <FormContainer>
                <Typography>Daycare Registration Form</Typography>
                <StyledTextField
                    fullWidth
                    name="name"
                    size='small'
                    label="Name"
                    value={daycareData.name}
                    onChange={handleChange}
                    error={!!daycareDataError.name}
                    helperText={daycareDataError.name}
                    margin="normal"
                />
                <StyledTextField
                    fullWidth
                    name="lowerAgeLimit"
                    size='small'
                    label="Lower Age Limit"
                    type="number"
                    value={daycareData.lowerAgeLimit}
                    onChange={handleChange}
                    error={!!daycareDataError.lowerAgeLimit}
                    helperText={daycareDataError.lowerAgeLimit}
                    margin="normal"
                />
                <StyledTextField
                    fullWidth
                    name="higherAgeLimit"
                    size='small'
                    label="Higher Age Limit"
                    type="number"
                    value={daycareData.higherAgeLimit}
                    onChange={handleChange}
                    error={!!daycareDataError.higherAgeLimit}
                    helperText={daycareDataError.higherAgeLimit}
                    margin="normal"
                />
                <StyledTextField
                    fullWidth
                    name="contactNumber"
                    size='small'
                    label="Contact Number"
                    type="number"
                    value={daycareData.contactNumber}
                    onChange={handleChange}
                    error={!!daycareDataError.contactNumber}
                    helperText={daycareDataError.contactNumber}
                    margin="normal"
                />
                <StyledTextField
                    fullWidth
                    name="fullAddress"
                    size='small'
                    label="Address"
                    value={daycareData.fullAddress}
                    onChange={handleChange}
                    error={!!daycareDataError.fullAddress}
                    helperText={daycareDataError.fullAddress}
                    margin="normal"
                />
                <StyledTextField
                    fullWidth
                    type="file"
                    name="image"
                    size='small'
                    onChange={(e) => {
                        setDaycareDataError(prev => ({ ...prev, image: "" }));
                        setImage(e.target.files[0]);
                    }}
                    error={!!daycareDataError.image}
                    helperText={daycareDataError.image}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal" error={!!daycareDataError.city}>
                    <InputLabel>City</InputLabel>
                    <Select
                        fullWidth
                        name="city"
                        size='small'
                        value={daycareData.city}
                        onChange={handleChange}
                        margin="normal"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {cityOptions.map((city, index) => (
                            <MenuItem key={index} value={city}>{city}</MenuItem>
                        ))}
                    </Select>
                    {daycareDataError.city && (
                        <span style={{ color: "red", textAlign: "left", fontSize: "13px", marginLeft: "10px" }}>
                            {daycareDataError.city}
                        </span>
                    )}
                </FormControl>
                <StyledTextField
                    fullWidth
                    multiline
                    rows={5}
                    name="aboutUs"
                    size='small'
                    label="About Us"
                    value={daycareData.aboutUs}
                    onChange={handleChange}
                    error={!!daycareDataError.aboutUs}
                    helperText={daycareDataError.aboutUs}
                    margin="normal"
                />
                <StyledTextField
                    fullWidth
                    disabled
                    name="registrationFee"
                    size='small'
                    label="Registration Fee: ₹500"
                    margin="normal"
                />
                <ButtonContainer>
                    <Button fullWidth variant='outlined'>Cancel</Button>
                    <Button onClick={handleSubmit} fullWidth variant='contained' sx={{ ml: 1 }}>Submit and Pay</Button>
                </ButtonContainer>
            </FormContainer>
        </Container>
    );
};

export default DaycareRegistration;
