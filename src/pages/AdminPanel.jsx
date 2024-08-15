import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import {
  Box,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api/v1";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 1,
  },
}));

const AdminPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [daycares, setDaycares] = useState([]);

  useEffect(()=> {
    if(!token){
      navigate("/login-register");
  }
    if(role==="SECRETARY"){
      navigate("/secretary-panel");
    }else if(role==="USER"){
      navigate("/");
    }
},[])


  const loadDaycares = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/daycare",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setDaycares(response.data)
      }
    } catch (err) {
      console.log(err);
    }
};

const deleteDaycare = async (id) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: BASE_URL + "/daycare/"+id,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      }
    });
    if (response.data) {
      loadDaycares();
      toast.success("Daycare deleted successfully")
    }
  } catch (err) {
    console.log(err);
    toast.error("Error occured while deleteing daycares")
  }
};

  useEffect(() => {
   loadDaycares();
  }, []);


  return (
    <div>
      <Header />
      <Box sx={{mt: 9, padding: 1}}>

        <Box sx={{ mt: 5, mb: 1 }}>
      
          <Box display="flex" sx={{mt: 5}}>
            <Typography variant="h5" color="initial">
              Daycares
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX:"auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Daycare (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Contact No.</StyledTableCell>
                    <StyledTableCell align="right">City</StyledTableCell>
                    <StyledTableCell align="right">Address</StyledTableCell>
                    <StyledTableCell align="right">Lower Age Limit</StyledTableCell>
                    <StyledTableCell align="right">Higher Age Limit</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {daycares &&
                    daycares.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.contactNumber}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.city}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.fullAddress}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.lowerAgeLimit}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.higherAgeLimit}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteDaycare(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{display: "flex", mt: 1, mr: 2}}>
          <Box sx={{flexGrow: 1}}></Box>
          <Box sx={{ml: "auto"}}>
          <Typography variant="h6" sx={{ color: 'secondary.main' }}>Total Revenue Generated: ₹{daycares?.length*500}</Typography>
          </Box>
          </Box>
         
        </Box>
      </Box>
    </div>
  )
}

export default AdminPanel;