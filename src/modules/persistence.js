// persistence.js

class PersistenceManager {
  constructor(){
    this.PROJECTS_STORAGE_KEY = "projects";
    this.ORDER_STORAGE_KEY = "projects-order";

    this.projects = this.#loadProjects();
    this.projectsOrder = this.#loadProjectsOrder();
  }

  #loadProjects() {
    const raw = localStorage.getItem(this.PROJECTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  #loadProjectsOrder() {
    const raw = localStorage.getItem(this.ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getProjects() {return this.projects};

  getProjectsOrder() {return this.projectsOrder};

  saveProjects() {
    localStorage.setItem(this.PROJECTS_STORAGE_KEY, JSON.stringify(this.projects));
  }

  saveProjectsOrder() {
    localStorage.setItem(this.ORDER_STORAGE_KEY, JSON.stringify(this.projectsOrder));
  }

  saveProjectsAndTheirOrder() {
    this.saveProjects(this.projects);
    this.saveProjectsOrder(this.projectsOrder);
  }

  serializeProject(projectInstance) {
    return {
      name: projectInstance.name,
      color: projectInstance.color,
      lists: projectInstance.lists.map(listInstance => ({
        id: listInstance.id,
        title: listInstance.title,
        cards: listInstance.cards.map(cardInstance => ({
          id: cardInstance.id,
          description: cardInstance.description,
          locked: cardInstance.locked
        }))
      }))
    }
  }

  addProject(projectInstance) {
    this.projects[projectInstance.id] = this.serializeProject(projectInstance);
    this.projectsOrder.push(projectInstance.id);
    this.saveProjectsAndTheirOrder();
  }

  removeProject(projectInstance) {
    delete this.projects[projectInstance.id];
    this.projectsOrder.splice(this.projectsOrder.indexOf(projectInstance.id), 1);
    this.saveProjectsAndTheirOrder();
  }

  updateProjects(projectInstance) {
    this.projects[projectInstance.id] = this.serializeProject(projectInstance);
    this.saveProjects();
  }

  updateProjectsOrder(newOrder) {
    this.projectsOrder.length = 0;
    this.projectsOrder.push(...newOrder);
    this.saveProjectsOrder();
  }
}

export const persistenceManager = new PersistenceManager();
export const projects = persistenceManager.getProjects();
export const projectsOrder = persistenceManager.getProjectsOrder();