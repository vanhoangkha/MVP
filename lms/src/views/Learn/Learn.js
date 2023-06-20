import React, { useState } from "react";
import './Learn.css';
import "video-react/dist/video-react.css";
import { API, Auth } from 'aws-amplify';
import {Helmet} from "react-helmet";
import NavBar from '../../components/NavBar/NavBar';
import { AppLayout, BreadcrumbGroup, SideNavigation, Toggle } from '@cloudscape-design/components';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { Player, LoadingSpinner, BigPlayButton, ControlBar, ReplayControl, ForwardControl, PlaybackRateMenuButton, VolumeMenuButton, FullscreenToggle } from 'video-react';

import { IoChevronBack, IoChevronForward, IoExpand, IoContract, IoClose, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoTimeOutline, IoEllipseSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { Navigate } from "react-router-dom";

import loadingGif from '../../assets/images/loading.gif';

const DEBUG = true;
const landingPageUrl = "https://dev.dfpjafbqllhh1.amplifyapp.com/";

function PageMetadata(props) {
    return <Helmet>
        <title>{props.courseName}</title>
    </Helmet>
  }
  
  function LoadingContainer() {
    return <div fluid="true" className='learn-parent-loading'>
        <img src={loadingGif} alt="loading..." className='learn-loading-gif' />
    </div>;
  }
  
  function ContentLoading() {
    return <div className='learn-player-loading'>
        <img src={loadingGif} alt="loading..." className='learn-loading-gif' />
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
      {/* <div className="learn-lab-content-header">Bài tập thực hành</div> */}
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
      {/* <div className="learn-lab-content-header">Tài liệu tham khảo</div> */}
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
      {/* <div className="learn-lab-content-header">{props.name}</div> */}
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
      <div className={fullscreen ? 'learn-content-parent full-screen' : 'learn-content-parent'}>
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
                props.markLectureCompleted();
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
            <Toggle Todo
              className="learn-auto-next-control"
              id="toggle-check"
              type="checkbox"
              variant="outline-secondary"
              checked={autoNext}
              onChange={(e) => setAutoNext(!autoNext)}
            >
              Auto Next
              {autoNext ? 
                <IoCheckmarkCircleOutline className='learn-auto-next-control-icon'/> : 
                <IoCloseCircleOutline className='learn-auto-next-control-icon'/>}
            </Toggle>
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
                <div className="learn-next-lecture-count">
                    {timeLeft}
                </div>
                <div className="learn-next-lecture-right">
                    <div>
                        <div className="learn-next-lecture-header">Next</div>
                        <button className='learn-next-lecture-cancel' onClick={() => {
                            setAutoNext(false);
                        }}>
                            <IoClose/>
                        </button>
                    </div>
                    <div className="learn-next-lecture-name">
                        {props.nextLectureName}
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
        loggedIn: null,
        loading: true,
        course: null,
        lecture: {
          chapterId: 0,
          lectureId: 0,
          lecture: null
        },
        nextLectureName: "",
        completedLectures: [],
      };
    }
  
    getHashParams() {
      return {
        course: window.location.hash.split("/")[2],
        lecture: window.location.hash.split("/")[4],
      }
    }
  
    setHashParams(course, lecture) {
        if (!lecture)
            window.location.hash = "/learn/" + course;
        else
            window.location.hash = "/learn/" + course + "/lecture/" + lecture;
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
        this.state.course.chapters.forEach((chapter, chapterIndex) => {
            chapter.lectures.forEach((lecture, lectureIndex) => {
                if (lecture.lectureId === lectureId) {
                    this.loadLecture(chapterIndex, lectureIndex);
                }
            })
        })
    }
  
    loadLecture(chapterIndex, lectureIndex) {
        let lectureId = this.state.course.chapters[chapterIndex].lectures[lectureIndex].lectureId;
    
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
                }, () => {
                    let hashParams = this.getHashParams();
                    this.setHashParams(hashParams.course, response.ID);
                    this.setLocalStorage(hashParams.course, response.ID);
                    
                    if (this.state.lecture.lecture.type === 'lab' || this.state.lecture.lecture.type === 'survey' || this.state.lecture.lecture.type === 'document') {
                        this.markLectureCompleted(this.state.lecture.lecture.id);
                    }
                });
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
                    totalLecture: 0,
                }
        
                let chapters = course.chapters;
                let firstLectureIndex = 0;
                let hashChapterIndex = -1;
                let hashLectureIndex = -1;
                while (chapters[0].lectures[firstLectureIndex].type === "section") firstLectureIndex++;
        
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i].length = 0;
                    chapters[i].lectures[0].realIndex = 0;
                    chapters[i].length += chapters[i].lectures[0].length;
                    for (let j = 1; j < chapters[i].lectures.length; j++) {
                        if (chapters[i].lectures[j-1].type === "section") {
                            chapters[i].lectures[j].realIndex = chapters[i].lectures[j-1].realIndex;
                        } else {
                            chapters[i].lectures[j].realIndex = chapters[i].lectures[j-1].realIndex + 1;
                            chapters[i].length += chapters[i].lectures[j].length;
                        }
                    }
                }

                chapters.forEach(chapter => {
                    chapter.lectures.forEach(lecture => course.totalLecture += lecture.type !== "section");
                })
        
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
                        totalLecture: course.totalLecture
                    },
                }, () => {
                    this.loadUserLecture();
                    if (hashLectureIndex === -1) 
                        this.loadLecture(0, firstLectureIndex);
                    else
                        this.loadLecture(hashChapterIndex, hashLectureIndex);
                });
            })
            .catch(error => {
                console.log(error);
                if (!DEBUG)
                    window.location.href = landingPageUrl;
            });
    }

    loadUserCourse() {
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
  
    loadUserLecture() {
        const apiName = 'courses';
        const path = '/users/lectures/' + this.state.userId;

        console.log(path);
        
        API.get(apiName, path)
            .then((response) => {
                let completedLectures = [];
                response.forEach(lecture => {
                    completedLectures.push(lecture.LectureID);
                })
                this.setState({
                    completedLectures: completedLectures,
                })
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

    async markLectureCompleted(lectureId) {
        if (!this.state.completedLectures.includes(lectureId)) {
            this.setState(prevState => {
                if (!prevState.completedLectures.includes(lectureId))
                    prevState.completedLectures.push(lectureId);
                    const apiName = 'courses';
                    const path = '/users/lectures';
                    const myInit = {
                        body: {
                            UserID: this.state.userId,
                            LectureID: lectureId,
                            Status: "COMPLETED",
                        }
                    };

                    API.put(apiName, path, myInit)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log(error.response);
                    });
                return prevState;
            });
        }
    }
    
    async ionViewCanEnter() {
        try {
            await Auth.currentAuthenticatedUser();
            this.setState({
                loggedIn: true,
            })
        } catch {
            this.setState({
                loggedIn: false,
            })
        }
    }
    
    async loadUserId(callback) {
        let credentials = await Auth.currentUserCredentials();
        this.setState({
            userId: credentials.identityId,
        }, callback)
    }

    componentDidMount() {
        this.ionViewCanEnter();
        this.loadUserId(() => this.loadCourse());
        this.loadCourse();
        this.loadUserCourse();
    }

    formatTime(timeInSecond) {
        let minute = Math.floor(timeInSecond / 60);
        let second = timeInSecond % 60;

        if (minute < 10) minute = "0" + minute;
        if (second < 10) second = "0" + second;

        return minute + ":" + second;
    }

    render() {
        return this.state.loggedIn === false 
            ? <Navigate to="/auth" />
            : <div>
                <NavBar navigation={this.props.navigation} title="Cloud Academy"/>
                <AppLayout headerSelector="#h"
                    navigation={<SideNavigation
                        activeHref={!this.state.lecture || !this.state.lecture.lecture ? "" : this.state.lecture.lecture.id}
                        header={{ text: !this.state.course ? "" : this.state.course.name }}
                        onFollow={event => {
                            if (!event.detail.external) {
                                event.preventDefault();
                                if (!!event.detail.href) {
                                    if (event.detail.href === "#certificate") {
                                        console.log("View Cert");
                                    } else {
                                        this.loadLectureById(event.detail.href);
                                    }
                                }
                            }
                        }}
                        items={!this.state.course || !this.state.course.chapters ? [] : [
                                {
                                    type: "link",
                                    href: this.state.completedLectures.length / this.state.course.totalLecture >= 0.8 ? "#certificate" : "",
                                    text: this.state.completedLectures.length / this.state.course.totalLecture >= 0.8
                                        ? <span className="learn-navigation-progress-completed">Completed  {this.state.completedLectures.length} out of {this.state.course.totalLecture} lectures <IoCheckmarkSharp/></span>
                                        : <span className="learn-navigation-progress">Completed  {this.state.completedLectures.length} out of {this.state.course.totalLecture} lectures</span>
                                }
                            ].concat(
                                this.state.course.chapters.map(chapter => {
                                    let chapterToRender = {
                                        type: "section",
                                        text: <div className="learn-navigation-chapter">{chapter.name} <span><IoTimeOutline /> {this.formatTime(chapter.length)}</span></div>,
                                        defaultExpanded: !!this.state.lecture && !!this.state.lecture.lecture && chapter.lectures.filter(lecture => lecture.lectureId === this.state.lecture.lecture.id).length > 0,
                                        items: chapter.lectures.map(lecture => {
                                            return {
                                                type: "link",
                                                text: lecture.name,
                                                href: lecture.lectureId,
                                                info: this.state.completedLectures.includes(lecture.lectureId)
                                                    ? <span className="learn-navigation-badge"><IoEllipseSharp/>{this.formatTime(lecture.length)}</span>
                                                    : <span className="learn-navigation-badge">{this.formatTime(lecture.length)}</span>
                                            }
                                        }),
                                    };
                                    return chapterToRender;
                                })
                            )
                        }
                    />}
                    breadcrumbs={<BreadcrumbGroup
                        items={[
                            { 
                                text: "My Learning", 
                                href: "#/mylearning" 
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
                                    {!this.state.lecture.lecture ? "" : this.state.lecture.lecture.name}
                                </div>
                                <div className='learn-board-content'>
                                    <MainContent loading={this.state.loading}
                                        lecture={this.state.lecture} 
                                        nextLectureName={this.state.nextLectureName}
                                        isFirst={this.state.lecture.chapterId === 0 && this.state.course.chapters[this.state.lecture.chapterId].lectures[this.state.lecture.lectureId].realIndex === 0}
                                        isLast={this.state.lecture.chapterId === this.state.course.chapters.length - 1 && this.state.lecture.lectureId === this.state.course.chapters[this.state.lecture.chapterId].lectures.length - 1}
                                        markLectureCompleted={() => {this.markLectureCompleted(this.state.lecture.lecture.id)}}
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