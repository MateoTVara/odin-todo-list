// index.js

import { createSwapy } from 'swapy';
import { ProjectManager } from './modules/project';
import "./styles.css";

let isDragging = false;

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
    if (isDragging) return;
    console.log(`Project: ${this.name}`);
    ProjectsManager.toggleProjectsDisplay();
    ProjectsManager.toggleProjectDisplay();
  }

  #handleDelete() {
    ProjectsManager.remove(this.id);
    const element = document.querySelector(`[data-project-id="${this.id}"]`).parentElement;
    element.remove();
  }

  getElement () {
    const slotDiv = document.createElement("div");
    slotDiv.dataset.swapySlot = this.id;
    
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.setAttribute("title", this.name);
    div.dataset.projectId = this.id;
    div.dataset.swapyItem = this.id;

    div.addEventListener("click", () => this.#handleClick());

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("delete-btn");
    deleteDiv.textContent = "X";
    deleteDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      this.#handleDelete()
    });

    const handleDiv = document.createElement("div");
    handleDiv.classList.add("handle");
    handleDiv.dataset.swapyHandle = "";

    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = this.color;

    const h2 = document.createElement("h2");
    h2.textContent = this.name;

    colorDiv.append(handleDiv, deleteDiv);

    div.append(colorDiv, h2);
    
    slotDiv.appendChild(div);
    
    return slotDiv;
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
    SwapyManager.swapy.update();
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
  const ORDER_STORAGE_KEY = "projects-order";

  const projects = (function() {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return raw ? JSON.parse(raw): {};
  })();

  const projectsOrder = (function() {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw): [];
  })();

  const projectsShortcut = document.querySelector(".header > a");
  const projectsDiv = document.querySelector(".projects");
  const projectDiv = document.querySelector(".project");
  const addProjectDiv = document.querySelector(".add-project");

  const toggleProjectsDisplay = () => {
    projectsDiv.classList.toggle("none-display");
  }

  const toggleProjectDisplay = () => {
    projectDiv.classList.toggle("none-display");
  }

  const save = () => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(projectsOrder))
  }

  const add = (projectData) => {
    projects[projectData.id] = {
      name: projectData.name,
      color: projectData.color
    };
    projectsOrder.push(projectData.id);
    save();
  }

  const remove = (projectId) => {
    if (projects[projectId]){
      delete projects[projectId];
      const index = projectsOrder.indexOf(projectId);
      projectsOrder.splice(index, 1);
      save();
    }
  }

  const updateOrder = (newOrder) => {
    projectsOrder.length = 0;
    projectsOrder.push(...newOrder);
    save();
  }

  const renderAllProjects = () => {
    projectsDiv.querySelectorAll(".project-item").forEach(element => element.remove());
    projectsOrder.forEach(persistedProjectId => {
      const persistedProjectData = projects[persistedProjectId];
      const project = new Project(persistedProjectData.name);
      project.id = persistedProjectId;
      project.color = persistedProjectData.color;
      projectsDiv.insertBefore(project.getElement(), addProjectDiv);
    })
  }

  projectsShortcut.addEventListener("click", (e) => {
    e.preventDefault();
    projectDiv.classList.add("none-display");
    projectsDiv.classList.remove("none-display");
  });
  
  addProjectDiv.addEventListener("click", () => {
    DialogManager.toggleDialogDisplay();
  });

  const getProjectsDiv = () => projectsDiv;
  const getAddProjectDiv = () => addProjectDiv;

  renderAllProjects();
  ProjectManager.attachAddListListener();

  return { 
    getProjectsDiv,
    getAddProjectDiv,
    toggleProjectsDisplay,
    toggleProjectDisplay,
    add,
    remove,
    updateOrder,
    projects, 
  };
})();

const SwapyManager = (function(){
  const swapy = createSwapy(ProjectsManager.getProjectsDiv(), {
    animation: 'dynamic',
    autoScrollOnDrag: true,
  })

  swapy.onSwapStart(() => {
    isDragging = true;
    console.log(`Drag started ${isDragging}`);
  });

  swapy.onSwapEnd(() => {
    const newOrder = Array.from(ProjectsManager.getProjectsDiv().querySelectorAll("[data-project-id]")).map(e => e.dataset.projectId);
    ProjectsManager.updateOrder(newOrder);

    setTimeout(() => {
      isDragging = false;
      console.log(`Drag ended ${isDragging}`);
    }, 50);
  });

  return { swapy };
})();