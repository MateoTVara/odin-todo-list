// CardModalManager.js

import { domManager, projectsManager } from "../managers";
import { Helper } from "../modules/helper";
import { projects } from "../modules/persistence";

class CardModalManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    domManager.cardModal.addEventListener("click", (e) => {
      if (e.target === domManager.cardModal){
        domManager.cardModal.classList.add("none-display");
        domManager.cardDetails.replaceChildren();
      }
    });
  }

  #createModalElements(card) {
    const h3Description = Helper.createElement("h3", {text: card.description});
    const pTestId = Helper.createElement("p", {text: `test-id: ${card.id}`});

    const saveButton = Helper.createElement("button", {text: "Save"});
    const deleteButton = Helper.createElement("button", {text: "Delete"});

    const buttonsDiv = Helper.createElement("div", {
      classes: ["buttons"],
      children: [saveButton, deleteButton]
    });
    
    domManager.cardDetails.append(h3Description, pTestId, buttonsDiv);
  }

  populateModal(cardId) {
    const projectId = domManager.projectDiv.dataset.projectId;
    const projectIntance = projectsManager.getProjectInstanceById(projects, projectId);

    projectIntance.lists.forEach(list =>{
      list.cards.forEach(card => {
        if(card.id === cardId) {this.#createModalElements(card)};
      })
    })
  }
}

export const cardModalManager = new CardModalManager();