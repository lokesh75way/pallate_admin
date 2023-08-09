import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IngredientsCreateForm from "./components/Ingredients/IngredientsCreateForm";
import IngredientsEditForm from "./components/Ingredients/IngredientsEditForm";
import IngredientsList from "./components/Ingredients/IngredientsList";
import IngredientsShow from "./components/Ingredients/IngredientsShow";
import UserList from "./components/user/UserList";
import UserShow from "./components/user/UserShow";
import Layout from "./components/Layout";
function App() {
  
  return (
    <>
      <Router>  
        <Layout>
        <Routes>
          <Route>
            <Route path="/ingredients">
              <Route path="" element={<IngredientsList />} />
              <Route path="create" element={<IngredientsCreateForm />} />
              <Route path=":id/show" element={<IngredientsShow />} />
              <Route path="show" element={<IngredientsShow />} />
              <Route
                path=":ingredientId/editForm"
                element={
                  <IngredientsEditForm
                    
                  />
                }
              />
            </Route>
          </Route>
          <Route>
            <Route path="/user">
              <Route path="" element={<UserList />} />
              <Route path=":id/show" element={<UserShow />} />
            </Route>
          </Route>
        </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;