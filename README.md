# 📱 PhoneLens — Phone Explorer Web App

## 🔍 Project Overview

**PhoneLens** is a modern, responsive web application that allows users to search, explore, and view detailed information about mobile phones. The application uses a real-time API to fetch phone data dynamically and presents it through an interactive and visually appealing user interface.

---

## 🚀 Features

### 🔎 Search Functionality

* Users can search for phones by brand or model (e.g., Samsung, iPhone, Pixel)
* Dynamic results are fetched using an API
* Displays relevant phones based on user input

### 📱 Phone Cards

* Phones are displayed in a responsive grid layout
* Each card includes:

  * Phone image
  * Brand name
  * Phone name
* Hover effects for better user experience

### 📄 Detailed Phone View

* Clicking a phone card opens a **modal popup**
* Displays detailed information:

  * Brand
  * Storage
  * Display size
  * Chipset
  * Memory & Sensors
  * Release date

### 📋 Show All Phones

* "Show All" button loads multiple phone brands
* Combines results and removes duplicates

### ⏳ Loading & Status Feedback

* Loading spinner during API requests
* Status messages for:

  * Searching
  * No results
  * Errors

### 🔐 Additional UI Features

* Sign-in modal (UI only)
* Buy modal (UI simulation)
* Toast notifications for user actions

---

## 🎨 User Interface

* Modern dark theme UI
* Glassmorphism-inspired cards
* Smooth animations and transitions
* Fully responsive design (mobile + desktop)

---

## 🛠️ Technologies Used

* **HTML5** – Structure
* **CSS3** – Styling, animations, responsive design
* **JavaScript (Vanilla JS)** – Functionality
* **Fetch API** – Data retrieval

---

## ⚙️ JavaScript Functionalities Used

* Event Listeners
* Fetch API for asynchronous data fetching
* Async/Await for handling API calls
* Dynamic rendering of UI components
* Error handling and fallback UI
* Modal and overlay handling

---

## 🌐 API Used

Data is fetched from:

```
https://openapi.programming-hero.com/api/phones?search={query}
https://openapi.programming-hero.com/api/phone/{id}
```

* Provides real-time phone data
* Enables search and detailed phone information

---

## 📂 Project Structure

```
PhoneLens/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

---

## ▶️ How to Run the Project

1. Download or clone the repository
2. Open the project folder in VS Code
3. Open `index.html` in your browser
4. Start searching for phones!

---

## 🎥 How to Use

1. Enter a phone name in the search bar
2. Click **Search**
3. Browse phone cards
4. Click a card to view details
5. Use **Show All** to explore all phones

---

## 💡 Key Highlights

* Real-time API integration
* Clean and modern UI/UX design
* Fully responsive layout
* Interactive modals and animations
* Beginner-friendly but feature-rich implementation

---

## 🔗 GitHub Repository

[(Add your repository link here)](https://github.com/Vihanga-Ops/Phone-Search-Web-App.git)

---
