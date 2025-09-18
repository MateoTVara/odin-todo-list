// project.js

import { Helper } from "./helper";
import { persistenceManager, projects } from "./persistence";
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
          const projectId = ProjectManager.getProjectDiv().dataset.projectId;
          const projectData = ProjectsManager.getProjectInstanceById(projects, projectId);
          projectData.lists.forEach(list => {if (list.id === this.id) list.title = this.title});
          persistenceManager.updateProjects(projectData);
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
          const projectData = ProjectsManager.getProjectInstanceById(projects, projectId);
          projectData.lists.splice(projectData.lists.findIndex(list => list.id === this.id), 1);
          persistenceManager.updateProjects(projectData);
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
          const projectDiv = document.querySelector(".project");
          const currentProject = ProjectsManager.getProjectInstanceById(projects, projectDiv.dataset.projectId);
          const card = new Card();
          const thisListId = this.id;
          const thisList = currentProject.lists.find(list => list.id === thisListId);
          thisList.cards.push(card);
          persistenceManager.updateProjects(currentProject);

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

          const projectId = ProjectsManager.getProjectDiv().dataset.projectId;
          const projectData = ProjectsManager.getProjectInstanceById(projects, projectId);
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

export { List, Card };