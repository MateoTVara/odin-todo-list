# Odin Todo List

This is a Todo List web application built as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.

## Features

- **Projects & Lists:** Organize your tasks into projects, each with multiple lists.
- **Cards:** Add, edit, and manage tasks (cards) within lists.
- **Card Details:** Each card supports a description, due date, notes, priority, and checklists.
- **Drag & Drop:** Reorder projects with intuitive drag-and-drop.
- **Persistence:** All data is saved in your browser's localStorage, so your tasks are always there when you return.
- **Responsive UI:** Clean, modern interface that works on desktop and mobile.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/odin-todo-list.git
   cd odin-todo-list
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm exec webpack serve
   ```
   Then open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

- `src/models/` - Core data models (Project, List, Card)
- `src/managers/` - UI and logic managers (DOM, Modal, Persistence, etc.)
- `src/modules/` - Utility modules (helpers, persistence)
- `src/styles.css` - Main stylesheet
- `src/template.html` - HTML template

## Acknowledgements

- Built for [The Odin Project](https://www.theodinproject.com/) curriculum.
- [Kanban](https://icons8.com/icon/fbyWnEcsCVhd/kanban) icon by [Icons8](https://icons8.com)

---

Happy coding!