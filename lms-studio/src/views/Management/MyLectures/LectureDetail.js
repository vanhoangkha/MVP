import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Storage } from "aws-amplify";
import "video-react/dist/video-react.css";
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  ColumnLayout,
} from "@cloudscape-design/components";
import {
  Player,
  LoadingSpinner,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlaybackRateMenuButton,
  VolumeMenuButton,
  FullscreenToggle,
} from "video-react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { covertTime } from "../../../utils/tool";
import Papa from "papaparse";
import "./LectureDetail.css";

const MAX_ANSWERS = 6;

function MainContent(props) {
  switch (props.lecture.Type) {
    case "Video":
      return (
        <VideoContent
          videoSrc={props.lecture.Content}
          handleFullScreen={props.handleFullScreen}
          lectureId={props.lecture.ID}
        />
      );
    case "Workshop":
      return (
        <LabContent
          desc={props.lecture.WorkshopDesc}
          url={props.lecture.WorkshopUrl}
          architect={props.lecture.Content}
          openLink={props.openLink}
        />
      );
    case "Quiz":
      return (
        <QuizContent
          desc={props.lecture.Desc}
          url={props.lecture.Content}
          // openLink={props.openLink}
          name={props.lecture.Name}
          // questions={props.lecture.lecture.questions}
          // nextLecture={props.nextLecture}
          // markLectureCompleted={props.markLectureCompleted}
          // setQuestionLength={props.setQuestionLength}
        />
      );
    default:
      return <></>;
  }
}

function VideoContent(props) {
  const [videoSrc, setVideoSrc] = useState("");
  const [player, setPlayer] = useState();

  useEffect(() => {
    getVideoURL(props.videoSrc);
    // player.subscribeToStateChange(handleStateChange.bind(this));
    // player.actions.toggleFullscreen = () => {
    //   props.handleFullScreen();
    // };
    console.log(player);
  });

  const getVideoURL = async (key) => {
    const signedURL = await Storage.get(key, { level: "public" });
    setVideoSrc(signedURL);
  };

  return (
    <Player
      ref={(player) => {
        setPlayer(player);
      }}
      className="review-transparent-player"
      playsInline
      fluid={false}
      height="100%"
      width="100%"
      src={videoSrc}
    >
      <LoadingSpinner />
      <BigPlayButton position="center" />
      <ControlBar>
        <ReplayControl seconds={5} order={2.1} />
        <ForwardControl seconds={5} order={2.2} />
        <PlaybackRateMenuButton
          rates={[2, 1.5, 1.25, 1, 0.9, 0.75]}
          order={7}
        />
        <VolumeMenuButton order={8} />
        <FullscreenToggle disabled />
      </ControlBar>
    </Player>
  );
}

function LabContent(props) {
  const [architectUrl, setArchitecUrl] = useState("");
  useEffect(() => {
    Storage.get(props.architect, { level: "public" }).then((res) =>
      setArchitecUrl(res)
    );
  });
  return (
    <div className="review-lab-content-container">
      <div className="review-lab-content-desc">{props.desc}</div>
      <div className="review-lab-content-link">
        <button
          onClick={() => {
            props.openLink(props.url);
          }}
        >
          {props.url}
        </button>
      </div>
      <div className="review-lab-architech" style={{ textAlign: "center" }}>
        <img src={architectUrl} />
      </div>
    </div>
  );
}

