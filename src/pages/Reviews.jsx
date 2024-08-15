import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Rating,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Container,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = "http://localhost:8000/api/v1";

function ReviewPage() {
    const param = useParams();
    const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        name: '',
        rating: 0,
        comment: '',
    });


    const handleSubmitReview = async () => {
        try {
            const response = await axios({
              url: BASE_URL + `/reviews/${param.id}`,
              method: "POST",
              data: JSON.stringify(newReview),
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
            if(response.data){
                setReviews(reviews=> ([...reviews, response.data]));
                toast.success("Review submitted successfully!")
            }
          } catch (err) {
            toast.error(err.message)
          }
    };

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
                    setReviews(response.data.reviews);
                  }
            } catch (err) {
                toast.error("Some error occurred while registration!")
                console.error(err)
            }
        }

    return (
        <Box sx={{ mt: 5, padding: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Reviews
            </Typography>

            <Container sx={{ display: "flex", flexWrap: "wrap"}}>
                {/* Review listing */}
                {reviews.map((review) => (
                    <Card sx={{ border: "1px solid black", width: "450px", mr: 2, mt: 2 }} key={review.id}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={2}>
                                    <Avatar>
                                        {review?.name[0]}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <Typography variant="h6">{review.name}</Typography>
                                    <Rating value={review.rating} readOnly />
                                    <Typography variant="body2">{review.comment}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
            </Container>


            {/* Review form */}
            <Box mt={3}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Leave a Review
                </Typography>
                <TextField
                    label="Name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Rating
                    value={newReview.rating}
                    onChange={(e, newValue) => setNewReview({ ...newReview, rating: newValue })}
                />
                <TextField
                    label="Comment"
                    multiline
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleSubmitReview}>
                    Submit Review
                </Button>
            </Box>
        </Box>
    );
}

export default ReviewPage;
