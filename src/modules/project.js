// project.js

import { ProjectsManager, ProjectManager } from "../index";

class List {
  constructor(title="New List") {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = [];
  }

  getElement() {
    const slotDiv = document.createElement("div");
    slotDiv.dataset.swapySlot = crypto.randomUUID();

    const div = document.createElement("div");
    div.classList.add("list-item");
    div.setAttribute("title", this.title);
    div.dataset.listId = this.id;
    div.dataset.swapyItem = this.id;

    const header = document.createElement("div");
    header.classList.add("list-header");

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("delete-btn");
    deleteDiv.textContent = "X";
    deleteDiv.addEventListener("click", () => {
      const element = document.querySelector(`[data-list-id="${this.id}"]`).parentElement;
      element.remove();

      const projectId = ProjectManager.getProjectDiv().dataset.projectId;
      const projectData = ProjectsManager.getCurrentProjectInstance(projectId);
      projectData.lists.splice(projectData.lists.findIndex(list => list.id === this.id), 1);
      ProjectsManager.update(projectData);
    });

    const title = document.createElement("input");
    title.classList.add("title")
    title.value = this.title;
    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        title.blur();
      }
    })
    title.addEventListener("blur", () => {
      if (!(title.value.trim())) {
        title.value = this.title;
      } else {
        this.title = title.value;
      }
      console.log(`List ${this.id} title updated to: ${this.title}`);
      title.scrollLeft = 0;
      div.setAttribute("title", this.title);
      const projectId = ProjectManager.getProjectDiv().dataset.projectId;0
      const projectData = ProjectsManager.getCurrentProjectInstance(projectId);
      projectData.lists.forEach(list => {if (list.id === this.id) list.title = this.title})
      ProjectsManager.update(projectData);
    })
    title.focus();

    header.append(title, deleteDiv);

    const addCardDiv = document.createElement("div");
    addCardDiv.classList.add("add-card");
    addCardDiv.textContent = "+ add card";
    addCardDiv.addEventListener("click", (e) => {
      e.preventDefault();
      const card = new Card();
      this.cards.push(card);
      const el = card.getElement();
      div.insertBefore(el, addCardDiv);
      const input = el.querySelector("input");
      input.focus();
      console.log(this.cards);
    })

    div.append(header, addCardDiv);
    
    slotDiv.appendChild(div);

    return slotDiv;
  }
}

class Card {
  constructor(description="New Task") {
    this.id = crypto.randomUUID();
    this.description = description;
  }

  getElement() {
    const slotDiv = document.createElement("div");
    slotDiv.dataset.swapySlot = this.id;

    const description = document.createElement("input");
    description.classList.add("card-item");
    description.dataset.cardId = this.id;
    description.dataset.swapyItem = this.id;
    description.value = this.description;
    description.addEventListener("blur", () => {
      description.setAttribute("disabled", "");
      if (!(description.value.trim())) {
        description.value = this.description;
      } else {
        this.description = description.value;
      }
      console.log(this.description);
      description.scrollLeft = 0;
    });
    description.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        description.blur();
      }
    })

    slotDiv.appendChild(description);
    return slotDiv;
  }
}

export { List, Card };