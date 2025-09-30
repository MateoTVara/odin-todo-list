// src/managers/CardModalManager.js

import { format, max, parse, parseISO } from "date-fns";
import { domManager, projectsManager } from "../managers";
import { Helper } from "../modules/helper";
import { persistenceManager, projects } from "../modules/persistence";

class CardModalManager {
  constructor() {
    this.currentCard = null;
    this.initEventListeners();
  }

  initEventListeners() {
    domManager.cardModal.addEventListener ("click", (e) => {
      if (e.target === domManager.cardModal){this.#closeModal()};
    });

    domManager.deleteButton.addEventListener("click", () => this.#deleteCard());

    domManager.inputDueDate.addEventListener("input", () => {
      const dueDate = parseISO(domManager.inputDueDate.value);
      domManager.h3DueDate.textContent = ` - ${format(dueDate, "PPPP")}`;
    });

    domManager.addCheckListButton.addEventListener("click", () => {
      this.#renderCheckList({});
      domManager.cardModalDiv.scrollTop = domManager.cardModalDiv.scrollHeight;
    })

    domManager.saveButton.addEventListener("click", () => {
      this.#saveChanges();
    });

    domManager.h3Description.addEventListener("blur", () => {
      if (domManager.h3Description.textContent.trim() === ""){
        domManager.h3Description.textContent = this.currentCard.description;
      }
    });

    domManager.h3Description.addEventListener("keydown", (e) => {if (e.key === "Enter") {e.preventDefault()}});
  }

  #saveChanges(){
    this.currentCard.description = domManager.h3Description.textContent;
    const descriptionInput = document.querySelector(`.card-item[data-card-id='${this.currentCard.id}']`);
    descriptionInput.value = this.currentCard.description;

    this.currentCard.dueDate = parseISO(domManager.inputDueDate.value);

    this.currentCard.notes = domManager.cardDetailsNotesTextArea.value;

    const checkLists = {};
    domManager.cardDetails.querySelectorAll(".checkitems-field").forEach(fieldset => {
      const checkListId = crypto.randomUUID();
      const checkListTitle = fieldset.querySelector(".checklist-title").textContent;
      const checkListItems = {};
      fieldset.querySelectorAll("li").forEach(li => {
        const itemId = crypto.randomUUID();
        const itemText = li.querySelector("input[type='text']").value;
        const itemChecked = li.querySelector("input[type='checkbox']").checked;
        checkListItems[itemId] = {
          text: itemText,
          checked: itemChecked
        }
      })
      checkLists[checkListId] = {
        title: checkListTitle,
        items: checkListItems
      }
    });
    this.currentCard.checkLists = checkLists;

    this.currentCard.priority = domManager.selectPriority.value;

    const projectId = domManager.projectDiv.dataset.projectId;
    const currentProject = projects[projectId];
    if (currentProject) {
      currentProject.lists.forEach(list => {
        list.cards.forEach(card => {
          if (card.id === this.currentCard.id) {
            card.description = this.currentCard.description;
            card.dueDate = this.currentCard.dueDate;
            card.notes = this.currentCard.notes;
            card.checkLists = this.currentCard.checkLists;
            card.priority = this.currentCard.priority;
          }
        });
      });
      persistenceManager.updateProjects(currentProject);
    };

    this.#closeModal();
  }

  #deleteCard() {
    if(confirm("Are you sure you want to delete this card?")){
      this.currentCard.cardElement.remove();

      const projectId = domManager.projectDiv.dataset.projectId;
      const projectInstance = projectsManager.getProjectInstanceById(projects, projectId);

      projectInstance.lists.forEach(list => {
        const cardIndex = list.cards.findIndex(card => card.id === this.currentCard.id);
        list.cards.splice(cardIndex, 1);
      });

      persistenceManager.updateProjects(projectInstance);

      this.#closeModal();
    } else {

    }
  }

