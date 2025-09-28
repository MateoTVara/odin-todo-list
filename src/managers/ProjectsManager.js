// src/managers/ProjectsManager.js

import { projects, projectsOrder } from "../modules/persistence";
import { Project, List, Card } from "../models";
import { dialogManager, domManager, dragDropManager } from "../managers";

class ProjectsManager {
  constructor() {
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
        card.dueDate = cardData.dueDate;
        card.notes = cardData.notes;
        card.checkLists = cardData.checkLists;
        card.priority = cardData.priority;
        return card;
      })
      return list;
    })
    return project;
  }

  renderAllProjects() {
    domManager.projectsDiv.querySelectorAll(".project-item").forEach(element => element.remove());
    projectsOrder.forEach(persistedProjectId => {
      const project = this.getProjectInstanceById(projects, persistedProjectId);
      domManager.projectsDiv.insertBefore(project.getElement(), domManager.addProjectDiv);
    })
    dragDropManager.update();
  }

  initEventListeners() {
    domManager.addProjectDiv.addEventListener("click", () => {
      dialogManager.toggleDialogDisplay();
      domManager.addProjectFormInput.focus();
    })
  }
}

export const projectsManager = new ProjectsManager();