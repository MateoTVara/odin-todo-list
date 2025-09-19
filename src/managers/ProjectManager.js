// src/managers/ProjectManager.js

import { persistenceManager, projects } from "../modules/persistence";
import { projectsManager, domManager } from "../managers";
import { List } from "../models";

class ProjectManager {
  constructor() {
    this.initEventListeners();
  }

  renderCard(card, listItem, addCardItem) {
    const el = card.getElement();
    listItem.insertBefore(el, addCardItem);
  }

  renderList(list) {
    const listElement = list.getElement();
    const listContainer = listElement.querySelector(".list-item");
    const addCardElement = listElement.querySelector(".add-card");

    domManager.projectDiv.insertBefore(listElement, domManager.addListDiv);
    list.cards.forEach(card => {
      this.renderCard(card, listContainer, addCardElement);
    })
    
    return listElement;
  }

  renderAllProjectLists() {
    const currentProject = projectsManager.getProjectInstanceById(projects, domManager.projectDiv.dataset.projectId);
    currentProject.lists.forEach(list => {
      this.renderList(list);
    });
  }

  clearListsDivs() {
    document.querySelectorAll(".list-item").forEach(listContainer => listContainer.parentElement.remove())
  }

  initEventListeners() {
    domManager.addListDiv.addEventListener("click", () => {
      const currentProject = projectsManager.getProjectInstanceById(projects, domManager.projectDiv.dataset.projectId);
      
      const list = new List();
      currentProject.lists.push(list);
  
      persistenceManager.updateProjects(currentProject);
  
      const listElement = this.renderList(list);

      const listTitle = listElement.querySelector(".title");
      listTitle.focus();
    });
  }
}

export const projectManager = new ProjectManager();