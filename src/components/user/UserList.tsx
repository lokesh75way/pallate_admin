import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const TypographyUser = styled(Typography)({
  margin:'10px',
  fontWeight: "bold",
})

const LoadingComponent: React.FC = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <CircularProgress />
    </div>
  );
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users',
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzFlYjMyNTg0Mjk4YjUxNjI1YWNkZiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcGFsbGF0ZS5jb20iLCJhY3RpdmUiOnRydWUsInBhc3N3b3JkIjoiJDJiJDEyJE9sbHBmSmR3akNHV2F3cnNJeHgwSnVqVUxOZ2NsTXpSejUwVjZwN2V3elFJMERiRTR2LjdtIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yMFQxMjoyMjozOC42NThaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yMVQwOToyNToyNS4yOTdaIiwiX192IjowfSwiaWF0IjoxNjkwODA2OTk0fQ.7vspbw1A1N019ewYYojPHS8AyMlHzlxk134f_c5GlUI`,
              "ngrok-skip-browser-warning": true,
            },
          }
        );

        const data = response.data.data.users;
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 350 },
    { field: "name", headerName: "Name", width: 350, sortable: true },
    { field: "email", headerName: "Email", width: 350, sortable: true },
  ];

  const handleRowClick = (params: any) => {
    const userId = params.id;
    navigate(`/user/${userId}/show`);
  };

  return (
    <div style={{ marginLeft: '250px', marginTop: '70px' }}>
      <TypographyUser>
        Users
      </TypographyUser>
      <div style={{ height: 400, width: "95%", boxShadow: '0px 2px 4px rgba(4, 4, 1, 0.4)', borderRadius: "8px" }}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <DataGrid
            columns={columns}
            rows={users}
            pagination
            onRowClick={handleRowClick}
            getRowId={(row) => row._id}
          />
        )}
      </div>
    </div>
  );
};

export default UserList;