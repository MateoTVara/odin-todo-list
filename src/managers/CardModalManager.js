// CardModalManager.js

import { domManager } from "../managers";

class CardModalManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    domManager.cardModal.addEventListener("click", (e) => {
      if (e.target === domManager.cardModal){
        domManager.cardModal.classList.add("none-display");
        domManager.cardModalDiv.replaceChildren();
      }
    });
  }
}

export const cardModalManager = new CardModalManager();