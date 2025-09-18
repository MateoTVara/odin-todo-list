// index.js

import { createSwapy } from 'swapy';
import { Helper } from './modules/helper';
import { persistenceManager, projects, projectsOrder } from './modules/persistence';
import { List, Card } from './modules/project';
import "./styles.css";

let isDragging = false;

class Project {
  constructor(name) {
    this.name = name;
    this.color = Helper.randomColor();
    this.id = crypto.randomUUID();
    this.lists = [];
  }

  #handleClick() {
    if (isDragging) return;
    console.log(`Project: ${this.name}`);
    ProjectsManager.toggleProjectsDisplay();
    ProjectsManager.toggleProjectDisplay();
    ProjectsManager.setProjectDivDatasetProjectId(this.id);
    ProjectsManager.getProjectDiv().scrollLeft = 0;
    ProjectManager.renderAllProjectLists()
  }

  #handleDelete() {
    persistenceManager.removeProject(this);
    const element = document.querySelector(`[data-project-id="${this.id}"]`).parentElement;
    element.remove();
  }

  getElement () {
    const handle = Helper.createElement("div", {
      classes: ["handle"], 
      dataAttrs: {swapyHandle: ""}
    })

    const deleteBtn = Helper.createElement("div", {
      text: "X", 
      classes: ["delete-btn"],
      listeners: {
        click: (e) => {
        e.stopPropagation();
        this.#handleDelete();
      }}
    })

    const colorContainer = Helper.createElement("div", {
      styles: {backgroundColor: this.color}, 
      children: [handle, deleteBtn]
    })

    const title = Helper.createElement("h2", {text: this.name})

    const projectContainer = Helper.createElement("div", {
      classes: ["project-item"],
      attrs: {title: this.name},
      dataAttrs: {projectId: this.id, swapyItem: this.id},
      listeners: {click: () => this.#handleClick()},
      children: [colorContainer, title]
    })
    
    const projectElement = Helper.createElement("div", {
      dataAttrs: {swapySlot: this.id}, 
      children: [projectContainer]
    });

    return projectElement;
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
    persistenceManager.addProject(project);
    ProjectsManager.getProjectsDiv().insertBefore(project.getElement(), ProjectsManager.getAddProjectDiv());
    SwapyManager.swapy.update();
    toggleDialogDisplay();
    addProjectFormInput.value = "";
  }

  const getProjectNameInput = () => {return addProjectFormInput};

  addProjectDialog.addEventListener("click", (e) => {
    if (e.target === addProjectDialog) {
      toggleDialogDisplay();
    }
  })

  addProjectFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (addProjectFormInput.value !== "") {renderProject();}
  })

  return { toggleDialogDisplay, getProjectNameInput };
})();

const ProjectsManager = (function() {
  const projectsShortcut = document.querySelector(".header > a");
  const projectsDiv = document.querySelector(".projects");
  const projectDiv = document.querySelector(".project");
  const addProjectDiv = document.querySelector(".add-project");

  const getProjectInstanceById = (projects, projectId) => {
    const projectData = projects[projectId];
    const project = new Project(projectData.name);
    project.id = projectId;
    project.color = projectData.color;
    project.lists = projectData.lists.map(listData => {
      const list = new List(listData.title);
      list.id = listData.id;
      list.cards = listData.cards.map(cardData => {
        const card = new Card(cardData.description, cardData.locked);
        card.id = cardData.id;
        return card;
      })
      return list;
    })
    return project;
  }

  const toggleProjectsDisplay = () => {
    projectsDiv.classList.toggle("none-display");
  }

  const toggleProjectDisplay = () => {
    projectDiv.classList.toggle("none-display");
  }

  const setProjectDivDatasetProjectId = (projectId) => {
    projectDiv.dataset.projectId = projectId;
  }

  const removeProjectDivDatasetProjectId = () => {
    delete projectDiv.dataset.projectId;
  }

  const renderAllProjects = () => {
    projectsDiv.querySelectorAll(".project-item").forEach(element => element.remove());
    projectsOrder.forEach(persistedProjectId => {
      const project = getProjectInstanceById(projects, persistedProjectId);
      projectsDiv.insertBefore(project.getElement(), addProjectDiv);
    })
  }

  projectsShortcut.addEventListener("click", (e) => {
    e.preventDefault();
    projectDiv.classList.add("none-display");
    projectsDiv.classList.remove("none-display");
    ProjectManager.clearListsDivs();
    removeProjectDivDatasetProjectId();
  });
  
  addProjectDiv.addEventListener("click", () => {
    DialogManager.toggleDialogDisplay();
    DialogManager.getProjectNameInput().focus();
  });

  const getProjectsDiv = () => projectsDiv;
  const getProjectDiv = () => projectDiv;
  const getAddProjectDiv = () => addProjectDiv;

  renderAllProjects();

  return { 
    getProjectInstanceById,
    getProjectsDiv,
    getProjectDiv,
    getAddProjectDiv,
    toggleProjectsDisplay,
    toggleProjectDisplay,
    setProjectDivDatasetProjectId,
    projects, 
  };
})();

const ProjectManager = (function () {
  const projectDiv = document.querySelector(".project");
  const addListDiv = document.querySelector(".add-list");

  const getProjectDiv = () => {return projectDiv};

  const renderCard = (card, listItem, addCardItem) => {
    const el = card.getElement();
    listItem.insertBefore(el, addCardItem)
  }

  const renderList = (list) => {
    const el = list.getElement();
    const listItem = el.querySelector(".list-item");
    const addCardItem = el.querySelector(".add-card");
    projectDiv.insertBefore(el, addListDiv);
    list.cards.forEach(card => {
      renderCard(card, listItem, addCardItem);
    })
    return el;
  }

  const renderAllProjectLists = () => {
    const currentProject = ProjectsManager.getProjectInstanceById(projects, projectDiv.dataset.projectId);
    currentProject.lists.forEach(list => {
      renderList(list);
    });
  }

  const clearListsDivs = () => {
    document.querySelectorAll(".list-item").forEach(listDiv => listDiv.parentElement.remove())
  }

  addListDiv.addEventListener("click", () => {
    const currentProject = ProjectsManager.getProjectInstanceById(projects, projectDiv.dataset.projectId);
    const list = new List();

    currentProject.lists.push(list);

    persistenceManager.updateProjects(currentProject);

    const listElement = renderList(list);
    const listTitle = listElement.querySelector(".title");
    listTitle.focus();
  });

  return { renderAllProjectLists, clearListsDivs, getProjectDiv }
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
    persistenceManager.updateProjectsOrder(newOrder);

    setTimeout(() => {
      isDragging = false;
      console.log(`Drag ended ${isDragging}`);
    }, 50);
  });

  return { swapy };
})();

export { ProjectsManager, ProjectManager, Project, persistenceManager, projects };