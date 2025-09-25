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
        [...domManager.cardModalDiv.children].forEach(child => {
          if (child !== domManager.cardMenu) child.remove();
        });
      }
    });
  }

  #createModalElements(card) {
    const h3Description = Helper.createElement("h3", {text: card.description});
    
    domManager.cardMenu.insertAdjacentElement("afterend", Helper.createElement("p", {text: `prueba-id: ${card.id}`}));
    domManager.cardMenu.insertAdjacentElement("afterend", h3Description);
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