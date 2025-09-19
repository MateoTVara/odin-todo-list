// src/models/Project.js

import { Helper } from "../modules/helper";
import { persistenceManager } from "../modules/persistence";
import { projectManager, navigationManager, dragDropManager } from "../managers";

export class Project {
  constructor(name) {
    this.name = name;
    this.color = Helper.randomColor();
    this.id = crypto.randomUUID();
    this.lists = [];
  }

  #handleClick() {
    if (dragDropManager.isDragging) return;
    console.log(`Project: ${this.name}`);
    navigationManager.toggleProjectsDisplay();
    navigationManager.toggleProjectDisplay();
    navigationManager.setProjectDivDatasetProjectId(this.id);
    navigationManager.projectDiv.scrollLeft = 0;
    projectManager.renderAllProjectLists()
  }

  #handleDelete() {
    persistenceManager.removeProject(this);
    const element = document.querySelector(`[data-project-id="${this.id}"]`).parentElement;
    element.remove();
  }

  getElement () {
    const handle = Helper.createElement("div", {
      classes: ["handle"], 
      dataAttrs: {swapyHandle: ""}
    })

    const deleteBtn = Helper.createElement("div", {
      text: "X", 
      classes: ["delete-btn"],
      listeners: {
        click: (e) => {
        e.stopPropagation();
        this.#handleDelete();
      }}
    })

    const colorContainer = Helper.createElement("div", {
      styles: {backgroundColor: this.color}, 
      children: [handle, deleteBtn]
    })

    const title = Helper.createElement("h2", {text: this.name})

    const projectContainer = Helper.createElement("div", {
      classes: ["project-item"],
      attrs: {title: this.name},
      dataAttrs: {projectId: this.id, swapyItem: this.id},
      listeners: {click: () => this.#handleClick()},
      children: [colorContainer, title]
    })
    
    const projectElement = Helper.createElement("div", {
      dataAttrs: {swapySlot: this.id}, 
      children: [projectContainer]
    });

    return projectElement;
  }
}