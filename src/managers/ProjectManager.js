// src/managers/ProjectManager.js

import { persistenceManager, projects } from "../modules/persistence";
import { projectsManager } from "../managers";
import { List } from "../models";

class ProjectManager {
  constructor() {
    this.projectDiv = document.querySelector(".project");
    this.addListDiv = document.querySelector(".add-list");

    this.initEventListeners();
  }

  renderCard(card, listItem, addCardItem) {
    const el = card.getElement();
    listItem.insertBefore(el, addCardItem);
  }

  renderList(list) {
    const el = list.getElement();
    const listItem = el.querySelector(".list-item");
    const addCardItem = el.querySelector(".add-card");
    this.projectDiv.insertBefore(el, this.addListDiv);
    list.cards.forEach(card => {
      this.renderCard(card, listItem, addCardItem);
    })
    return el;
  }

  renderAllProjectLists() {
    const currentProject = projectsManager.getProjectInstanceById(projects, this.projectDiv.dataset.projectId);
    currentProject.lists.forEach(list => {
      this.renderList(list);
    });
  }

  clearListsDivs() {
    document.querySelectorAll(".list-item").forEach(listDiv => listDiv.parentElement.remove())
  }

  initEventListeners() {
    this.addListDiv.addEventListener("click", () => {
      const currentProject = projectsManager.getProjectInstanceById(projects, this.projectDiv.dataset.projectId);
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