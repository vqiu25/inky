# CS732 Project - Team Concerning Elegant Horses

<p align="center">
  <img width="200" alt="inky-logo" src="https://github.com/user-attachments/assets/6e4e5653-e33d-4066-8db0-e83f0f2169a7">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-23.x-green?logo=node.js&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white&style=for-the-badge" />
  <a href="https://inky-frontend-ywb1.onrender.com/">
    <img src="https://img.shields.io/badge/deployed-on%20Render-brightgreen?style=for-the-badge" />
  </a>
</p>

## 🐙 About

Inky is an online Pictionary game with powerups! Up to 6 people can play, taking turns in one of two roles:
* **Drawer**: Draw a picture for others to guess.
* **Guesser**: Guess what is being drawn.

As a guesser, a series of powerups will be available to help you or hinder other players.

### ✨ Features

- 🖌️ **Drawing-based Gameplay** – One player draws while others try to guess the word.
- ⚡ **Real-time Communication** – Live drawing and guessing powered by Socket.IO. 
- 🧠 **Word Selection** – Drawers choose from a random set of phrases each round.
- 💬 **In-Game Chat** – Players can submit guesses through an interactive chat system.
- 🎯 **Powerups System** – Guessers can use powerups to help themselves or sabotage others.
- 🏆 **Scoring & Leaderboard** – Points are awarded based on guess speed and accuracy.

### 🖼️ Images

<p align="center">
  <img width="1000" alt="inky-photos" src="https://github.com/user-attachments/assets/285ae5fe-5551-40be-a24d-07220e6fe37c">
</p>

### 🎥 Video

https://github.com/user-attachments/assets/a045a653-9381-4c06-8f06-436e6dc8b0bf

### 🏗️ Architecture

Our project is built using the **MERN** stack with **TypeScript**. The system architecture is outlined below:

<p align="center">
  <img width="700" alt="architecture" src="https://github.com/user-attachments/assets/f51f6977-8ff5-4cb0-bd15-9fe2546c32a0">
</p>

## 🚀 Getting Started

### 1. 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or later (we use v23)
- **npm** (comes with Node.js)
- **Git**

You can check your Node version with:

```bash
node -v
```

### 2. ⬇️ Clone the Repository

```bash
git clone https://github.com/UOA-CS732-S1-2025/group-project-concerning-elegant-horses.git
cd group-project-concerning-elegant-horses
```

### 3. 🔐 Environment Variables

Place the provided .env files in both the frontend and backend directories respectively.

### 4. 📁 Install Dependencies

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

### 4. 🚀 Start the App

Run both the frontend and backend in separate terminal tabs:

```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run dev
```

> Note that since this is a multiplayer game, it requires three players to function properly. To test the game locally, you should run `npm run dev` in three separate terminal windows/tabs for the frontend, and open them in separate browser tabs. You’ll also need three different Google accounts to sign into each frontend instance respectively.

## 🧪 Testing

We have used Vitest and Supertest for testing:

### 🖼️ Frontend Testing

To run the frontend test suite, first navigate to the frontend directory and run:

```bash
npm test
```

### 🖥️ Backend Testing

We have created test cases for our `Users` and `Phrases` endpoints. To run the test suite, navigate to the backend directory and run:

```bash
npm test
```

To generate a coverage report:

```
npm run test -- --coverage
```

## 🌐 Deployment

We used Render to deploy both the frontend and backend. The deployment link can be found [here](https://inky-frontend-ywb1.onrender.com/). Please note that since we’re using the free tier, the backend may become inactive when idle. After attempting to sign in for the first time, you may need to wait up to a minute for the backend to wake up — then reattempt to sign in.

## 📋 Project Management

For project management, we used GitHub’s [project board](https://github.com/orgs/UOA-CS732-S1-2025/projects/43) alongside issue tracking to organise and prioritise tasks. Each pull request was linked to a corresponding issue to ensure clear traceability and progress tracking.

## 📚 Wiki

Our [GitHub Wiki](https://github.com/UOA-CS732-S1-2025/group-project-concerning-elegant-horses/wiki) includes notes on:
* Git Etiquette
* Design
* Minutes
* Task Attribution

## © Attributions

| Library / Tool      | Purpose / Usage                                                                 | License / Link |
|---------------------|----------------------------------------------------------------------------------|----------------|
| [Font Awesome](https://fontawesome.com/) | Icons in the UI                                                | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) | In-memory DB for backend tests                                 | MIT |
| [Vitest](https://vitest.dev/)         | Test runner for backend (API tests)                             | MIT |
| [Socket.IO](https://socket.io/)       | Real-time communication between frontend and backend            | MIT |
| [Supertest](https://github.com/visionmedia/supertest) | HTTP request simulation for Express endpoints         | MIT |
| [Fabric.js](http://fabricjs.com/)     | Canvas drawing in the game UI                                   | MIT |
| [React Tooltip](https://www.npmjs.com/package/react-tooltip) | Tooltip rendering                                                | MIT |
| [React Hot Toast](https://github.com/timolins/react-hot-toast) | Non-blocking toast/notification pop-ups in the UI | MIT |

## 👥 Contributors

Our team members are:

- Amanda Lowe _(alow719@aucklanduni.ac.nz)_
- Liam Parker _(lpar161@aucklanduni.ac.nz)_
- Eason Jin _(ejin458@aucklanduni.ac.nz)_
- Victor Qiu _(vqiu164@aucklanduni.ac.nz)_
- Jessica Jiang _(jjia240@aucklanduni.ac.nz)_
- Joshua Tan _(jtan678@aucklanduni.ac.nz)_

<p align="center">
  <img width="250" alt="footer" src="https://github.com/user-attachments/assets/d8ca1cab-0ec3-48c5-9d52-8161793b0857">
</p>
