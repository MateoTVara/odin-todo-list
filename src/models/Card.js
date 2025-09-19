// src/models/Card.js

import { Helper } from "../modules/helper";
import { persistenceManager, projects } from "../modules/persistence";
import { navigationManager, projectsManager } from "../managers";

export class Card {
  constructor(description="New Task", locked = false) {
    this.id = crypto.randomUUID();
    this.description = description;
    this.locked = locked;
  }

  getElement() {
    const description = Helper.createElement("input", {
      value: this.description, 
      classes: ["card-item"], 
      dataAttrs: {
        cardId: this.id, 
        swapyItem: this.id
      },
      listeners: {
        blur: () => {
          description.setAttribute("disabled", "");
          if (!(description.value.trim())) {
            description.value = this.description;
          } else {
            this.description = description.value;
          }
          console.log(this.description);
          description.scrollLeft = 0;

          this.locked = true;

          const projectId = navigationManager.projectDiv.dataset.projectId;
          const projectData = projectsManager.getProjectInstanceById(projects, projectId);
          const listItem = cardElement.closest(".list-item");
          const listId = listItem.dataset.listId;
          const listOfThisCard = projectData.lists.find(list => list.id === listId)
          projectData.lists.forEach(list => {
            if (list.id === listOfThisCard.id){
              list.cards.forEach(card => {
                if(card.id === this.id) {
                card.description = this.description;
                card.locked = this.locked
                }
              })
            }
          })
          persistenceManager.updateProjects(projectData);
        },
        keydown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            description.blur();
          }
        }
      }
    })

    if (this.locked) description.setAttribute("disabled", "");

    const cardElement = Helper.createElement("div", {
      dataAttrs: {swapySlot: this.id}, 
      children: [description]
    })
    return cardElement;
  }
}