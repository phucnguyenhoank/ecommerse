import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/global.css';
// import keycloak from './keycloak';
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App/>
      </React.StrictMode>
  );
  console.log("Running this function");
} else {
  console.error("No root element found!");
}
// keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256' }).then((authenticated) => {
//     console.log(`Keycloak initialized. Authenticated: ${authenticated}`);
//     ReactDOM.createRoot(document.getElementById('root')!).render(
//         <React.StrictMode>
//             <App />
//         </React.StrictMode>
//     );
// }).catch((error) => {
//     console.error('Keycloak initialization failed:', error);
// });