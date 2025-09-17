// project.js

import { Helper } from "./helper";
import { ProjectsManager, ProjectManager } from "../index";

class List {
  constructor(title="New List") {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = [];
  }

  getElement() {
    const title = Helper.createElement("input", {
      value: this.title,
      classes: ["title"],
      listeners: {
        keydown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            title.blur();
          }
        },
        blur: () => {
          if (!(title.value.trim())) {
            title.value = this.title;
          } else {
            this.title = title.value;
          }
          console.log(`List ${this.id} title updated to: ${this.title}`);
          title.scrollLeft = 0;
          listElement.setAttribute("title", this.title);
          const projectId = ProjectManager.getProjectDiv().dataset.projectId;0
          const projectData = ProjectsManager.getCurrentProjectInstance(projectId);
          projectData.lists.forEach(list => {if (list.id === this.id) list.title = this.title})
          ProjectsManager.update(projectData);
        }
      }
    });

    const deleteBtn = Helper.createElement("div", {
      text: "X",
      classes: ["delete-btn"],
      listeners: {
        click: () => {
          const element = document.querySelector(`[data-list-id="${this.id}"]`).parentElement;
          element.remove();

          const projectId = ProjectManager.getProjectDiv().dataset.projectId;
          const projectData = ProjectsManager.getCurrentProjectInstance(projectId);
          projectData.lists.splice(projectData.lists.findIndex(list => list.id === this.id), 1);
          ProjectsManager.update(projectData);
        }
      }
    });

    const header = Helper.createElement("div", {
      classes: ["list-header"],
      children: [title, deleteBtn]
    });

    const addCardDiv = Helper.createElement("div", {
      text: "+ add card",
      classes: ["add-card"],
      listeners: {
        click: (e) => {
          e.preventDefault();
          const card = new Card();
          this.cards.push(card);
          const el = card.getElement();
          listContainer.insertBefore(el, addCardDiv);
          const input = el.querySelector("input");
          input.focus();
          console.log(this.cards);
        }
      }
    });

    const listContainer = Helper.createElement("div", {
      classes: ["list-item"], 
      attrs: {title: this.title},
      dataAttrs: {
        listId: this.id,
        swapyItem: this.id
      },
      children: [header, addCardDiv]
    });
    
    const listElement = Helper.createElement("div", {
      dataAttrs: {swapySlot: this.id}, 
      children: [listContainer]
    });
    
    return listElement;
  }
}

class Card {
  constructor(description="New Task") {
    this.id = crypto.randomUUID();
    this.description = description;
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
        },
        keydown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            description.blur();
          }
        }
      }
    })

    const cardElement = Helper.createElement("div", {
      dataAttrs: {swapySlot: this.id}, 
      children: [description]
    })
    return cardElement;
  }
}

export { List, Card };