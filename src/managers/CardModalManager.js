// src/managers/CardModalManager.js

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
      this.#renderCheckList({});
      domManager.cardModalDiv.scrollTop = domManager.cardModalDiv.scrollHeight;
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

    if (card.dueDate) {
      let dateObj = typeof card.dueDate === "string" ? parseISO(card.dueDate) : card.dueDate;
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

    if(Object.keys(card.checkLists).length !== 0) {
      Object.keys(card.checkLists).forEach(checkListId => {
        const checkList = card.checkLists[checkListId];
        this.#renderCheckList({checkListTitleText: checkList.title}, checkList);
      })
    }
  }

  #createModalElements(card, project) {
    const pTestId = Helper.createElement("p", {text: `test-id: ${card.id}`});

    domManager.cardDetailsHeader.insertAdjacentElement("afterend", pTestId);
    this.#reconstructCardDetails(card);

    domManager.saveButton.addEventListener("click", () => {
      card.dueDate = parseISO(domManager.inputDueDate.value);

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
      })
      card.checkLists = checkLists;

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





  #renderCheckList({checkListTitleText = "New Checklist", itemLabelText = "New Item"}, checkList = null){
    const checkListTitle = Helper.createElement("legend", {
      text: checkListTitleText,
      classes: ["checklist-title"],
      attrs: {contenteditable: "true"},
      listeners: {
        blur: () => {Helper.onBlurDefault(checkListTitle, checkListTitleText)}
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