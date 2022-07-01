import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/home";
import Forum from "./pages/forum";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Header from "./components/header";
import Footer from "./components/footer";
import "./style/index.css";

import { DataProvider } from "./DataContext";

ReactDOM.render(
  <Router>
    <Switch>
      <DataProvider>
        <Header />
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/forum">
          <Forum />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </DataProvider>
    </Switch>
    <Footer />
  </Router>,
  document.getElementById("root")
);
