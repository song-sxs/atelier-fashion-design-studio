import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import InspirationBoard from "./components/InspirationBoard";
import DesignWorkspace from "./components/DesignWorkspace";
import FabricLibrary from "./components/FabricLibrary";
import ProjectManagement from "./components/ProjectManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<InspirationBoard />} />
          <Route path="workspace" element={<DesignWorkspace />} />
          <Route path="fabrics" element={<FabricLibrary />} />
          <Route path="projects" element={<ProjectManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
