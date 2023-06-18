import React, { useState } from "react";
import './Learn.css';
import "video-react/dist/video-react.css";
import { API } from 'aws-amplify';
import {Helmet} from "react-helmet";
import NavBar from '../../components/NavBar/NavBar';
import { AppLayout, BreadcrumbGroup, SideNavigation } from '@cloudscape-design/components';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { Player, LoadingSpinner, BigPlayButton, ControlBar, ReplayControl, ForwardControl, PlaybackRateMenuButton, VolumeMenuButton, FullscreenToggle } from 'video-react';

import { IoChevronBack, IoChevronForward, IoExpand, IoContract, IoClose } from 'react-icons/io5';

const DEBUG = true;
const landingPageUrl = "https://dev.dfpjafbqllhh1.amplifyapp.com/";

function PageMetadata(props) {
    return <Helmet>
        <title>{props.courseName}</title>
    </Helmet>
  }
  
  function LoadingContainer() {
    return <div fluid="true" className='learn-parent-container parent-loading'>
        {/* <img src={loadingGif} alt="loading..." className='learn-loading-gif' /> */}
        Loading...
    </div>;
  }
  
  function ContentLoading() {
    return <div className='learn-player-loading'>
        {/* <img src={loadingGif} alt="loading..." className='learn-loading-gif' /> */}
        Loading...
    </div>;
  }
  
  function LectureContent(props) {
    switch (props.lecture.lecture.type) {
      case "video":
        return <VideoContent 
          videoSrc={props.lecture.lecture.content} 
          setTimeLeft={props.setTimeLeft} 
          handleFullScreen={props.handleFullScreen}
          handleVideoEnded={props.handleVideoEnded} />;
      case "lab":
        return <LabContent desc={props.lecture.lecture.desc} url={props.lecture.lecture.content} openLink={props.openLink} />;
      case "document":
        return <DocumentContent desc={props.lecture.lecture.desc} url={props.lecture.lecture.content} openLink={props.openLink} />;
      case "survey":
        return <SurveyContent desc={props.lecture.lecture.desc} url={props.lecture.lecture.content} openLink={props.openLink} name={props.lecture.lecture.name} />;
      default:
        return <></>;
    };
  }
  
  class VideoContent extends React.Component {  
    componentDidMount() {
      this.player.subscribeToStateChange(this.handleStateChange.bind(this));
      this.player.actions.toggleFullscreen=()=>{
        this.props.handleFullScreen();
      };
    }
  
    handleStateChange(state) {
      this.props.setTimeLeft(Math.floor(state.duration - state.currentTime));
      if (state.ended) 
        this.props.handleVideoEnded();
    }
  
    render() {
      return (
        <Player
          ref={player => {
            this.player = player;
          }}
          className="learn-transparent-player"
          autoPlay
          playsInline
          fluid={false}
          height="100%"
          width="100%"
          src={this.props.videoSrc}
        >
          <LoadingSpinner />
          <BigPlayButton position="center" />
          <ControlBar>
              <ReplayControl seconds={5} order={2.1} />
              <ForwardControl seconds={5} order={2.2} />
              <PlaybackRateMenuButton rates={[2, 1.5, 1.25, 1, 0.9, 0.75]} order={7} />
              <VolumeMenuButton order={8} />
              <FullscreenToggle disabled />
            </ControlBar>
        </Player>
      );
    }
  }
  
  function LabContent(props) {
    return <div className="learn-lab-content-container">
      <div className="learn-lab-content-header">Bài tập thực hành</div>
      <div className="learn-lab-content-desc">{props.desc}</div>
      <div className="learn-lab-content-link">
        <button onClick={() => {props.openLink(props.url)}}>
          {props.url}
        </button>
      </div>
    </div>;
  }
  
  function DocumentContent(props) {
    return <div className="learn-lab-content-container">
      <div className="learn-lab-content-header">Tài liệu tham khảo</div>
      <div className="learn-lab-content-desc">{props.desc}</div>
      <div className="learn-lab-content-link">
        <button onClick={() => {props.openLink(props.url)}}>
          {props.url}
        </button>
      </div>
    </div>;
  }
  
  function SurveyContent(props) {
    return <div className="learn-lab-content-container">
      <div className="learn-lab-content-header">{props.name}</div>
      <div className="learn-lab-content-desc">{props.desc}</div>
      <div className="learn-lab-content-link">
        <button onClick={() => {props.openLink(props.url)}}>
          {props.url}
        </button>
      </div>
    </div>;
  }
  
  function MainContent(props) {
    const handle = useFullScreenHandle();
    const [fullscreen, setFullscreen] = useState(false);
    const [autoNext, setAutoNext] = useState(true);
    const [timeLeft, setTimeLeft] = useState(100);
  
    return <FullScreen handle={handle}>
      <div className='learn-content-parent'>
        <div className='learn-content-main'>
          {props.loading ? 
            <ContentLoading /> : 
            <LectureContent lecture={props.lecture} 
              openLink={url => {
                setFullscreen(false);
                window.open(url, '_blank').focus();
              }} 
              setTimeLeft={timeLeft => {
                setTimeLeft(timeLeft);
              }}
              handleFullScreen={() => {
                if (fullscreen) handle.exit(); else handle.enter();
                setFullscreen(!fullscreen);
              }}
              handleVideoEnded={() => {
                if (autoNext && !props.isLast) {
                  setTimeLeft(100);
                  props.nextLecture();
                }
              }}
            />
          }
        </div>
        <div className='learn-content-control'>
          <div className='learn-content-control-left'>
            {props.isFirst ? 
              <button className='learn-content-control-btn content-control-btn-disabled' disabled>
                <IoChevronBack />
              </button> :
              <button className='learn-content-control-btn' onClick={props.prevLecture}>
                <IoChevronBack />
              </button>}
            {props.isLast ? 
              <button className='learn-content-control-btn content-control-btn-disabled' disabled>
                <IoChevronForward />
              </button> :
              <button className='learn-content-control-btn' onClick={props.nextLecture}>
                <IoChevronForward />
              </button>}
            {/* <ToggleButton Todo
              className="learn-auto-next-control"
              id="toggle-check"
              type="checkbox"
              variant="outline-secondary"
              checked={autoNext}
              onChange={(e) => setAutoNext(!autoNext)}
            >
              Tự động chuyển bài 
              {autoNext ? 
                <IoCheckmarkCircleOutline className='learn-auto-next-control-icon'/> : 
                <IoCloseCircleOutline className='learn-auto-next-control-icon'/>}
            </ToggleButton> */}
          </div>
          <div className='learn-content-control-right'>
            <button className='learn-content-control-btn' onClick={() => {
              if (fullscreen) handle.exit(); else handle.enter();
              setFullscreen(!fullscreen);
            }}>
              {fullscreen ? <IoContract /> : <IoExpand />}
            </button>
          </div>
        </div>
        {autoNext && !props.isLast && timeLeft!==null && timeLeft<=5 ? 
          <div className='learn-next-lecture'>
            <div>
              <div xs={3} className="learn-next-lecture-count">
                {timeLeft}
              </div>
              <div xs={9}>
                <div>
                  <div xs={10} className="learn-next-lecture-header">Bài tiếp theo</div>
                  <div xs={2}>
                    <button className='learn-next-lecture-cancel' onClick={() => {
                      setAutoNext(false);
                    }}>
                      <IoClose/>
                    </button>
                  </div>
                </div>
                <div className="learn-next-lecture-name">
                  {props.nextLectureName}
                </div>
              </div>
            </div>
          </div> : 
          <></>}
      </div>
    </FullScreen>
  }

