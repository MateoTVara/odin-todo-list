// src/models/Card.js

import { Helper } from "../modules/helper";
import { persistenceManager, projects } from "../modules/persistence";
import { projectsManager, domManager, cardModalManager } from "../managers";

export class Card {
  constructor(description = "New Task", locked = false) {
    this.id = crypto.randomUUID();
    this.description = description;
    this.locked = locked;
    this.dueDate = null;
    this.notes = "";
    this.checkLists = {};
    this.priority = "";

    this.cardElement = null;
    this.descriptionInput = null;
  }

  getElement() {
    this.descriptionInput = Helper.createElement("input", {
      value: this.description,
      classes: ["card-item"],
      dataAttrs: {
        cardId: this.id,
        swapyItem: this.id
      },
      listeners: {
        blur: () => this.#handleBlur(),
        keydown: (e) => this.#handleKeyDownEnter(e)
      }
    });

    if (this.locked) this.descriptionInput.setAttribute("disabled", "");

    this.cardElement = Helper.createElement("div", {
      dataAttrs: { swapySlot: this.id },
      listeners: {click: () => this.#handleClick()},
      children: [this.descriptionInput]
    });

    return this.cardElement;
  }

  #handleClick() {
    domManager.cardModal.classList.remove("none-display");

    cardModalManager.currentCard = this;

    cardModalManager.reconstructCardDetails();

    domManager.cardModalDiv.scrollTop = 0;
  }

  #handleBlur() {
    this.descriptionInput.setAttribute("disabled", "");

    if (!this.descriptionInput.value.trim()) {
      this.descriptionInput.value = this.description;
    } else {
      this.description = this.descriptionInput.value;
    }

    this.descriptionInput.scrollLeft = 0;
    this.locked = true;

    const projectId = domManager.projectDiv.dataset.projectId;
    const projectInstance = projectsManager.getProjectInstanceById(projects, projectId);

    const listContainer = this.cardElement.closest(".list-item");
    const listId = listContainer.dataset.listId;

    const listInstance = projectInstance.lists.find(list => list.id === listId);

    listInstance.cards.forEach(card => {
      if (card.id === this.id) {
        card.description = this.description;
        card.locked = this.locked;
      }
    });

    persistenceManager.updateProjects(projectInstance);
  }

  #handleKeyDownEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.descriptionInput.blur();
    }
  }
}
