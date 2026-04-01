import { createBrowserRouter } from "react-router";
import DarkTheme from "./screens/DarkTheme";
import LightTheme from "./screens/LightTheme";
import Root from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: DarkTheme },
      { path: "light", Component: LightTheme },
    ],
  },
]);
