// CardModalManager.js

import { format, max, parse, parseISO } from "date-fns";
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

    domManager.addCheckListButton.addEventListener("click", () => {
      this.#renderCheckList();
    })
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





  #renderCheckList(){
    const checkListTitle = Helper.createElement("input", {
      value: "New Checklist",
      classes: ["checklist-title"],
      attrs: {type: "text"},
      listeners: {
        blur: () => {
          if (checkListTitle.value.trim() === "") {checkListTitle.value = "New Checklist"}
        }
      }
    });
    
    const progressBar = Helper.createElement("progress", {
      attrs: {
        max: "1",
        value: "0"
      },
      styles: {display: "none"}
    });

    const ul = Helper.createElement("ul", {});
    const fieldset = Helper.createElement("fieldset", {
      classes: ["checkitems-field"],
      children: [ul]
    });

    const addCheckItemDiv = Helper.createElement("button", {
      text: "Add Item",
      classes: ["add-check-item"],
      listeners: {
        click: () => {
          const itemLabel = Helper.createElement("input", {
            value: "New Item",
            attrs: {type: "text"},
          });
          const itemCheckBox = Helper.createElement("input", {
            attrs: {
              type: "checkbox",
              id: "new-item"
            },
            listeners: {change: () => {this.#onItemCheckBoxChange(ul, progressBar, itemCheckBox, itemLabel)}}
          });
          const itemContainer = Helper.createElement("li", {
            children: [itemCheckBox, itemLabel]
          });
          ul.appendChild(itemContainer);
          this.#updateProgressBar(ul, progressBar);
          itemLabel.focus();
        }
      }
    });

    const container = Helper.createElement("div", {
      classes: ["checklist-container"],
      children: [checkListTitle, progressBar, fieldset, addCheckItemDiv],
    });

    domManager.cardDetails.appendChild(container);

    checkListTitle.focus();
  }

  #markCheckItem(itemCheckBox, itemLabel){
    if (itemCheckBox.checked) {
      itemLabel.style.textDecoration = "line-through";
    } else {
      itemLabel.style.textDecoration = "none";
    }
  }

  #updateProgressBar(ul, progressBar) {
    let max = 0;
    let value = 0;
    const inputCheckboxes = [...ul.querySelectorAll("input[type='checkbox']")];
    inputCheckboxes.forEach(checkBox => {
      max += 1;
      if (checkBox.checked) {value += 1};
      if (inputCheckboxes.length === 0) {progressBar.style.display = "none"}
      else {progressBar.style.display = "block"};
    })
    progressBar.setAttribute("max", max);
    progressBar.setAttribute("value", value);
  }

  #onItemCheckBoxChange(ul, progressBar, itemCheckBox, itemLabel) {
    this.#updateProgressBar(ul, progressBar);
    this.#markCheckItem(itemCheckBox, itemLabel);
  }
}

export const cardModalManager = new CardModalManager();