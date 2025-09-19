// src/managers/DialogManager.js

import { persistenceManager } from '../modules/persistence';
import { dragDropManager, domManager } from '../managers';
import { Project } from '../models';

class DialogManager {
  constructor() {
    this.initEventListeners();
  }

  toggleDialogDisplay() {
    domManager.addProjectDialog.classList.toggle("none-display");
  }

  renderNewProject() {
    const project = new Project(domManager.addProjectFormInput.value);
    persistenceManager.addProject(project);
    domManager.projectsDiv.insertBefore(project.getElement(), domManager.addProjectDiv);
    dragDropManager.update();
    this.toggleDialogDisplay();
    domManager.addProjectFormInput.value = "";
  }

  initEventListeners() {
    domManager.addProjectDialog.addEventListener("click", (e) => {
      if (e.target === domManager.addProjectDialog) {
        this.toggleDialogDisplay();
      }
    });

    domManager.addProjectFormButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (domManager.addProjectFormInput.value !== "") {this.renderNewProject();}
    })
  }
}

export const dialogManager = new DialogManager();