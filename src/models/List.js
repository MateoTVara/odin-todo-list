// src/models/List.js

import { Helper } from "../modules/helper";
import { persistenceManager, projects } from "../modules/persistence";
import { projectsManager, domManager } from "../managers";
import { Card } from "./Card";

export class List {
  constructor(title = "New List") {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = [];

    this.element = null;
    this.titleInput = null;
    this.listContainer = null;
    this.addCardDiv = null;
  }

  getElement() {
    this.titleInput = Helper.createElement("input", {
      value: this.title,
      classes: ["title"],
      listeners: {
        keydown: (e) => this.#handleTitleEnterKeydown(e),
        blur: () => this.#handleTitleBlur()
      }
    });

    const deleteBtn = Helper.createElement("div", {
      text: "X",
      classes: ["delete-btn"],
      listeners: { click: () => this.#handleDelete() }
    });

    const header = Helper.createElement("div", {
      classes: ["list-header"],
      children: [this.titleInput, deleteBtn]
    });

    this.addCardDiv = Helper.createElement("div", {
      text: "+ add card",
      classes: ["add-card"],
      listeners: { click: (e) => this.#handleAddCardClick(e) }
    });

    this.listContainer = Helper.createElement("div", {
      classes: ["list-item"],
      attrs: { title: this.title },
      dataAttrs: {
        listId: this.id,
        swapyItem: this.id
      },
      children: [header, this.addCardDiv]
    });

    this.element = Helper.createElement("div", {
      dataAttrs: { swapySlot: this.id },
      children: [this.listContainer]
    });

    return this.element;
  }

  #handleTitleEnterKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  }

  #handleTitleBlur() {
    if (!this.titleInput.value.trim()) {
      this.titleInput.value = this.title;
    } else {
      this.title = this.titleInput.value;
    }

    this.titleInput.scrollLeft = 0;
    this.listContainer.setAttribute("title", this.title);

    const projectId = domManager.projectDiv.dataset.projectId;
    const projectInstance = projectsManager.getProjectInstanceById(projects, projectId);

    projectInstance.lists.forEach(list => {
      if (list.id === this.id) list.title = this.title;
    });

    persistenceManager.updateProjects(projectInstance);
  }

  #handleDelete() {
    this.element.remove();

    const projectId = domManager.projectDiv.dataset.projectId;
    const projectInstance = projectsManager.getProjectInstanceById(projects, projectId);

    projectInstance.lists.splice(
      projectInstance.lists.findIndex(list => list.id === this.id),
      1
    );

    persistenceManager.updateProjects(projectInstance);
  }

  #handleAddCardClick(e) {
    e.preventDefault();

    const currentProject = projectsManager.getProjectInstanceById(
      projects,
      domManager.projectDiv.dataset.projectId
    );

    const card = new Card();
    const currentList = currentProject.lists.find(list => list.id === this.id);
    currentList.cards.push(card);

    persistenceManager.updateProjects(currentProject);

    const cardElement = card.getElement();
    this.listContainer.insertBefore(cardElement, this.addCardDiv);

    const input = cardElement.querySelector("input");
    input.focus();
  }
}
