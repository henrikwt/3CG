import React, { Suspense } from "react";
import styled from "styled-components";
import RenderView from "./Components/RenderView";
import Layout from "./Components/Layout";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const App = () => {
  console.log("%c [App] is rendering", "background: #111; color: #ebd31c");

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Wrapper>
        <RenderView />
        <Layout />
      </Wrapper>
    </Suspense>
  );
};

export default App;
