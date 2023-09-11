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
  createHashRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Import Views
import AuthForm from "./components/AuthForm/AuthForm";
import Home from "./views/Home/Home";
import Course from "./views/Course/Course";
import Management from "./views/Management/Management";
import MyLectures from "./views/Management/MyLectures/MyLectures";
import PublicLectures from "./views/Management/PublicLectures/PublicLectures";
import MyCourses from "./views/Management/MyCourses/MyCourses";
import PublicCourses from "./views/Management/PublicCourses/PublicCourses";
import AssignCourse from "./views/Management/AssignCourse/AssignCourse";
import User from "./views/Management/User/User";
import CreateLecture from './views/CreateLecture/CreateLecture';
import Leaderboard from './components/Leaderboard/Leaderboard';
import AddChapter from './components/CreateCourse/3-addChapter';
import CreateCourse from './views/CreateCourse/CreateCourse';
import UpdateLecture from './views/UpdateLecture/UpdateLecture';
import UpdateCourse from './views/UpdateCourse/UpdateCourse'
import LectureDetail from './views/Management/MyLectures/LectureDetail'
import CourseDetail from './views/Management/MyCourses/CourseDetail'
import PrivateCourses from './views/Management/PrivateCourses/PrivateCourses'

// Configure Amplify
Amplify.configure(awsExports);

// Configure Router
const router = createHashRouter([
  {
    path: "/",
    element: <Management />,
    children: [
      {
        path: "",
        element: <Navigate to="/management/myLectures" replace />,
      },
      {
        path: "myLectures",
        element: <MyLectures />,
      },
      {
        path: "publicLectures",
        element: <PublicLectures />,
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
        path: "privateCourses",
        element: <PrivateCourses />,
      },
      {
        path: "privateCourses/assignCourse/:id",
        element: <AssignCourse />,
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "myLectures/detail/:id",
        element: <LectureDetail />
      },
      {
        path: "myCourses/detail/:id",
        element: <CourseDetail />
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
  // {
  //   path: "/assignCourse/:id",
  //   element: <AssignCourse />,
  // },
  {
    path: "/management",
    element: <Management />,
    children: [
      {
        path: "",
        element: <Navigate to="/management/myLectures" replace />,
      },
      {
        path: "myLectures",
        element: <MyLectures />,
      },
      {
        path: "publicLectures",
        element: <PublicLectures />,
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
        path: "privateCourses",
        element: <PrivateCourses />,
      },
      {
        path: "privateCourses/assignCourse/:id",
        element: <AssignCourse />,
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "myLectures/detail/:id",
        element: <LectureDetail />
      },
      {
        path: "myCourses/detail/:id",
        element: <CourseDetail />
      },
    ],
  },
  {
    path: "/createLecture",
    element: <CreateLecture/>,
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
  {
    path: "/editLecture/:id",
    element: <UpdateLecture/>,
  },
  {
    path: "/editCourse/:id",
    element: <UpdateCourse/>,
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