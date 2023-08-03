import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";
import CircularProgress from "@mui/material/CircularProgress";
import { usersApi } from "../../services/userApi";
import { UserData } from "./userTypes";
import { AxiosResponse } from "axios";

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

const UserList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [userList, setUserList] = useState<UserData[]>([]);

  const { data, error, isLoading } = usersApi.endpoints.getUsers.useQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = data?.data?.users;
        if (responseData) {
          setUserList(responseData);
        }
      } catch (error) {
        console.error("Error while fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  // console.log("users", users)
  console.log("userList", userList);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "name", headerName: "Name", width: 250, sortable: true },
    { field: "email", headerName: "Email", width: 250, sortable: true },
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
          // Check if "userList" is not empty before rendering the DataGrid

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
