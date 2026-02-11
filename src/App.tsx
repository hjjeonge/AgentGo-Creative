import { Route, Routes } from "react-router-dom";
import "./App.css";
import { DashboardPage } from "./pages/DashboardPage";
import { EditorPage } from "./pages/EditorPage";
import { TemplatePage } from "./pages/TemplatePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/template" element={<TemplatePage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
