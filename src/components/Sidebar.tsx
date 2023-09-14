import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { styled } from "@mui/material/styles";

const sidebarItems = [
  {
    name: "Dashboard",
    url: "/",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    url: "/users",
    icon: <PeopleIcon />,
  },
  {
    name: "Ingredients",
    url: "/ingredients",
    icon: <FastfoodIcon />,
  },
];

const SidebarItem = styled(ListItemButton)(({ theme }) => ({
  marginTop: "5px",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    "& .MuiListItemIcon-root": {
      color: theme.palette.common.white,
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
      "& .MuiListItemIcon-root": {
        color: theme.palette.common.white,
      },
    },
  },
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    "& .MuiListItemIcon-root": {
      color: theme.palette.common.white,
    },
  },
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const seleted = (path: string) => `/${pathname.split("/")[1]}` === path;

  return (
    <div>
      <Toolbar />
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={() => navigate(item.url)}
          >
            <SidebarItem selected={seleted(item.url)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </SidebarItem>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
