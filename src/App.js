import { Fragment, useEffect, useState } from "react";

import KFSDK from "@kissflow/lowcode-client-sdk";

import DynamicTabs from "./tabs.jsx";

import "./index.css";

function App() {
  const [kf, setKf] = useState();

  useEffect(() => {
    setTimeout(() => {
      loadKfSdk();
    }, 200);
  }, []);

  async function loadKfSdk() {
    let kf = await KFSDK.initialize();
    window.kf = kf;
    setKf(true);
  }
  // return <Fragment><ProgressComponent /></Fragment>;
// return <Fragment>{kf && <ProgressComponent />}</Fragment>;
return <Fragment>{kf && <DynamicTabs/>}</Fragment>;
}

export default App;
