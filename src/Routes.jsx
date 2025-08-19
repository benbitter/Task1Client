import { createBrowserRouter } from "react-router-dom";
import App from "./App";



//386959515770-ibtut74slp55ehlis7d1sh0u5ku412d3.apps.googleusercontent.com

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    ],
  },
  {
    path:"*",
    element:<h1>404 Not Found</h1>
  }
]);

export {Routes};
