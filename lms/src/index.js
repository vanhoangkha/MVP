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
import { createHashRouter, RouterProvider } from "react-router-dom";

// Import locale context
import { I18nextProvider } from 'react-i18next';
import i18n from './views/i18n'
// import { I18nProvider } from '@cloudscape-design/components/i18n';

// Import Views
import AuthForm from "./components/AuthForm/AuthForm";
import Home from "./views/Home/Home";
import Course from "./views/Course/Course";
import Learn from "./views/Learn/Learn";
import MyLearning from "./views/MyLearning/MyLearning";
import Cert from "./views/Cert/Cert";
import CertPublic from "./views/CertPublic/CertPublic";

// Configure Amplify
Amplify.configure(awsExports);

// Configure Router
const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/learn/:id",
    element: <Learn />,
  },
  {
    path: "/learn/:id/lecture/:lectureId",
    element: <Learn />,
  },
  {
    path: "/mylearning",
    element: <MyLearning />,
  },
  {
    path: "/cert/:id",
    element: <Cert />,
  },
  {
    path: "/certPublic/:id",
    element: <CertPublic />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
