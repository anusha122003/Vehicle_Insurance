# Contributing to AutoShield

Thank you for your interest in contributing to AutoShield! This document outlines guidelines and workflows for contributing to this project.

## 🚀 Development Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Car_Claims-main
   ```

2. **Backend Setup**:
   - Python 3.10+ is recommended.
   - Set up virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Copy `.env.example` to `.env` and configure your settings. By default, it falls back to a local SQLite database if PostgreSQL/Docker is not used.
   - Run database migrations:
     ```bash
     alembic upgrade head
     ```
   - Start the FastAPI backend:
     ```bash
     python main.py
     ```

3. **Frontend Setup**:
   - Node.js 18+ is recommended.
   - Install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Copy `.env.example` to `.env` if applicable.
   - Start the React dev server:
     ```bash
     npm run dev
     ```

## 🛠️ Code Guidelines

- **Python**: Follow PEP 8 guidelines. Use `black` and `ruff` for formatting and linting.
- **JavaScript/React**: Write clean, reusable functional components with hooks. Use Tailwind CSS for consistent styling.
- **Git Commit Messages**: Write clear, imperative-style commit messages (e.g., `feat: add user authentication`).

## 🧪 Testing

- Run backend tests:
  ```bash
  pytest
  ```
- Run frontend tests:
  ```bash
  npm run test
  ```
