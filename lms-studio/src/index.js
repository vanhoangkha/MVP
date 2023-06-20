import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Import Amplify
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

// Import CloudScape Design
import "@cloudscape-design/global-styles/index.css"

// Import React Router
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Import Views
import AuthForm from './components/AuthForm/AuthForm';
import Home from './views/Home/Home';
import Course from './views/Course/Course';
import Management from './views/Management/Management';
import MyLectures from './views/Management/MyLectures/MyLectures';
import PublicLectures from './views/Management/PublicLectures/PublicLectures';
import MyCourses from './views/Management/MyCourses/MyCourses';
import PublicCourses from './views/Management/PublicCourses/PublicCourses';

// Configure Amplify
Amplify.configure(awsExports);

// Configure Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/auth",
    element: <AuthForm/>,
  },
  {
    path: "/course/:id",
    element: <Course/>,
  },
  {
    path: "/management",
    element: <Management />,
    children: [
      {
        path: '',
        element: <Navigate to="/management/myLectures" replace />
      },
      {
        path: 'myLectures',
        element: <MyLectures />
      },
      {
        path: 'publicLectures',
        element: <PublicLectures />
      },
      {
        path: 'myCourses',
        element: <MyCourses />
      },
      {
        path: 'publicCourses',
        element: <PublicCourses />
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
