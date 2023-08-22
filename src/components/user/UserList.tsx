import React, { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";

import { usersApi } from "../../services/userApi";
import { IconButton, CircularProgress } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { UserData } from "../../models/UserModel";

const TypographyUser = styled(Typography)({
  margin: "10px",
  fontWeight: "bold",
});

const LoadingComponent: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export interface userApiResponse {
  data: {
    users: UserData[];

  };
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);


  const {
    data,
    error,
    isLoading, refetch
  } = usersApi.endpoints.getUsers.useQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const refetchResult = await refetch();
        const userResponse:userApiResponse = refetchResult.data as userApiResponse;

      setUserList(userResponse.data.users)
      } catch (error) {
        console.error("Error while fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
      fetchData();
    
  }, []);
const handleDeleteOneClick = async (id: string[], event: any) => {
  }

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "name", headerName: "Name", width: 250, sortable: true },
    { field: "email", headerName: "Email", width: 250, sortable: true },
    {
      field: "delete",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        
          <IconButton
            onClick={(event) =>
              handleDeleteOneClick([params.id as string], event)
            }
          >
            <Delete />
          </IconButton>

      ),
    },
  ];

  const handleRowClick = (params: any) => {
    const userId = params.id;
    navigate(`/user/${userId}/show`);
  };

  return (
    <div style={{ marginLeft: "250px", marginTop: "70px" }}>
      <TypographyUser>Users</TypographyUser>
      <div
        style={{
          height: 400,
          width: "95%",
          boxShadow: "0px 2px 4px rgba(4, 4, 1, 0.4)",
          borderRadius: "8px",
        }}
      >
        {loading ? (
          <LoadingComponent />
        ) : (
          <DataGrid
            columns={columns}
            rows={userList}
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