export default class Learn extends React.Component {
    constructor(props) { 
      super(props); 
      this.state = { 
        loading: true,
        course: null,
        lecture: {
          chapterId: 0,
          lectureId: 0,
          lecture: null
        },
        nextLectureName: "",
      };
    }
  
    getHashParams() {
      return {
        course: window.location.href.split("/")[4],
        lecture: window.location.href.split("/")[2],
      }
    }
  
    setHashParams(course, lecture) {
    //   if (!lecture)
        // window.location.hash = "/course/" + course;
    //   else
        window.location.hash = "/lecture/" + lecture;
    }
  
    setLocalStorage(course, lecture) {
      if (!!course) localStorage.setItem('AWSLIBVN_COURSE', course);
      if (!!course && !!lecture) localStorage.setItem('AWSLIBVN_LECTURE' + course, lecture);
    }
  
    getLocalStorage(course) {
      if (!course) course = localStorage.getItem('AWSLIBVN_COURSE');
      return {
        course: course,
        lecture: localStorage.getItem('AWSLIBVN_LECTURE' + course),
      }
    }

    loadLectureById(lectureId) {
        console.log(lectureId);
        this.state.course.chapters.forEach((chapter, chapterIndex) => {
            chapter.lectures.forEach((lecture, lectureIndex) => {
                if (lecture.lectureId === lectureId) {
                    console.log(chapterIndex, lectureIndex);
                    this.loadLecture(chapterIndex, lectureIndex);
                }
            })
        })
    }
  
