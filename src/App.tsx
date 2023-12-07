import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateIngredient from "./components/ingredients/CreateIngredient";
import EditIngredient from "./components/ingredients/EditIngredient";
import IngredientsList from "./components/ingredients/IngredientsList";
import UserList from "./components/user/UserList";
// import ViewUser from "./components/user/ViewUser";
import Layout from "./components/Layout";
import SnackBar from "./components/SnackBar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Authorization from "./components/Authorization";
import Login from "./components/Login";
import DashBoard from "./components/DashBoard";
import AnnotatorsList from "./components/annotators/AnnotatorsList";
import { CanAccessModule } from "./components/AccessControl";
import ErrorPage from "./components/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
dayjs.extend(utc);

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Authorization />}>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<DashBoard />} />
              <Route
                path="/ingredients"
                element={<CanAccessModule module="Ingredient" />}
              >
                <Route path="" element={<IngredientsList />} />
                <Route path="create" element={<CreateIngredient />} />
                <Route path="edit/:ingredientId" element={<EditIngredient />} />
              </Route>
              <Route
                path="/annotators"
                element={<CanAccessModule module="Annotator" />}
              >
                <Route path="" element={<AnnotatorsList />} />
              </Route>
              <Route path="/users" element={<CanAccessModule module="User" />}>
                <Route path="" element={<UserList />} />
                {/* <Route path=":id" element={<ViewUser />} /> */}
              </Route>
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <SnackBar />
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
