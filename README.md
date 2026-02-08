# Moments. | Personal Event Manager

![Node](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-5.x-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

**Moments** is a full-stack web application designed to help users collect memories, not just events. It allows users to securely register, manage their personal profile, and maintain a collection of events with a clean, responsive interface. The app also features an external **Quotes API** integration that displays daily inspirational quotes.

---

## ✨ Features

* **🔐 Secure Authentication:** User registration and login powered by **JWT** (JSON Web Tokens) and **bcryptjs** password hashing.
* **👤 User Profile:** Private dashboard with the ability to update name and email.
* **📅 Event CRUD:** Full Create, Read, Update, and Delete functionality for personal events.
* **💬 External API:** Daily inspirational quotes via the **API Ninjas Quotes API**.
* **🛡 Data Validation:** Server-side input validation using **Joi**.
* **⚠️ Error Handling:** Global error-handling middleware and meaningful HTTP status codes.
* **📱 Responsive Design:** Optimized for desktop and mobile.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT + bcryptjs
* **Validation:** Joi
* **Frontend:** Vanilla JavaScript, HTML5, CSS3
* **External API:** [API Ninjas Quotes](https://api-ninjas.com/api/quotes)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v16+)
* A [MongoDB Atlas](https://www.mongodb.com/atlas/database) account or local MongoDB instance

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/final-project-events.git
    cd final-project-events
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key_here
    ```

4. **Start the server**
    ```bash
    npm start
    ```

5. **Access the App**
    Open your browser and navigate to: `http://localhost:3000`

---

## 📡 API Documentation

### Authentication (Public)
| Method | Endpoint             | Description                        | Access |
| :----- | :------------------- | :--------------------------------- | :----- |
| `POST` | `/api/auth/register` | Register a new user (hashed pass)  | Public |
| `POST` | `/api/auth/login`    | Authenticate user & get JWT token  | Public |

### User Profile (Private 🔒)
| Method | Endpoint             | Description                | Access     |
| :----- | :------------------- | :------------------------- | :--------- |
| `GET`  | `/api/users/profile` | Get logged-in user profile | Private 🔒 |
| `PUT`  | `/api/users/profile` | Update name or email       | Private 🔒 |

### Events — Resource (Private 🔒)
| Method   | Endpoint            | Description              | Access     |
| :------- | :------------------ | :----------------------- | :--------- |
| `GET`    | `/api/events`       | Get all user events      | Private 🔒 |
| `POST`   | `/api/events`       | Create a new event       | Private 🔒 |
| `GET`    | `/api/events/:id`   | Get single event details | Private 🔒 |
| `PUT`    | `/api/events/:id`   | Update an event          | Private 🔒 |
| `DELETE` | `/api/events/:id`   | Delete an event          | Private 🔒 |

### External API Integration
* **Quotes API** — displays a random inspirational quote on the dashboard (via [API Ninjas](https://api-ninjas.com/api/quotes)).

---

## 📂 Project Structure

```text
final-project-events/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js    # Register & Login logic
│   ├── eventController.js   # CRUD for events
│   └── userController.js    # Profile get/update
├── middleware/
│   ├── authMiddleware.js    # JWT token verification
│   └── validate.js          # Joi validation middleware
├── models/
│   ├── User.js              # User schema (name, email, password)
│   └── Event.js             # Event schema (title, date, location, description)
├── routes/
│   ├── authRoutes.js        # /api/auth/*
│   ├── eventRoutes.js       # /api/events/*
│   └── userRoutes.js        # /api/users/*
├── public/
│   ├── index.html           # Main UI
│   ├── app.js               # Frontend logic
│   └── style.css            # Styles
├── .env                     # Environment variables (not committed)
├── server.js                # Entry point
├── package.json
└── README.md
```

---

## 🤝 Contributing

This is a university final project. Feel free to fork and improve!

Developed by **tmrszh**
# Event-Management-Website
