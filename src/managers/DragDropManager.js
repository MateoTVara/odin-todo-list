// src/managers/DragDropManager.js

import { createSwapy } from 'swapy';
import { persistenceManager } from '../modules/persistence';

class DragDropManager {
  constructor(container) {
    this.container = container;
    this.isDragging = false;
    this.swapy = createSwapy(container, {
      animation: 'dynamic',
      autoScrollOnDrag: true,
    });
    this.initEventListeners();
  }

  initEventListeners() {
    this.swapy.onSwapStart(() => {
      this.isDragging = true;
      console.log(`Drag started ${this.isDragging}`);
    });

    this.swapy.onSwapEnd(() => {
      const newOrder = Array.from(this.container.querySelectorAll("[data-project-id]"))
        .map(e => e.dataset.projectId);
      persistenceManager.updateProjectsOrder(newOrder);

      setTimeout(() => {
        this.isDragging = false;
        console.log(`Drag ended ${this.isDragging}`);
      }, 50);
    });
  }

  update() {
    this.swapy.update();
  }
}

export const dragDropManager = new DragDropManager(document.querySelector(".projects"));