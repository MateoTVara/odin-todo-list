// CardModalManager.js

import { format, parse, parseISO } from "date-fns";
import { domManager, projectsManager } from "../managers";
import { Helper } from "../modules/helper";
import { persistenceManager, projects } from "../modules/persistence";

class CardModalManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    domManager.cardModal.addEventListener("click", (e) => {
      if (e.target === domManager.cardModal){this.#closeModal()};
    });

    domManager.cancelButton.addEventListener("click", () => this.#closeModal());

    domManager.inputDueDate.addEventListener("input", () => {
      const dueDate = parseISO(domManager.inputDueDate.value);
      domManager.h3DueDate.textContent = ` - ${format(dueDate, "PPPP")}`;
    });
  }

  #closeModal(){ 
    domManager.cardModal.classList.add("none-display");
    domManager.inputDueDate.value = "";
    domManager.h3DueDate.textContent = "";
    [...domManager.cardDetails.children].forEach(
      el => { if (el !== domManager.cardDetailsHeader) el.remove() }
    )
  }

  #reconstructCardDetails(card) {
    domManager.h3Description.textContent = card.description;
    if(card.dueDate) {
      domManager.h3DueDate.textContent = ` - ${format(card.dueDate, "PPPP")}`;
      domManager.inputDueDate.value = format(card.dueDate, "yyyy-MM-dd");
    } else {
      domManager.h3DueDate.textContent = "";
    }
  }

  #createModalElements(card, project) {
    const pTestId = Helper.createElement("p", {text: `test-id: ${card.id}`});

    domManager.cardDetailsHeader.insertAdjacentElement("afterend", pTestId);
    this.#reconstructCardDetails(card);

    domManager.saveButton.addEventListener("click", () => {
      card.dueDate = parseISO(domManager.inputDueDate.value);
      persistenceManager.updateProjects(project);
    })
  }

  populateModal(cardId) {
    const projectId = domManager.projectDiv.dataset.projectId;
    const projectIntance = projectsManager.getProjectInstanceById(projects, projectId);

    projectIntance.lists.forEach(list =>{
      list.cards.forEach(card => {
        if(card.id === cardId) {this.#createModalElements(card, projectIntance)};
      })
    })
  }
}

export const cardModalManager = new CardModalManager();