import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Grid, Avatar, Container, Button, Dialog, DialogContent, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { blue, grey } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import KidForm from "../components/KidForm";

const BASE_URL = "http://localhost:8000/api/v1";


const KidsDashboard = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [kidsData, setKidsData] = useState([]);
  const [kidData, setKidData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = async (kid) => {
    setKidData(kid);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios({
        url: BASE_URL + "/kids/"+id,
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      if(response.data){
        const updatedKidsData = kidsData.filter(kid => kid.id !== id);
        setKidsData(updatedKidsData);
        toast.success("Kid deleted successfully")
      }
    } catch (err) {
      toast.error(err.message)
    }
   
  };

  const loadMyKids = async () => {
    try {
      const response = await axios({
        url: BASE_URL + "/kids/my-kids",
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      if(response.data){
        setKidsData(response.data)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(()=> {
    if(!token){
      navigate("/")
    }
    if(role==="ADMIN"){
      navigate("/admin-panel")
    }
    loadMyKids();
  },[])

  return (
    <Container maxWidth="lg" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: blue[600] }}>
        My Kids
      </Typography>
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {kidsData?.map(kid => (
          <Grid item key={kid.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: grey[50],
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Avatar
                      alt={kid.name}
                      src={kid.name[0]} // Placeholder image URL
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: blue[100],
                        border: '2px solid white',
                      }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', color: blue[800] }}>
                      {kid.name}
                    </Typography>
                    <Typography color="textSecondary">Age: {kid.age}</Typography>
                    <Typography color="textSecondary">Sex: {kid.sex}</Typography>
                    <Typography color="textSecondary">Address: {kid.address}</Typography>
                    <Typography color="textSecondary">Contact: {kid.contact}</Typography>
                  </Grid>
                </Grid>
              </CardContent>

              <Accordion sx={{ boxShadow: 'none', mt: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ backgroundColor: blue[50] }}
                >
                  <Typography>Payment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {kid.feePayments.length > 0 ? (
                    kid.feePayments.map(payment => (
                      <Grid container key={payment.id} spacing={1} sx={{ mb: 1 }}>
                        <Grid item xs={12}>
                          <Typography color="textSecondary">
                            Month/Year: {payment.month}/{payment.year}
                          </Typography>
                          <Typography color="textSecondary">
                            Admission Fee: ₹{payment.admissionFee}
                          </Typography>
                          <Typography color="textSecondary">
                            Tuition Fee: ₹{payment.tuitionFee}
                          </Typography>
                          <Typography color="textSecondary">
                            Cultural Activity Fee: ₹{payment.culturalActivityFee}
                          </Typography>
                          <Typography color="textSecondary">
                            Other Fee: ₹{payment.otherFee}
                          </Typography>
                          <Typography color="textSecondary">
                            Payment Date: {new Date(payment.paymentDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <Typography color="textSecondary">No payment details available</Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <Grid container spacing={1} justifyContent="flex-end" sx={{ px: 2, pb: 2, mt: 1 }}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(kid)}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(kid.id)}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <KidForm setIsDialogOpen={setIsDialogOpen} initialData={kidData} loadMyKids={loadMyKids} />
                </DialogContent>
            </Dialog>
    </Container>
  );
};

export default KidsDashboard;
