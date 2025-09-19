// index.js

import { projectsManager } from './managers';
import "./styles.css";

class AppController {
  constructor() {}

  static init() {
    projectsManager.renderAllProjects();
  }
}

AppController.init();