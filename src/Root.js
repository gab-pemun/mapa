import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./components/App";
import { HashLogger } from "./components/RouteLoggers";

const Root = () => (
  <>
    <HashLogger />
    <Routes>
      <Route
        path="vietnam/kingcongue"
        element={<App conflict={"vietnam"} showBLUFOR={false} showREDFOR={true} />}
      />
      <Route
        path="vietnam/deixaosgarotosbrincar"
        element={<App conflict={"vietnam"} showBLUFOR={true} showREDFOR={false} />}
      />
      <Route
        path="vietnam/peixesibito"
        element={<App conflict={"vietnam"} showBLUFOR={true} showREDFOR={true} />}
      />
      <Route
        path="vietnam/*"
        element={<App conflict={"vietnam"} showBLUFOR={false} showREDFOR={false} />}
      />

      <Route
        path="pernambuco/migowski"
        element={<App conflict={"pernambuco"} showBLUFOR={false} showREDFOR={true} />}
      />
      <Route
        path="pernambuco/almeidinha"
        element={<App conflict={"pernambuco"} showBLUFOR={true} showREDFOR={false} />}
      />
      <Route
        path="pernambuco/diretoria"
        element={<App conflict={"pernambuco"} showBLUFOR={true} showREDFOR={true} />}
      />
      <Route
        path="pernambuco/*"
        element={<App conflict={"pernambuco"} showBLUFOR={false} showREDFOR={false} />}
      />
      
      <Route
        path="alemanha/comunismovencera"
        element={<App conflict={"germany"} showBLUFOR={false} showREDFOR={true} />}
      />
      <Route
        path="alemanha/bondedotigrao"
        element={<App conflict={"germany"} showBLUFOR={true} showREDFOR={false} />}
      />
      <Route
        path="alemanha/diretoria"
        element={<App conflict={"germany"} showBLUFOR={true} showREDFOR={true} />}
      />
      <Route
        path="alemanha/*"
        element={<App conflict={"germany"} showBLUFOR={false} showREDFOR={false} />}
      />

      <Route
        path="panem/*"
        element={<App conflict={"panem"} showBLUFOR={true} showREDFOR={false} />}
      />

      <Route path="*" element={<App showBLUFOR={false} showREDFOR={false} />} />
    </Routes>
  </>
);

export default Root;