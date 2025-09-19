// src/managers/NavigationManager.js

import { projectManager } from "../managers";

class NavigationManager {
  constructor() {
    this.projectsShortcut = document.querySelector(".header > a");
    this.projectsDiv = document.querySelector(".projects");
    this.projectDiv = document.querySelector(".project");

    this.initEventListeners();
  }

  toggleProjectsDisplay() {
    this.projectsDiv.classList.toggle("none-display");
  }

  toggleProjectDisplay() {
    this.projectDiv.classList.toggle("none-display");
  }

  setProjectDivDatasetProjectId(projectId) {
    this.projectDiv.dataset.projectId = projectId;
  }

  removeProjectDivDatasetProjectId() {
    delete this.projectDiv.dataset.projectId;
  }

  initEventListeners() {
    this.projectsShortcut.addEventListener("click", (e) => {
      e.preventDefault();
      this.projectDiv.classList.add("none-display");
      this.projectsDiv.classList.remove("none-display");
      projectManager.clearListsDivs();
      this.removeProjectDivDatasetProjectId();
    });
  }
}

export const navigationManager = new NavigationManager();