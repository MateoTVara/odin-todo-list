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
    this.cardMenu = document.querySelector(".card-menu");
    this.cardDetails = document.querySelector(".card-details");
    this.inputDueDate = document.querySelector(".card-menu #date");
    this.saveButton = document.querySelector(".buttons button:first-child");
    this.cancelButton = document.querySelector(".buttons button:last-child");
    this.cardDetailsHeader = document.querySelector(".card-details-header");
    this.h3Description = this.cardDetailsHeader.querySelector("h3:first-child");
    this.h3DueDate = this.cardDetailsHeader.querySelector("h3:last-child");
  }
}

export const domManager = new DOMManager();