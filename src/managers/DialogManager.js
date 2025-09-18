// src/managers/DialogManager.js

import { Project } from '../models';
import { persistenceManager } from '../modules/persistence';
import { ProjectsManager, SwapyManager } from '../index';

class DialogManager {
  constructor() {
    this.addProjectDialog = document.querySelector(".add-project-dialog");
    this.addProjectFormButton = document.querySelector(".add-project-dialog form button");
    this.addProjectFormInput = document.querySelector(".add-project-dialog form input");
  }

  toggleDialogDisplay() {
    this.addProjectDialog.classList.toggle("none-display");
  }

  renderProject() {
    const project = new Project(this.addProjectFormInput.value);
    persistenceManager.addProject(project);
    ProjectsManager.getProjectsDiv().insertBefore(project.getElement(), ProjectsManager.getAddProjectDiv());
    SwapyManager.swapy.update();
    this.toggleDialogDisplay();
    this.addProjectFormInput.value = "";
  }

  getProjectNameInput() {
    return this.addProjectFormInput;
  }

  initEventListeners() {
    this.addProjectDialog.addEventListener("click", (e) => {
      if (e.target === this.addProjectDialog) {
        this.toggleDialogDisplay();
      }
    });

    this.addProjectFormButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.addProjectFormInput.value !== "") {this.renderProject();}
    })
  }
}

export const dialogManager = new DialogManager();