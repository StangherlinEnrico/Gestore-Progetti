import { useState } from "react";
import { useProjects } from "./hooks/useProjects";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const { projects, addProject, deleteProject } = useProjects();
  const [projectName, setProjectName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      await addProject(projectName);
      setProjectName("");
    }
  };

  return (
    <div>
      <h1>{t("app.title")}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nome progetto"
        />
        <button type="submit">Aggiungi</button>
      </form>

      <ul>
        {projects?.map((project) => (
          <li key={project.id}>
            {project.name}
            <button onClick={() => deleteProject(project.id!)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