function QuizContent(props) {
  const [state, setState] = useState({
    questions: [],
    quizStarted: false,
    quizDone: false,
    quizPassed: false,
    currentQuestionAnswered: false,
    currentQuestion: 0,
    selectedAnswer: null,
    selectedMultiAnswer: [],
    checkedAnswer: Array(6).fill(false),
    correctedAnswer: 0,
  });
  const convertCSVtoJSON = async (key) => {
    var commonConfig = { delimiter: ";" };
    const signedURL = await Storage.get(key, { level: "public" });

    Papa.parse(signedURL, {
      ...commonConfig,
      header: true,
      download: true,
      complete: (result) => {
        setState({ ...state, questions: Array.from(result.data) });
        // props.setQuestionLength(result.data.length)
        // this.convertJSONToObject(result.data)
        console.log(result.data);
      },
    });
  };

  useEffect(() => {
    convertCSVtoJSON(props.url);
  }, []);

  return (
    <ul className="review-question">
      {/* <ol type="1"> */}
      {state.questions.map((item, index) => (
        <li key={index} style={{ paddingBottom: "20px" }}>
          <strong>
            Question {index + 1}. {item.Question}
          </strong>
          <ul>
            {(() => {
              let answers = [];
              for (let i = 0; i < 6; i++) {
                if (item[`A${i}`]) {
                  answers.push(
                    <div className="review-answer">
                      <li>{item[`A${i}`]}</li>
                    </div>
                  );
                }
              }
              return answers;
            })()}
          </ul>
          <div>
            <strong>Answers: </strong>
            <ul>
              {(() => {
                let correct = [];
                for (let i = 0; i < 6; i++) {
                  if (item[`C${i}`]) {
                    const answerIndex = item[`C${i}`];
                    correct.push(
                      <div className="review-answer">
                        <li>{item[`A${answerIndex}`]}</li>
                      </div>
                    );
                  }
                }
                return correct;
              })()}
            </ul>
          </div>
          <div>
            <strong>Explains: </strong>
            <ul>
              {(() => {
                let explain = [];
                for (let i = 0; i < 6; i++) {
                  if (item[`E${i}`]) {
                    explain.push(
                      <div className="review-answer">
                        <li>{item[`E${i}`]}</li>
                      </div>
                    );
                  }
                }
                return explain;
              })()}
            </ul>
          </div>
        </li>
      ))}
      {/* </ol> */}
    </ul>
  );
}

export default function LectureDetail(props) {
  const [fullscreen, setFullscreen] = useState(false);
  const handle = useFullScreenHandle();
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="review-parent-container">
      <div className="review-video-player-container">
        <div className="review-board">
          <Container
            header={
              <Header
                variant="h2"
                actions={
                  <Button
                    onClick={() =>
                      navigate(`/editLecture/${state.ID}`, {
                        state: state,
                      })
                    }
                  >
                    Edit lecture
                  </Button>
                }
              >
                Lecture Overview
              </Header>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              <div>
                <Box variant="awsui-key-label">Lecture title</Box>
                <div>{state.Name}</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Description</Box>
                <div>
                  {state.Type === "Workshop"
                    ? state.WorkshopDescription
                    : state.Desc}
                </div>
              </div>
              <ColumnLayout columns={4} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">Type</Box>
                  <div>{state.Type}</div>
                </div>
                <div>
                  <Box variant="awsui-key-label">File name</Box>
                  <div>{state.Content}</div>
                </div>
                <div>
                  {state.Length > 0 ? (
                    <>
                      <Box variant="awsui-key-label">Length</Box>
                      <div>
                        {state.Length > 0 ? covertTime(state.Length) : 0}
                      </div>
                    </>
                  ) : (
                    <>
                      <Box variant="awsui-key-label">Workshop Url</Box>
                      <div>{state.WorkshopUrl}</div>
                    </>
                  )}
                </div>
                <div>
                  <Box variant="awsui-key-label">Views</Box>
                  <div>{String(state.Views).replace(/(.)(?=(\d{3})+$)/g,'$1,')}</div>
                </div>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
          {/* <Container header={<Header variant="h2">Lecture Content</Header>}> */}
          <div className="review-board-content">
            <Header variant="h2">Lecture Content</Header>
            <br />
            <FullScreen handle={handle}>
              <div
                className={
                  fullscreen
                    ? "review-content-parent full-screen"
                    : "review-content-parent"
                }
              >
                <div className="review-content-main">
                  <MainContent
                    handleFullScreen={() => {
                      if (fullscreen) handle.exit();
                      else handle.enter();
                      setFullscreen(!fullscreen);
                    }}
                    lecture={state}
                    openLink={(url) => {
                      setFullscreen(false);
                      window.open(url, "_blank").focus();
                    }}
                  />
                </div>
              </div>
            </FullScreen>
          </div>

          {/* </Container> */}
        </div>
      </div>
    </div>
  );
}
