import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// Import Amplify
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

// Import CloudScape Design
import "@cloudscape-design/global-styles/index.css";

// Import React Router
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Import Views
import AuthForm from "./components/AuthForm/AuthForm";
import Home from "./views/Home/Home";
import Course from "./views/Course/Course";
import Management from "./views/Management/Management";
import MyContents from "./views/Management/MyContents/MyContents";
import ContentCatalog from "./views/Management/ContentCatalog/ContentCatalog";
import MyCourses from "./views/Management/MyCourses/MyCourses";
import PublicCourses from "./views/Management/PublicCourses/PublicCourses";
import AssignCourse from "./views/Management/AssignCourse/AssignCourse";
import User from "./views/Management/User/User";
import CreateContent from './views/CreateContent/CreateContent';
import Leaderboard from './components/Leaderboard/Leaderboard';
import AddChapter from './components/CreateCourse/3-addChapter';
import CreateCourse from './views/CreateCourse/CreateCourse';

// Configure Amplify
Amplify.configure(awsExports);

// Configure Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Management />,
    children: [
      {
        path: "",
        element: <Navigate to="/management/myContents" replace />,
      },
      {
        path: "myContents",
        element: <MyContents />,
      },
      {
        path: "contentCatalog",
        element: <ContentCatalog />,
      },
      {
        path: "myCourses",
        element: <MyCourses />,
      },
      {
        path: "publicCourses",
        element: <PublicCourses />,
      },
      {
        path: "user",
        element: <User />
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthForm />,
  },
  {
    path: "/course/:id",
    element: <Course />,
  },
  {
    path: "/assignCourse/:id",
    element: <AssignCourse />,
  },
  {
    path: "/management",
    element: <Management />,
    children: [
      {
        path: "",
        element: <Navigate to="/management/myContents" replace />,
      },
      {
        path: "myContents",
        element: <MyContents />,
      },
      {
        path: "contentCatalog",
        element: <ContentCatalog />,
      },
      {
        path: "myCourses",
        element: <MyCourses />,
      },
      {
        path: "publicCourses",
        element: <PublicCourses />,
      },
      {
        path: "user",
        element: <User />
      }
    ],
  },
  {
    path: "/createContent",
    element: <CreateContent/>,
  },
  {
    path: "/course/CreateCourse",
    element: <CreateCourse/>,
  },
  {
    path: '/course/:id',
    element: <Course />,
  },
  {
    path: '/management/leaderboard',
    element: <Leaderboard />
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
  },

  {
    path: '/addChapter',
    element: <AddChapter />,
  },

]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();