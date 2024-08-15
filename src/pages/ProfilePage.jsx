import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography, Box, Button, Grid, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import Header from '../components/Header';
import Snackbar from "../components/Snackbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from '@mui/material/Alert';

const BASE_URL = "http://localhost:8000/api/v1";

const theme = createTheme();

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    marginTop: theme.spacing(4),
}));

const InfoBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    marginTop: theme.spacing(4),
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const Label = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(2),
    fontWeight: 'bold',
}));

const Value = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
}));

const ProfilePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [user, setUser] = useState();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [address, setAddress] = useState();
    const [contactNumberError, setContactNumberError] = useState(false);
    const [role, setRole] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [contactNumber, setContactNumber] = useState();
    const [passwordError, setPasswordError] = useState(false);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let er = false;

        const data = {
            email: formData.get("email"),
            contactNumber: formData.get("contactNumber"),
            address: formData.get("address"),
            password: formData.get("password"),
            name: formData.get("firstName") + " " + formData.get("lastName"),
            role: user.role
        };

        const { email, contactNumber, password } = data;
        if (email === "" || !validateEmail(email)) {
            er = true;
            setEmailError(true);
        } else {
            setEmailError(false);
        }

        if (formData.get("firstName") === "") {
            er = true;
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }

        if (formData.get("lastName") === "") {
            er = true;
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }

        if (formData.get("address") === "") {
            er = true;
            setAddressError(true);
        } else {
            setAddressError(false);
        }

        if (contactNumber === "" || contactNumber.length !== 10) {
            er = true;
            setContactNumberError(true);
        } else {
            setContactNumberError(false);
        }
        if (password === "") {
            er = true;
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }

        try {
            if (er) throw "Invalid form data";
            const response = await axios({
                method: "put",
                url: BASE_URL + "/users/update/" + user.id,
                data: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (response.data) {
                loadLoggedInUserProfile();
                setFirstName("");
                setLastName("");
                setEmail("");
                setContactNumber("");
                setRole("");
                setAddress("");
            }
        } catch (err) {
            setError(true);
            setTimeout(() => setError(false), 5000);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        loadLoggedInUserProfile();
    }, []);

    const loadLoggedInUserProfile = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}/users/logged-in-user`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setUser(response.data);
            } else {
                setSnackbarMessage("Couldn't load profile");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Couldn't load profile");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    };

    const handleEditProfile = () => {
        const name = user.name.split(" ");
        setFirstName(name[0]);
        setLastName(name[name.length - 1]);
        setEmail(user.email);
        setContactNumber(user.contactNumber);
        setAddress(user.address);
    };

    return (
        <div style={{ background: "#F1F3F6" }}>
            <Header />
            <Box sx={{ mt: 9, padding: 5 }}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <StyledContainer maxWidth="sm" sx={{ padding: 3 }}>
                            <Box sx={{ paddingTop: 1, paddingLeft: 1, mb: 1, bgcolor: "#fff" }} display="flex">
                                <Typography variant="h4" gutterBottom>
                                    Profile
                                </Typography>
                            </Box>

                            {user && (
                                <InfoBox sx={{ paddingTop: 2, paddingLeft: 1, pb: 2, mb: 1, bgcolor: "#fff" }}>
                                    <InfoItem>
                                        <Label>Name:</Label>
                                        <Value>{user.name}</Value>
                                    </InfoItem>
                                    <InfoItem>
                                        <Label>ID:</Label>
                                        <Value>{user.id}</Value>
                                    </InfoItem>
                                    <InfoItem>
                                        <Label>Role:</Label>
                                        <Value>{user.role}</Value>
                                    </InfoItem>
                                    <InfoItem>
                                        <Label>Address:</Label>
                                        <Value>{user.address}</Value>
                                    </InfoItem>
                                    <InfoItem>
                                        <Label>Contact Number:</Label>
                                        <Value>{user.contactNumber}</Value>
                                    </InfoItem>
                                    <InfoItem>
                                        <Label>Email:</Label>
                                        <Value>{user.email}</Value>
                                    </InfoItem>
                                </InfoBox>
                            )}
                            <StyledButton
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{
                                    background: `radial-gradient(circle, rgba(63,219,251,0.7120973389355743) 26%, rgba(252,70,107,1) 100%);`,
                                }}
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </StyledButton>
                        </StyledContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <ThemeProvider theme={theme}>
                            <Container sx={{ marginTop: 0, bgcolor: "#fff", padding: 1 }} component="main" maxWidth="xs">
                                <CssBaseline />
                                <Box
                                    sx={{
                                        marginTop: 8,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography component="h1" variant="h5">
                                        Edit Profile
                                    </Typography>
                                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="firstName"
                                                    required
                                                    fullWidth
                                                    id="firstName"
                                                    label="First Name"
                                                    autoFocus
                                                    error={firstNameError}
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="lastName"
                                                    label="Last Name"
                                                    name="lastName"
                                                    error={lastNameError}
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Email Address"
                                                    name="email"
                                                    error={emailError}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="address"
                                                    label="Address"
                                                    name="address"
                                                    error={addressError}
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    name="contactNumber"
                                                    label="Contact Number"
                                                    type="number"
                                                    id="contactNumber"
                                                    error={contactNumberError}
                                                    value={contactNumber}
                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    error={passwordError}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Box>
                            </Container>
                        </ThemeProvider>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={6000} message={snackbarMessage} severity={snackbarSeverity} />
        </div>
    );
};

export default ProfilePage;
