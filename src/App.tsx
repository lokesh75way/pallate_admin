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
dayjs.extend(utc);

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Authorization />}>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<DashBoard />} />
              <Route path="/ingredients">
                <Route path="" element={<IngredientsList />} />
                <Route path="create" element={<CreateIngredient />} />
                <Route path="edit/:ingredientId" element={<EditIngredient />} />
              </Route>
              <Route path="/annotators">
                <Route path="" element={<AnnotatorsList />} />
              </Route>
              <Route path="/users">
                <Route path="" element={<UserList />} />
                {/* <Route path=":id" element={<ViewUser />} /> */}
              </Route>
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
        <SnackBar />
      </Router>
    </>
  );
}

export default App;
