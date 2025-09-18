// index.js

import { createSwapy } from 'swapy';
import { Project, List, Card } from './models';
import { persistenceManager, projects, projectsOrder } from './modules/persistence';
import { dialogManager } from './managers';
import "./styles.css";

let isDragging = false;

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
    dialogManager.toggleDialogDisplay();
    dialogManager.getProjectNameInput().focus();
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
    setProjectDivDatasetProjectId
  };
})();

const ProjectManager = (function () {
  const projectDiv = ProjectsManager.getProjectDiv();
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

export { ProjectsManager, ProjectManager, SwapyManager, isDragging };