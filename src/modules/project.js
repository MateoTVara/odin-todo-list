// project.js

const projectDiv = document.querySelector(".project");
const addListDiv = document.querySelector(".add-list");

export const ProjectManager = (function () {
  const attachAddListListener = () => {
    addListDiv.addEventListener("click", () => {
      const list = new List();
      const el = list.getElement();
      console.log("Add list clicked");
      projectDiv.insertBefore(el, addListDiv);
      const input = el.querySelector("input");
      input.focus();
    });
  }

  return {
    attachAddListListener,
  }
})();

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
      console.log(this.title);
    })
    title.focus();

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
    })

    div.append(title, addCardDiv);
    
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
    });

    slotDiv.appendChild(description);
    return slotDiv;
  }
}