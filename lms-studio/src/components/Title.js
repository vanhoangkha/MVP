import React from "react";

const Title = (props) => {
  return (
    <div style={{marginBottom: 24}}>
      <h1 style={{margin: 0}}>{props.text}</h1>
      <div style={{
        width: '120px',
        height: '2px',
        backgroundColor: '#0972d3'
      }}></div>
    </div>
  );
};

export default Title;
