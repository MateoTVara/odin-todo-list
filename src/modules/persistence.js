// persistence.js

import { Project } from "../index"

class PersistenceManager {
  constructor(){
    this.PROJECTS_STORAGE_KEY = "projects";
    this.ORDER_STORAGE_KEY = "projects-order";
  }

  loadProjects() {
    const raw = localStorage.getItem(this.PROJECTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  loadProjectsOrder() {
    const raw = localStorage.getItem(this.ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  saveProjects(projects) {
    localStorage.setItem(this.PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  saveProjectsOrder(projectsOrder) {
    localStorage.setItem(this.ORDER_STORAGE_KEY, JSON.stringify(projectsOrder));
  }

  saveProjectsAndTheirOrder(projects, projectsOrder) {
    this.saveProjects(projects);
    this.saveProjectsOrder(projectsOrder);
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

  addProject(projects, projectsOrder, projectInstance) {
    projects[projectInstance.id] = this.serializeProject(projectInstance);
    projectsOrder.push(projectInstance.id);
    this.saveProjectsAndTheirOrder(projects, projectsOrder);
  }

  removeProject(projects, projectsOrder, projectInstance) {
    delete projects[projectInstance.id];
    projectsOrder.splice(projectsOrder.indexOf(projectInstance.id), 1);
    this.saveProjectsAndTheirOrder(projects, projectsOrder);
  }

  updateProjects(projects, projectInstance) {
    projects[projectInstance.id] = this.serializeProject(projectInstance);
    this.saveProjects(projects);
  }

  updateProjectsOrder(projectsOrder, newOrder) {
    projectsOrder.length = 0;
    projectsOrder.push(...newOrder);
    this.saveProjectsOrder(projectsOrder);
  }
}

export { PersistenceManager };