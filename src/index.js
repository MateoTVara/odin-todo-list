// index.js

import "./styles.css";

class Project {
  constructor(name) {
    this.name = name;
    this.color = this.#generateRandomColor();
  }

  #generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`
  }

  #handleClick() {
    console.log(`Project: ${this.name}`);
  }

  getElement () {
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.setAttribute("title", this.name)

    div.addEventListener("click", () => this.#handleClick());

    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = this.color;

    const h2 = document.createElement("h2");
    h2.textContent = this.name;

    div.append(colorDiv, h2);

    return div;
  }
}

const DialogManager = (function() {
  const addProjectDialog = document.querySelector(".add-project-dialog");
  const addProjectFormButton = document.querySelector(".add-project-dialog form button");
  const addProjectFormInput = document.querySelector(".add-project-dialog form input");

  const toggleDialogDisplay = () => {
    if (addProjectDialog.style.display !== "flex") {
      addProjectDialog.style.display = "flex"
    } else {
      addProjectDialog.style.display = "none";
    }
  }

  addProjectDialog.addEventListener("click", (e) => {
    if (e.target === addProjectDialog) {
      toggleDialogDisplay();
    }
  })

  addProjectFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (addProjectFormInput.value !== "") {
      const project = new Project(addProjectFormInput.value);
      ProjectsManager.getBoard().insertBefore(project.getElement(), ProjectsManager.getAddProjectDiv());
      addProjectDialog.style.display = "none";
      addProjectFormInput.value = "";
    }
  })

  return { toggleDialogDisplay };
})();

const ProjectsManager = (function() {
  const board = document.querySelector(".board");
  const addProjectDiv = document.querySelector(".add-project");
  
  addProjectDiv.addEventListener("click", () => {
    DialogManager.toggleDialogDisplay();
  });

  const getBoard = () => board;
  const getAddProjectDiv = () => addProjectDiv;

  return { getBoard, getAddProjectDiv };
})();

