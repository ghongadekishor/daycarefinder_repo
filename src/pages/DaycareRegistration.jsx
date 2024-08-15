import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';



const BASE_URL = "http://localhost:8000/api/v1";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px',
        marginTop: 25,

    },
    formContainer: {
        padding: '30px',
        border: "2px solid silver",
        maxWidth: "450px",
        backgroundColor: "white",
    },
    textField: {
        marginTop: "20px",
    },
    buttonContainer: {
        display: 'flex',
        marginTop: "10px",
    },
    paymentConatiner: {
        padding: "20px",
        width: "400px",
        border: "1px solid black",
    }
}));


const DaycareRegistration = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(()=> {
        if(!token) {
            navigate("/login-register")
        }
        if(role!="DAYCARE_OWNER"){
            navigate("/")
        }
    },[])

    const cityOptions = [
        "Mumbai",
        "Pune",
        "Nagpur",
        "Nashik",
        "Aurangabad",
        "Thane",
        "Bengaluru",
        "Mysuru",
        "Mangaluru",
        "Hubballi",
        "Belagavi",
        "Panaji",
        "Margao",
        "Vasco da Gama",
        "Mapusa"
      ];      

    const [daycareData, setDaycareData] = useState({
        name: "",
        lowerAgeLimit: "",
        higherAgeLimit: "",
        city: "",
        fullAddress: "",
        contactNumber: "",
        aboutUs: "",
    })

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
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDaycareData(prev => ({ ...prev, [name]: value }))
        setDaycareDataError(prev => ({ ...prev, [name]: "" }))
    }

    const createFormData = (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]); // Appending other data
        }
        formData.append("registrationFee", 500)
        formData.append("image", image)
  
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
        if (!daycareData.contactNumber) tempErrors.contactNumber = "Parent contactNumber is required";
        if(!daycareData.contactNumber.match(/^[6-9]\d{9}$/)) tempErrors.contactNumber = "Please enter a valid contact number";
        else if (!/^\d{10}$/.test(daycareData.contactNumber)) tempErrors.contactNumber = "Parent contactNumber must be a 10-digit number";

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
                    toast.success("Daycare registered successfully.")
                    navigate(`/daycare-dashboard/${response.data.id}`);
                  }
            } catch (err) {
                toast.error("Some error occurred while registration!")
                console.error(err)
            }
        }
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.formContainer}>
                <Typography>Daycare Registration Form</Typography>
                <TextField
                    fullWidth
                    name="name"
                    size='small'
                    label="Name"
                    className={classes.textField}
                    value={daycareData.name}
                    onChange={handleChange}
                    error={!!daycareDataError.name}
                    helperText={daycareDataError.name}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    name="lowerAgeLimit"
                    size='small'
                    label="Lower Age Limit"
                    type="number"
                    className={classes.textField}
                    value={daycareData.lowerAgeLimit}
                    onChange={handleChange}
                    error={!!daycareDataError.lowerAgeLimit}
                    helperText={daycareDataError.lowerAgeLimit}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    name="higherAgeLimit"
                    size='small'
                    label="Higher Age Limit"
                    type="number"
                    className={classes.textField}
                    value={daycareData.higherAgeLimit}
                    onChange={handleChange}
                    error={!!daycareDataError.higherAgeLimit}
                    helperText={daycareDataError.higherAgeLimit}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    name="contactNumber"
                    size='small'
                    label="Contact Number"
                    type="number"
                    className={classes.textField}
                    value={daycareData.contactNumber}
                    onChange={handleChange}
                    error={!!daycareDataError.contactNumber}
                    helperText={daycareDataError.contactNumber}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    name="fullAddress"
                    size='small'
                    label="Address"
                    className={classes.textField}
                    value={daycareData.fullAddress}
                    onChange={handleChange}
                    error={!!daycareDataError.fullAddress}
                    helperText={daycareDataError.fullAddress}
                    margin="normal"
                />
                 <TextField
                    fullWidth
                    type="file"
                    name="image"
                    size='small'
                    className={classes.textField}
                    onChange={(e)=> {
                        setDaycareDataError(e=> ({...daycareDataError, image: ""}));
                        setImage(e.target.files[0])}}
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
                        error={!!daycareDataError.city}
                        helperText={daycareDataError.city}
                        margin="normal"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {cityOptions.map(city =>(
                            <MenuItem value={city}>{city}</MenuItem>
                        ))}
                    </Select>
                    {daycareDataError.city && <span style={{ color: "red", textAlign: "left", fontSize: "13px", marginLeft: "10px" }}>{daycareDataError.city}</span>}
                </FormControl>
                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    type="text"
                    name="aboutUs"
                    size='small'
                    label="About Us"
                    className={classes.textField}
                    value={daycareData.aboutUs}
                    onChange={handleChange}
                    error={!!daycareDataError.aboutUs}
                    helperText={daycareDataError.aboutUs}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    disabled
                    type="text"
                    name="registrationFee"
                    size='small'
                    label="Registration Fee : ₹500"
                    className={classes.textField}
                    value={daycareData.registrationFee}
                    onChange={handleChange}
                    error={!!daycareDataError.registrationFee}
                    helperText={daycareDataError.registrationFee}
                    margin="normal"
                />
                <Box className={classes.buttonContainer}>
                    <Button fullWidth variant='outlined'>Cancel</Button>
                    <Button onClick={() => handleSubmit()} fullWidth variant='contained' sx={{ ml: 1 }}>Submit and Pay</Button>
                </Box>

            </Box>

        </Box>
    )
}

export default DaycareRegistration