    loadLecture(chapterIndex, lectureIndex) {
        let lectureId = this.state.course.chapters[chapterIndex].lectures[lectureIndex].lectureId;
        console.log(lectureId);
    
        const apiName = 'courses';
        const path = '/lectures/' + lectureId; 
        const init = {};
    
        this.setState({loading: true});
        
        API
            .get(apiName, path, init)
            .then(response => {
                this.setState({
                    lecture: {
                        chapterId: chapterIndex,
                        lectureId: lectureIndex,
                        lecture: {
                            id: response.ID,
                            content: response.Content,
                            desc: response.Desc,
                            name: response.Name,
                            type: response.Type,
                            viewed: response.Viewed
                        },
                    },
                    loading: false,
                    nextLectureName: this.getNextLectureName(chapterIndex, lectureIndex)
                });
                let hashParams = this.getHashParams();
                this.setHashParams(hashParams.course, response.data.id);
                this.setLocalStorage(hashParams.course, response.data.id);
            })
            .catch(error => {
                console.log(error);
            });
    }
  
    loadCourse() {
        let hashParams = this.getHashParams();
            
        let course = hashParams.course;
        let lecture = hashParams.lecture;
        if (!course) {
            let localParams = this.getLocalStorage();
            course = localParams.course;
            lecture = localParams.lecture;
        } else if (!lecture) {
            let localParams = this.getLocalStorage(course);
            lecture = localParams.lecture;
        }
    
        if (!course && !DEBUG) {
            window.location.href = landingPageUrl;
        }
    
        const apiName = 'courses';
        const path = '/courses/' + course;
        const init = {};
        
        API
            .get(apiName, path, init)
            .then(response => {      
                // this.setHashParams(course, lecture);
                // this.setLocalStorage(course, lecture);

                let course = {
                    id: response.ID,
                    name: response.Name,
                    categories: response.Categories,
                    tags: response.Tags,
                    level: response.Level,
                    length: response.Length,
                    description: response.Description,
                    whatToLearn: response.WhatToLearn,
                    requirements: response.Requirements,
                    chapters: response.Chapters,
                }
        
                let chapters = course.chapters;
                let firstLectureIndex = 0;
                let hashChapterIndex = -1;
                let hashLectureIndex = -1;
                while (chapters[0].lectures[firstLectureIndex].type === "section") firstLectureIndex++;
        
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i].lectures[0].realIndex = 0;
                    for (let j = 1; j < chapters[i].lectures.length; j++) {
                    if (chapters[i].lectures[j-1].type === "section")
                        chapters[i].lectures[j].realIndex = chapters[i].lectures[j-1].realIndex;
                    else 
                        chapters[i].lectures[j].realIndex = chapters[i].lectures[j-1].realIndex + 1;
                    }
                }
        
                if (!!lecture)
                    for (let i = 0; i < chapters.length; i++) {
                    for (let j = 0; j < chapters[i].lectures.length; j++) {
                        if (chapters[i].lectures[j].lectureId === lecture) {
                            hashChapterIndex = i;
                            hashLectureIndex = j;
                        }
                    }
                    }
        
                this.setState({
                    course: {
                        name: course.name,
                        chapters: chapters,
                        firstLectureIndex: firstLectureIndex,
                    },
                });
        
                if (hashLectureIndex === -1) 
                    this.loadLecture(0, firstLectureIndex);
                else 
                    this.loadLecture(hashChapterIndex, hashLectureIndex);
                })
            .catch(error => {
                console.log(error);
                if (!DEBUG)
                    window.location.href = landingPageUrl;
            });
    }

    loadUserCourse(courseId) {
        let hashParams = this.getHashParams();
        let course = hashParams.course;
        
        const apiName = 'courses';
        const path = '/users/courses/' + course;
        
        API.get(apiName, path)
          .then((response) => {
            // console.log(response);
          })
          .catch((error) => {
            console.log(error.response);
          });
    }
  
    prevLecture() {
      let chapterId = this.state.lecture.chapterId;
      let lectureId = this.state.lecture.lectureId;
  
      lectureId--;
      if (lectureId < 0) {
        chapterId--;
        lectureId = this.state.course.chapters[chapterId].lectures.length - 1;
      }
  
      while (this.state.course.chapters[chapterId].lectures[lectureId].type === "section") {
        lectureId--;
        if (lectureId < 0) {
          chapterId--;
          lectureId = this.state.course.chapters[chapterId].lectures.length - 1;
        }
      }
  
      this.loadLecture(chapterId, lectureId);
    }
  
    nextLecture() {
      let chapterId = this.state.lecture.chapterId;
      let lectureId = this.state.lecture.lectureId;
  
      lectureId++;
      if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
        chapterId++;
        lectureId = 0;
      }
  
      while (this.state.course.chapters[chapterId].lectures[lectureId].type === "section") {
        lectureId++;
        if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
          chapterId++;
          lectureId = 0;
        }
      }
  
      this.loadLecture(chapterId, lectureId);
    }
  
    getNextLectureName(chapterId, lectureId) {
      lectureId++;
      if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
        chapterId++;
        lectureId = 0;
      }
  
      while (chapterId < this.state.course.chapters.length && this.state.course.chapters[chapterId].lectures[lectureId].type === "section") {
        lectureId++;
        if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
          chapterId++;
          lectureId = 0;
        }
      }
  
      return chapterId < this.state.course.chapters.length && lectureId < this.state.course.chapters[chapterId].lectures.length
        ? this.state.course.chapters[chapterId].lectures[lectureId].name
        : "";
    }  

    componentDidMount() {
        this.loadCourse();
        this.loadUserCourse();
    }

    render() {
        console.log(this.state.lecture);
        return <div>
            <NavBar navigation={this.props.navigation} title="Cloud Academy"/>
            <AppLayout headerSelector="#h"
                navigation={<SideNavigation
                    activeHref={!this.state.lecture || !this.state.lecture.lecture ? "" : this.state.lecture.lecture.id}
                    header={{ text: !this.state.course ? "" : this.state.course.name }}
                    onFollow={event => {
                        if (!event.detail.external) {
                            event.preventDefault();
                            if (!!event.detail.href) {
                                this.loadLectureById(event.detail.href);
                            }
                        }
                    }}
                    items={!this.state.course || !this.state.course.chapters ? [] : 
                        this.state.course.chapters.map(chapter => {
                            let chapterToRender = {
                                type: "section",
                                text: chapter.name,
                                items: chapter.lectures.map(lecture => {
                                    return {
                                        type: "link",
                                        text: lecture.name,
                                        href: lecture.lectureId,
                                }}),
                            };
                            return chapterToRender;
                        })
                    }
                />}
                breadcrumbs={<BreadcrumbGroup
                    items={[
                        { 
                            text: "My Learning", 
                            href: "/mylearning" 
                        },
                        {
                            text: !this.state.course ? "" : this.state.course.name
                        }
                    ]}
                    ariaLabel="Breadcrumbs"
                />}
                content={!this.state.course ? 
                    <LoadingContainer /> : 
                    <div fluid="true" className='learn-parent-container'>
                      <PageMetadata courseName={this.state.course.name} />

                      <div className='learn-video-player-container'>
                        <div className='learn-board'>
                            <div className='learn-board-header'>
                                Requirements
                            </div>
                            <div className='learn-board-content'>
                                <MainContent loading={this.state.loading}
                                lecture={this.state.lecture} 
                                nextLectureName={this.state.nextLectureName}
                                isFirst={this.state.lecture.chapterId === 0 && this.state.course.chapters[this.state.lecture.chapterId].lectures[this.state.lecture.lectureId].realIndex === 0}
                                isLast={this.state.lecture.chapterId === this.state.course.chapters.length - 1 && this.state.lecture.lectureId === this.state.course.chapters[this.state.lecture.chapterId].lectures.length - 1}
                                prevLecture={() => {this.prevLecture()}}
                                nextLecture={() => {this.nextLecture()}} />
                            </div>
                        </div>
                      </div>
                    </div>}
                disableContentPaddings={true}
            />
        </div>;
    }
}