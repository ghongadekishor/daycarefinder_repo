import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8000/api/v1";

// Styled components
const Container = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '50px',
    marginTop: 80,
});

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

const PaymentContainer = styled(Box)({
    padding: "20px",
    width: "400px",
    border: "1px solid black",
});

const Admission = () => {
    const navigate = useNavigate();
    const param = useParams();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login-register")
        }
    }, [])

    const [kidData, setKidData] = useState({
        name: "",
        age: "",
        sex: "",
        address: "",
        contact: ""
    })

    const [kidId, setKidId] = useState("");

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
        if(!kidData.contact.match(/^[6-9]\d{9}$/)) tempErrors.contact = "Please enter a valid contact number";
        else if (!/^\d{10}$/.test(kidData.contact)) tempErrors.contact = "Parent contact must be a 10-digit number";

        setKidDataError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const response = await axios({
                    method: "post",
                    url: BASE_URL + `/kids/${param.id}`,
                    data: JSON.stringify(kidData),
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.data) {
                    setKidId(response.data.id)
                    toast.success("Kid admitted successfully, please proceed with the payment.")

                }
            } catch (err) {
                toast.error("Some error occurred while submitting admission form!")
                console.error(err)
            }
        }
    }

    const handlePayment = async () => {
        try {
            const paymentData = {
                admissionFee: 5000,
                tuitionFee: 2000,
                culturalActivityFee: 500,
                otherFee: 500,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            }
            const response = await axios({
                method: "post",
                url: BASE_URL + "/fee-payment/" + kidId,
                data: JSON.stringify(paymentData),
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            if (response.data) {
                toast.success("Fee payment successful")
                navigate("/kids-dashboard")
            }
        } catch (err) {
            toast.error("Some error occurred while paying fee!")
            console.error(err)
        }
    }

    return (
        <Container>
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
                        margin="normal"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {kidDataError.sex && (
                        <span style={{ color: "red", textAlign: "left", fontSize: "13px", marginLeft: "10px" }}>
                            {kidDataError.sex}
                        </span>
                    )}
                </FormControl>

                <StyledTextField
                    fullWidth
                    name="address"
                    size="small"
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
                    <Button fullWidth variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} fullWidth variant="contained" sx={{ ml: 1 }}>
                        Submit
                    </Button>
                </ButtonContainer>
            </FormContainer>

            <Box>
                <PaymentContainer>
                    <span style={{ color: "red", fontSize: "22px", fontWeight: 600 }}>Fee Structure</span>
                    <Divider sx={{ bgcolor: "red" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Admission Fee: </span>
                        <span>5000</span>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Tuition Fee: </span>
                        <span>2000</span>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Cultural Activity Fee: </span>
                        <span>500</span>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Other Fee: </span>
                        <span>500</span>
                    </Box>
                    <Divider sx={{ bgcolor: "black", mt: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Total Amount: </span>
                        <span>8000</span>
                    </Box>
                    <Button onClick={handlePayment} disabled={!kidId} fullWidth variant="contained" sx={{ mt: 2 }}>
                        Pay 9000
                    </Button>
                </PaymentContainer>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 1, mt: 2 }}>
                    <span style={{ color: "green" }}>Click on the below link to avail the 10% offer on admission fee.</span>
                    <Button onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf94XKUj8OihX17vg2RCkAbuWhbCbMC1gO0H3aRL7Mg59DYEQ/viewform?usp=sf_link', '_blank')} sx={{ marginTop: 1 }}>
                        Link
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Admission;
