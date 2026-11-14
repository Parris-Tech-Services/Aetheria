import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installStaticApi } from "./lib/static-mode";

installStaticApi();

createRoot(document.getElementById("root")!).render(<App />);
