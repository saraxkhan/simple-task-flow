📝 Smart AI-Enhanced To-Do List

A modern, clean, and intelligent To-Do List web application built using Next.js and Tailwind CSS, featuring a lightweight AI-powered task analysis engine that works completely offline.

🎯 Project Objective

This project was built to demonstrate:

Basic web development skills

Logical implementation

AI feature integration

Clean and user-friendly UI design

The application includes all mandatory To-Do features along with a smart AI-based task analysis system.

✅ Core Features

➕ Add new tasks

🗑 Delete tasks

✔ Mark tasks as completed

📋 Display tasks clearly

💾 Persistent storage using localStorage

🤖 AI-Powered Features

The application includes a lightweight rule-based AI engine that runs entirely on the client side (no external APIs required).

🧠 Smart Task Analysis

When a task is added, the AI engine:

Automatically detects task category

Assigns a priority level

Suggests intelligent subtasks

Adds relevant emoji indicators

📂 Automatic Category Detection

Tasks are classified into:

📚 Study

💼 Work

🏃 Health

🛒 Shopping

👤 Personal

Based on intelligent keyword detection.

🔥 Priority Detection

Tasks are labeled:

🔴 High

🟡 Medium

🟢 Low

Based on urgency-related keywords.

📌 Smart Subtask Suggestions

For example:

Input:
Prepare for math exam

AI Suggestions:

Break syllabus into sections

Review notes

Solve practice questions

All logic runs locally in the browser.

📊 Additional Enhancements

📈 Progress bar (completion percentage)

🔢 Task counter (Completed / Total)

🧹 Smart sorting (High priority first, incomplete first)

✨ Smooth UI transitions

📭 Clean empty state interface

🎨 Modern responsive design

🏗 Tech Stack

Next.js

Tailwind CSS

TypeScript

Client-side AI logic (rule-based)

localStorage for persistence

No backend server.
No database.
No external AI APIs.
Fully compatible with Vercel deployment.

🚀 Deployment

The application is designed for seamless deployment on Vercel.

To run locally:
npm install
npm run dev

Then open:

http://localhost:3000
💡 How the AI Works (Technical Overview)

The AI engine is implemented as a modular utility (/lib/aiEngine.ts) that:

Analyzes task text

Matches keywords to predefined categories

Determines urgency level

Dynamically generates contextual subtasks

This approach ensures:

Fast performance

Offline functionality

No dependency on external services

Reliable behavior during evaluation

📌 Why This Project Stands Out

Clean and intuitive UI

Meaningful AI integration (not decorative)

Modular and maintainable code structure

Fully functional offline

Stable and deployment-ready

📜 License

This project is built for academic evaluation purposes.

