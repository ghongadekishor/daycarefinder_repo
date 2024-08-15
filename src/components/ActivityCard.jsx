import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
const role = localStorage.getItem("role");
const ActivityCard = ({ activity, onEdit, onDelete }) => (
  
  <Card variant="outlined" sx={{ margin: 2}}>
    <CardContent>
      <Typography variant="h5" component="div">
        {activity.title}
      </Typography>
      <Typography color="text.secondary">
        {activity.time}
      </Typography>
      <Typography variant="body2">
        {activity.description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button disabled={role==="USER"? true: false} size="small" onClick={() => onEdit(activity.id)}>Edit</Button>
      <Button disabled={role==="USER"? true: false} size="small" onClick={() => onDelete(activity.id)}>Delete</Button>
    </CardActions>
  </Card>
);

export default ActivityCard;