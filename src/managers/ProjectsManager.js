// src/managers/ProjectsManager.js

import { projects, projectsOrder } from "../modules/persistence";
import { Project, List, Card } from "../models";
import { dialogManager, dragDropManager } from "../managers";

class ProjectsManager {
  constructor() {
    this.projectsDiv = document.querySelector(".projects");
    this.addProjectDiv = document.querySelector(".add-project");
    this.initEventListeners();
  }

  getProjectInstanceById(projects, projectId) {
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

  renderAllProjects() {
    this.projectsDiv.querySelectorAll(".project-item").forEach(element => element.remove());
    projectsOrder.forEach(persistedProjectId => {
      const project = this.getProjectInstanceById(projects, persistedProjectId);
      this.projectsDiv.insertBefore(project.getElement(), this.addProjectDiv);
    })
    dragDropManager.update();
  }

  initEventListeners() {
    this.addProjectDiv.addEventListener("click", () => {
      dialogManager.toggleDialogDisplay();
      dialogManager.getProjectNameInput().focus();
    })
  }
}

export const projectsManager = new ProjectsManager();