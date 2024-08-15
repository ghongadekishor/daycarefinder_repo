import React, { useState, useEffect } from 'react';
import { Typography, Button, Container, Grid, TextField, Box, Card, CardMedia, MenuItem, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

const useStyles = makeStyles((theme) => ({
    hero: {
        backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_68GGxJsL_Q_dvAMONRisBWbA3nbH-LSDGg&s)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
    },
    section: {
        padding: '50px 0',
        marginTop: "10px",
    },
    featureCard: {
        padding: '20px',
        textAlign: 'left',
    }
}));

const LandingPage = () => {
    const classes = useStyles();

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    const [cityFilter, setCityFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const [daycares, setDaycares] = useState();
    const navigate = useNavigate();

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

    useEffect(()=> {
        loadDaycare();
      },[])
    
      const loadDaycare = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    url: BASE_URL + `/daycare`,
                    headers: {
                      "content-type": "application/json",
                    },
                  });
            
                  if (response.data) {
                    setDaycares(response.data)
                  }
            } catch (err) {
                console.error(err)
            }
    }

    const handleCityChange = (event) => {
        setCityFilter(event.target.value);
    };

    const handleAgeChange = (event) => {
        setAgeFilter(event.target.value);
    };

    const filteredDaycares = daycares?.filter(daycare => {
        return (
            (!cityFilter || daycare.city === cityFilter) &&
            (!ageFilter || (daycare.lowerAgeLimit<=ageFilter && daycare.higherAgeLimit>=ageFilter))
        );
    });

    return (
        <>
            <Box className={classes.hero}>
                <Container>
                    <Typography variant="h2">Welcome to Our Daycare Finder</Typography>
                    <Typography variant="h5">Where learning meets fun. Providing a nurturing environment for your child's growth and happiness.</Typography>
                    <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>Learn More</Button>
                </Container>
            </Box>


            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Find the Perfect Daycare for Your Child
                    </Typography>
                    <Box display="flex" gap={2}>
                        <TextField
                            select
                            label="Filter by City"
                            value={cityFilter}
                            onChange={handleCityChange}
                            variant="outlined"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">All Cities</MenuItem>
                            {cityOptions.map(city=> (<MenuItem value={city}>{city}</MenuItem>))}
                        </TextField>
                        <TextField
                            select
                            label="Filter by Age"
                            value={ageFilter}
                            onChange={handleAgeChange}
                            variant="outlined"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">All Ages</MenuItem>
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                            <MenuItem value="5">5</MenuItem>
                            <MenuItem value="6">6</MenuItem>
                        </TextField>
                        <Button variant="contained" color="primary" onClick={() => { setCityFilter(''); setAgeFilter(''); }}>
                            Clear Filters
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {filteredDaycares?.map((daycare) => (
                        <Grid item xs={12} sm={6} md={4} key={daycare.id}>
                            <Card onClick={()=> navigate(`/daycare-dashboard/${daycare.id}`)}  sx={{ boxShadow: 4, borderRadius: 3, cursor: "pointer" }}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={daycare.imagePath}
                                    alt={daycare.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {daycare.name}
                                    </Typography>
                                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                                        <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="body2" color="textSecondary">
                                            {daycare.fullAddress}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <ChildCareIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="body2" color="textSecondary">
                                            Age Range: {daycare.lowerAgeLimit}-{daycare.higherAgeLimit} years
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default LandingPage;
