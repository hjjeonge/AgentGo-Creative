import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { EditorPage } from "./pages/EditorPage";
import { TemplatePage } from "./pages/TemplatePage";
import { Layout } from "./components/commons/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/template" element={<TemplatePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
