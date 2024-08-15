import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Dialog, DialogContent, Box } from '@mui/material';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = "http://localhost:8000/api/v1";

const Activities = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [activities, setActivities] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    const param = useParams();

    const handleEditActivity = (id) => {
        setEditingActivity(activities.find(activity => activity.id === id));
        setIsDialogOpen(true);
    };

    const handleDeleteActivity = async (id) => {
        try {
            const response = await axios({
              url: BASE_URL + "/activities/"+id,
              method: "DELETE",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
            if(response.data){
                loadDaycare();
                toast.success("Activity deleted successfully!")
            }
          } catch (err) {
            toast.error(err.message)
          }
    };

    const handleAddActivity = () => {
        setEditingActivity(null);
        setIsDialogOpen(true);
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
                  setActivities(response.data.activities);
                }
          } catch (err) {
              toast.error("Some error occurred while loading activities!")
              console.error(err)
          }
      }

    const handleSaveActivity = async (activity) => {
        try {
            const response = await axios({
              url: BASE_URL + `/activities/${param.id}`,
              method: "POST",
              data: JSON.stringify(activity),
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
            if(response.data){
                loadDaycare();
                toast.success("Activity added successfully!")
            }
          } catch (err) {
            toast.error(err.message)
          }finally{
            setIsDialogOpen(false);
          }
    };

    return (
        <Container sx={{ mt: 15 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, ml: 2 }}>
                <Typography variant="h5" component="div" sx={{ marginTop: 0 }}>
                    Daycare Activities
                </Typography>
                {role==="DAYCARE_OWNER" && <Button variant="contained" sx={{ marginTop: 0 }} onClick={handleAddActivity}>
                    Add Activity
                </Button>}
            </Box>

            {activities.map(activity => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                />
            ))}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <ActivityForm onSave={handleSaveActivity} initialData={editingActivity} />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Activities;