  #closeModal(){ 
    domManager.cardModal.classList.add("none-display");
    domManager.inputDueDate.value = "";
    domManager.h3DueDate.textContent = "";
    [...domManager.cardDetails.children].forEach(el => {
      if (el !== domManager.cardDetailsHeader && el !== domManager.cardDetailsNotes) {
        el.remove();
      }
    });
    this.currentCard = null;
  }

  reconstructCardDetails() {
    domManager.h3Description.textContent = this.currentCard.description;

    if (this.currentCard.dueDate) {
      let dateObj = typeof this.currentCard.dueDate === "string" ? parseISO(this.currentCard.dueDate) : this.currentCard.dueDate;
      if (!isNaN(dateObj)) {
        domManager.h3DueDate.textContent = ` - ${format(dateObj, "PPPP")}`;
        domManager.inputDueDate.value = format(dateObj, "yyyy-MM-dd");
      } else {
        domManager.h3DueDate.textContent = "";
        domManager.inputDueDate.value = "";
      }
    } else {
      domManager.h3DueDate.textContent = "";
      domManager.inputDueDate.value = "";
    }

    if(this.currentCard.notes) {
      domManager.cardDetailsNotesTextArea.value = this.currentCard.notes;
    } else {
      domManager.cardDetailsNotesTextArea.value = "";
    }

    if(Object.keys(this.currentCard.checkLists).length !== 0) {
      Object.keys(this.currentCard.checkLists).forEach(checkListId => {
        const checkList = this.currentCard.checkLists[checkListId];
        this.#renderCheckList({checkListTitleText: checkList.title}, checkList);
      })
    }

    if (this.currentCard.priority) {
      domManager.selectPriority.value = this.currentCard.priority;
    } else {
      domManager.selectPriority.value = "";
    }
  }





  #renderCheckList({checkListTitleText = "New Checklist", itemLabelText = "New Item"}, checkList = null){
    const checkListTitle = Helper.createElement("legend", {
      text: checkListTitleText,
      classes: ["checklist-title"],
      attrs: {contenteditable: "true"},
      listeners: {
        blur: () => {Helper.onBlurDefault(checkListTitle, checkListTitleText)},
        keydown: (e) => {if(e.key === "Enter") {e.preventDefault()}}
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
      children: [checkListTitle, progressBar, ul]
    });

    const addCheckItemDiv = Helper.createElement("button", {
      text: "Add Item",
      classes: ["add-check-item"],
      listeners: {click: () => {this.#renderCheckItem(ul, progressBar, itemLabelText)}}
    });

    const container = Helper.createElement("div", {
      classes: ["checklist-container"],
      children: [fieldset, addCheckItemDiv],
    });

    domManager.cardDetails.appendChild(container);
    
    if (checkList) {
      Object.values(checkList.items).forEach(item => {
        this.#renderCheckItem(ul, progressBar, item.text, item.checked, false);
      })
    }
  }

  #renderCheckItem(ul, progressBar, itemLabelText, checked = false, focus = true){
    const itemLabel = Helper.createElement("input", {
      value: itemLabelText,
      attrs: {type: "text"},
      listeners: {blur: () => Helper.onBlurDefault(itemLabel, itemLabelText)}
    });
    const itemCheckBox = Helper.createElement("input", {
      classes: ["check-box-item"],
      attrs: {type: "checkbox"},
      listeners: {change: () => {this.#checkItemCheckBoxChecked(ul, progressBar, itemCheckBox, itemLabel)}}
    });
    const itemContainer = Helper.createElement("li", {
      children: [itemCheckBox, itemLabel]
    });
    ul.appendChild(itemContainer);
    this.#updateProgressBar(ul, progressBar);

    if(focus) {itemLabel.focus()};

    if(checked) {itemCheckBox.setAttribute("checked", "")};
    this.#checkItemCheckBoxChecked(ul, progressBar, itemCheckBox, itemLabel);
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

  #checkItemCheckBoxChecked(ul, progressBar, itemCheckBox, itemLabel) {
    this.#updateProgressBar(ul, progressBar);
    this.#markCheckItem(itemCheckBox, itemLabel);
    console.log(itemCheckBox.checked);
  }
}

export const cardModalManager = new CardModalManager();