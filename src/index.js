// index.js

import "./styles.css";

class Project {
  constructor(name) {
    this.name = name;
    this.color = this.#generateRandomColor();
    this.id = crypto.randomUUID();
  }

  #generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`
  }

  #handleClick() {
    console.log(`Project: ${this.name}`);
    ProjectsManager.toggleProjectsDisplay();
  }

  #handleDelete() {
    ProjectsManager.remove(this.id);
    const projectDiv = document.querySelector(`[data-project-id='${this.id}']`);
    projectDiv.remove();
  }

  getElement () {
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.setAttribute("title", this.name)
    div.dataset.projectId = this.id
    div.addEventListener("click", (e) => this.#handleClick());

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("delete-btn");
    deleteDiv.textContent = "X";
    deleteDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      this.#handleDelete()
    });

    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = this.color;

    const h2 = document.createElement("h2");
    h2.textContent = this.name;

    div.append(deleteDiv, colorDiv, h2);

    return div;
  }
}

const DialogManager = (function() {
  const addProjectDialog = document.querySelector(".add-project-dialog");
  const addProjectFormButton = document.querySelector(".add-project-dialog form button");
  const addProjectFormInput = document.querySelector(".add-project-dialog form input");

  const toggleDialogDisplay = () => {
    addProjectDialog.classList.toggle("none-display");
  }

  const renderProject = () => {
    const project = new Project(addProjectFormInput.value);
    ProjectsManager.add({
      id: project.id,
      name: project.name,
      color: project.color
    });
    ProjectsManager.getProjectsDiv().insertBefore(project.getElement(), ProjectsManager.getAddProjectDiv());
    toggleDialogDisplay();
    addProjectFormInput.value = "";
  }

  addProjectDialog.addEventListener("click", (e) => {
    if (e.target === addProjectDialog) {
      toggleDialogDisplay();
    }
  })

  addProjectFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (addProjectFormInput.value !== "") {renderProject();}
  })

  return { toggleDialogDisplay };
})();

const ProjectsManager = (function() {
  const PROJECTS_STORAGE_KEY = "projects";

  const projects = (function() {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return raw ? JSON.parse(raw): {};
  })();

  const projectsShortcut = document.querySelector(".header > a");
  const projectsDiv = document.querySelector(".projects");
  const projectDiv = document.querySelector(".project");
  const addProjectDiv = document.querySelector(".add-project");

  const toggleProjectsDisplay = () => {
    projectsDiv.classList.toggle("none-display");
  }

  const save = () => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  const add = (projectData) => {
    projects[projectData.id] = {
      name: projectData.name,
      color: projectData.color
    };
    save();
  }

  const remove = (projectId) => {
    if (projects[projectId]){
      delete projects[projectId];
      save();
    }
  }

  const renderAllProjects = () => {
    projectsDiv.querySelectorAll(".project-item").forEach(element => element.remove());
    Object.keys(projects).forEach(persistedProjectId => {
      const persistedProjectData = projects[persistedProjectId];
      const project = new Project(persistedProjectData.name);
      project.id = persistedProjectId;
      project.color = persistedProjectData.color;
      projectsDiv.insertBefore(project.getElement(), addProjectDiv);
    })
  }

  projectsShortcut.addEventListener("click", (e) => {
    e.preventDefault();
    projectsDiv.classList.remove("none-display");
  });
  
  addProjectDiv.addEventListener("click", () => {
    DialogManager.toggleDialogDisplay();
  });

  const getProjectsDiv = () => projectsDiv;
  const getAddProjectDiv = () => addProjectDiv;

  renderAllProjects();

  return { 
    getProjectsDiv,
    getAddProjectDiv,
    toggleProjectsDisplay,
    add,
    remove,
    projects, 
  };
})();