import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./translation";
import "./index.scss";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { deleteDB } from "idb";

localStorage.removeItem('activeAssessmentId');
await deleteDB('AslamExams');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
