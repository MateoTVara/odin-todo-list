// src/managers/DOMManager.js

class DOMManager {
  constructor() {
    this.reinstanceElements();
  }

  reinstanceElements() {
    this.projectsShortcut = document.querySelector(".header > a");

    this.projectsDiv = document.querySelector(".projects");
    this.addProjectDiv = document.querySelector(".add-project");

    this.projectDiv = document.querySelector(".project");
    this.addListDiv = document.querySelector(".add-list");

    this.addProjectDialog = document.querySelector(".add-project-dialog");
    this.addProjectFormButton = document.querySelector(".add-project-dialog form button");
    this.addProjectFormInput = document.querySelector(".add-project-dialog form input");

    this.cardModal = document.querySelector(".card-modal");
    this.cardModalDiv = document.querySelector(".card-modal > div")
  }
}

export const domManager = new DOMManager();