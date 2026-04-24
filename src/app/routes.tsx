import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { Loading } from "./pages/Loading";
import { Results } from "./pages/Results";
import { Paywall } from "./pages/Paywall";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/quiz",
    Component: Quiz,
  },
  {
    path: "/loading",
    Component: Loading,
  },
  {
    path: "/results",
    Component: Results,
  },
  {
    path: "/plan",
    Component: Paywall,
  },
]);
