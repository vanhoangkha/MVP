import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import {  } from "@aws-amplify/ui-react";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Applayout from "@cloudscape-design/components/app-layout";
import { useNavigate, useLocation } from "react-router-dom";
import { BreadcrumbGroup } from "@cloudscape-design/components";

const Management = (props) => {
  const [activeHref, setActiveHref] = useState();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setActiveHref(location.pathname.split('/').pop())
  },[])

  return (
    <>
      <NavBar navigation={props.navigation} title="Cloud Academy" />
      <div className="dashboard-main">
        <Applayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: "Home", href: "/management" },
              // { text: "My Courses", href: "/management/myCourses"}
            ]}
            ariaLabel="Breadcrumbs"
          />
        }
          navigation={
            <SideNavigation
              activeHref={activeHref}
              header={{ href: "/", text: "Management" }}
              onFollow={(event) => {
                if (!event.detail.external) {
                  event.preventDefault();
                  const href =
                    event.detail.href === "/"
                      ? "myLectures"
                      : event.detail.href;
                  setActiveHref(href);
                  navigate(`/management/${href}`);
                }
              }}
              items={[
                {
                  type: "section",
                  text: "Lectures",
                  items: [
                    {
                      type: "link",
                      text: "My Lectures",
                      href: "myLectures",
                    },
                    {
                      type: "link",
                      text: "Public Lectures",
                      href: "publicLectures",
                    },
                  ],
                },
                {
                  type: "section",
                  text: "Courses",
                  items: [
                    {
                      type: "link",
                      text: "My Courses",
                      href: "myCourses",
                    },
                    {
                      type: "link",
                      text: "Public Courses",
                      href: "publicCourses",
                    },
                    {
                      type: "link",
                      text: "Private Courses",
                      href: "privateCourses",
                    },
                  ],
                },
                { type: "link", text: "User", href: "user" },
                { type: "link", text: "Leaderboard", href: "leaderboard" },
              ]}
            />
          }
          content={
            <div style={{ padding: 32 }}>
              <Outlet />
            </div>
          }
        />
        <Footer />
      </div>
    </>
  );
};

export default (Management);
