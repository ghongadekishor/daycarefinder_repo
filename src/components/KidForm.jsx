import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8000/api/v1";

// Styled components
const FormContainer = styled(Box)({
    padding: '30px',
    border: "0px solid black",
    maxWidth: "450px",
    backgroundColor: "silver",
});

const StyledTextField = styled(TextField)({
    marginTop: "20px",
});

const ButtonContainer = styled(Box)({
    display: 'flex',
    marginTop: "10px",
});

const Admission = ({ initialData, setIsDialogOpen, loadMyKids }) => {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login-register")
        }
    }, [])

    const [kidData, setKidData] = useState(initialData)

    const [kidDataError, setKidDataError] = useState({
        name: "",
        age: "",
        sex: "",
        address: "",
        contact: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKidData(prev => ({ ...prev, [name]: value }))
        setKidDataError(prev => ({ ...prev, [name]: "" }))
    }


    const validate = () => {
        let tempErrors = {};
        if (!kidData.name) tempErrors.name = "Name is required";
        if (!kidData.sex) tempErrors.sex = "Sex is required";
        if (!kidData.address) tempErrors.address = "Address is required";
        if (!kidData.age) tempErrors.age = "Age is required";
        else if (isNaN(kidData.age) || kidData.age <= 0) tempErrors.age = "Age must be a positive number";
        if (!kidData.contact) tempErrors.contact = "Parent contact is required";
        else if (!/^\d{10}$/.test(kidData.contact)) tempErrors.contact = "Parent contact must be a 10-digit number";

        setKidDataError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const response = await axios({
                    method: "PUT",
                    url: BASE_URL + "/kids/" + kidData.id,
                    data: JSON.stringify(kidData),
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.data) {
                    loadMyKids();
                    toast.success("Kid updated successfully!")
                }
            } catch (err) {
                toast.error("Some error occurred while updating kid!")
                console.error(err);
            } finally {
                setIsDialogOpen(false);
            }
        }
    }

    return (
        <FormContainer>
            <Typography>Admission Form</Typography>
            <StyledTextField
                fullWidth
                name="name"
                size='small'
                label="Name"
                value={kidData.name}
                onChange={handleChange}
                error={!!kidDataError.name}
                helperText={kidDataError.name}
                margin="normal"
            />
            <StyledTextField
                fullWidth
                name="age"
                size='small'
                label="Age"
                type="number"
                value={kidData.age}
                onChange={handleChange}
                error={!!kidDataError.age}
                helperText={kidDataError.age}
                margin="normal"
            />
            <FormControl fullWidth margin="normal" error={!!kidDataError.sex}>
                <InputLabel>Sex</InputLabel>
                <Select
                    fullWidth
                    name="sex"
                    size='small'
                    value={kidData.sex}
                    onChange={handleChange}
                    error={!!kidDataError.sex}
                    margin="normal"
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                </Select>
                {kidDataError.sex && <span style={{ color: "red", textAlign: "left", fontSize: "13px", marginLeft: "10px" }}>{kidDataError.sex}</span>}
            </FormControl>

            <StyledTextField
                fullWidth
                name="address"
                size='small'
                label="Address"
                value={kidData.address}
                onChange={handleChange}
                error={!!kidDataError.address}
                helperText={kidDataError.address}
                margin="normal"
            />
            <StyledTextField
                fullWidth
                name="contact"
                size='small'
                label="Contact Number"
                value={kidData.contact}
                onChange={handleChange}
                error={!!kidDataError.contact}
                helperText={kidDataError.contact}
                margin="normal"
            />
            <ButtonContainer>
                <Button fullWidth variant='outlined'>Cancel</Button>
                <Button onClick={handleSubmit} fullWidth variant='contained' sx={{ ml: 1 }}>Update</Button>
            </ButtonContainer>
        </FormContainer>
    );
};

export default Admission;
