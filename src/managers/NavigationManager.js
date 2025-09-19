// src/managers/NavigationManager.js

import { projectManager, domManager } from "../managers";

class NavigationManager {
  constructor() {
    this.initEventListeners();
  }

  toggleProjectsDisplay() {
    domManager.projectsDiv.classList.toggle("none-display");
  }

  toggleProjectDisplay() {
    domManager.projectDiv.classList.toggle("none-display");
  }

  setProjectDivDatasetProjectId(projectId) {
    domManager.projectDiv.dataset.projectId = projectId;
  }

  removeProjectDivDatasetProjectId() {
    delete domManager.projectDiv.dataset.projectId;
  }

  initEventListeners() {
    domManager.projectsShortcut.addEventListener("click", (e) => {
      e.preventDefault();
      domManager.projectDiv.classList.add("none-display");
      domManager.projectsDiv.classList.remove("none-display");
      projectManager.clearListsDivs();
      this.removeProjectDivDatasetProjectId();
    });
  }
}

export const navigationManager = new NavigationManager();