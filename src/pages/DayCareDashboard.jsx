import React, {useState, useEffect} from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Box, Avatar, CardMedia,
  List, ListItem, ListItemIcon, ListItemText, Divider, Container, Paper
} from '@mui/material';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';

import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";



const BASE_URL = "http://localhost:8000/api/v1";

const daycare1 = {
  name: "Happy Kids Daycare",
  city: "New York",
  fullAddress: "123 Happy Street, New York, NY",
  lowerAgeLimit: 2,
  higherAgeLimit: 5,
  registrationFee: 500,
  imagePath: "https://www.justchildren.net/wp-content/uploads/2023/10/teacher-with-2-toddlers.jpg",
  features: ["Safe Environment", "Certified Teachers", "Nutritious Meals"],
  activities: ["Art & Craft", "Storytelling", "Outdoor Games"],
  reviews: [{ user: "John Doe", rating: 4, comment: "Great place for kids!" }],
  numberOfKids: 45,
  aboutUs: `Happy Kids Daycare is dedicated to providing a safe, nurturing, and educational environment for young children. 
  Our daycare is designed to meet the developmental needs of infants, toddlers, and preschoolers. We focus on creating a 
  structured yet fun-filled environment where children can learn, play, and grow.`,
};

const DaycareDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const param = useParams();

  const [daycare, setDaycare] = useState();

  const features= ["Safe Environment", "Certified Teachers", "Nutritious Meals"]
  const activities= ["Art & Craft", "Storytelling", "Outdoor Games"]

  useEffect(()=> {
      if(!token) {
          navigate("/login-register")
      }
  },[])

  useEffect(()=> {
    loadDaycare();
  },[])

  const loadDaycare = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: BASE_URL + `/daycare/by-id/${param.id}`,
                headers: {
                  "content-type": "application/json",
                  Authorization: "Bearer " + token,
                },
              });
        
              if (response.data) {
                setDaycare(response.data)
              }
        } catch (err) {
            toast.error("Some error occurred while registration!")
        }
}
  return (
    <Container maxWidth="lg" sx={{ mt: 12 }}>
      <Card sx={{ boxShadow: 6, borderRadius: 4, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="300"
          image={daycare?.imagePath}
          alt={daycare?.name}
          sx={{ objectFit: 'cover', filter: 'brightness(0.9)' }}
        />
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {daycare?.name}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            {daycare?.city}, {daycare?.fullAddress}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> About Us
            </Typography>
            <Typography variant="body1" color="textPrimary">
              {daycare?.aboutUs}
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Features</Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <LocalActivityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Activities</Typography>
              <List>
                {activities.map((activity, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <LocalActivityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={activity} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'secondary.main' }}>Number of Kids: {daycare?.kids?.length}</Typography>
              <Typography variant="h6" sx={{ color: 'secondary.main' }}>Age Range: {daycare?.lowerAgeLimit} - {daycare?.higherAgeLimit} Years</Typography>
              {role==="DAYCARE_OWNER" && <Typography variant="h6" sx={{ color: 'secondary.main' }}>Total Revenue Generated: ₹{daycare?.kids?.length*5000}</Typography>}
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <GroupIcon sx={{ fontSize: 36 }} />
            </Avatar>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Button disabled={role==="ADMIN" || role==="DAYCARE_OWNER"} onClick={()=> navigate(`/admission/${daycare?.id}`)} variant="contained" fullWidth sx={{ py: 1.5, fontSize: '1rem', boxShadow: 3 }}>
                Admit Kid 
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button onClick={()=> navigate(`/reviews/${daycare?.id}`)} variant="outlined" fullWidth sx={{ py: 1.5, fontSize: '1rem', boxShadow: 3 }}>
                Reviews
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button onClick={()=> navigate(`/activities/${daycare?.id}`)} variant="contained" fullWidth sx={{ py: 1.5, fontSize: '1rem', boxShadow: 3 }}>
                All Activities
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DaycareDashboard;
