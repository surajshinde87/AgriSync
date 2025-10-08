# 🌾 AgriSync — Empowering Farmers, Buyers & Drivers Through Technology

AgriSync is a **full-stack B2B agriculture marketplace** connecting **Farmers, Buyers, and Drivers** — enabling smarter trading, efficient logistics, and real-time collaboration using **Spring Boot + React.js**.

> ✅ Tested successfully on localhost and ready for deployment.

---

## 🌍 Overview

AgriSync transforms traditional produce trading into a **digital ecosystem** with role-based dashboards, analytics, and automation for all three user types.

🔗 **GitHub Repository:** [AgriSync](https://github.com/surajshinde87/AgriSync)

---

## 🧩 Why AgriSync?

### 🌱 For Farmers
- Manage produce, bids, and earnings  
- Accept or reject bids  
- View and mark orders as delivered  
- Dashboard with analytics (orders, crops, earnings)

### 💰 For Buyers
- Place orders and bids  
- View order history  
- Receive live notifications via WebSocket  
- Provide feedback and ratings  
- Dashboard with insights and analytics

### 🚚 For Drivers
- Manage deliveries and payments  
- Update order statuses (ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED)  
- Track total and per-order earnings  
- Dashboard with stats and ratings

### 🔐 For Everyone
- Secure login and registration  
- Email OTP verification using **Google App Password**  
- Forgot Password recovery via OTP  
- Role-based authentication (Farmer / Buyer / Driver)

> 💡 AgriSync bridges **technology and agriculture** — making produce trading smarter, faster, and more transparent.

---

## 🧠 Core Features

### 🔐 Common
- User registration & login (JWT authentication)
- Role-based authentication & authorization
- Email OTP verification using Google SMTP
- Forgot password with OTP

### 👨‍🌾 Farmer
- Add, edit, and delete produce  
- Accept/reject bids  
- View orders & analytics  

### 🧑‍💼 Buyer
- Browse and search produce  
- Place orders and bids  
- Receive live order notifications  
- View order history and analytics  

### 🚚 Driver
- Manage assigned orders  
- Update delivery status  
- Track earnings and ratings  

---

## ⚙️ Tech Stack

### 🖥 Backend
| Technology | Purpose |
|-------------|----------|
| **Java 17** | Core backend language |
| **Spring Boot 3.x** | Application framework |
| **Spring Web (REST)** | RESTful API development |
| **Spring Data JPA (Hibernate)** | ORM & persistence |
| **MySQL** | Relational database |
| **Spring Security + JWT** | Authentication & authorization |
| **Spring Mail (SMTP)** | Email OTP using Google App Password |
| **WebSocket / STOMP** | Real-time notifications |
| **Lombok** | Reduces boilerplate code |
| **Maven** | Build & dependency management |

### 💻 Frontend
| Technology | Purpose |
|-------------|----------|
| **React.js (latest)** | UI framework |
| **React Router DOM** | Routing |
| **Redux Toolkit** | State management |
| **Axios** | API calls |
| **Tailwind CSS** | Styling & responsiveness |
| **React Toastify** | Notifications |
| **Framer Motion** | Animations |
| **React Icons** | Icon library |
| **Socket.io-client** | Real-time WebSocket communication |

---

## 🧱 System Architecture

- Client (React.js)
- │
- │ REST + WebSocket APIs
- ▼
- Spring Boot (Controllers)
- ▼
- Service Layer (Business Logic)
- ▼
- Repository Layer (JPA)
- ▼
- MySQL Database



**Design Highlights:**
- DTO Pattern for clean data transfer  
- Layered architecture: `Controller → Service → Repository → Entity`  
- Enums: `OrderStatus`, `PaymentStatus`, `BidStatus`, `DriverOrderStatus`  
- Centralized exception handling  

---

## 📊 Dashboards & Analytics
- **Farmer Dashboard:** Crop analytics, bids, earnings summary  
- **Buyer Dashboard:** Spending insights, order history, notifications  
- **Driver Dashboard:** Order tracking, earnings, ratings  

---

## ✉️ Email OTP Integration (Google App Password)

AgriSync uses **Spring Mail (SMTP)** with **Google App Passwords** for secure OTP verification.

### 🧾 Example `application.properties`

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_google_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

```
🔒 Why Google App Password?
Protects your Gmail account

No direct password storage

Fully secure and Gmail API compliant

## 🧩 Data Models

| Model | Description |
|--------|--------------|
| **User** | Common base for all roles |
| **FarmerProfile / BuyerProfile / DriverProfile** | Role-specific data |
| **Produce** | Crop/produce details |
| **Bid** | Buyer offers on produce |
| **Order / DriverOrder** | Order and delivery management |
| **Feedback / Ratings** | Reviews and feedback for orders |
| **Earnings** | Driver payment tracking |


## 🧰 Developer Tools

| Tool | Purpose |
|------|----------|
| 🗃 **MySQL Workbench** | Database management |
| 📮 **Postman** | API testing and debugging |
| 💻 **GitHub** | Version control and collaboration |
| 🔥 **Spring DevTools** | Hot reload during development |
| ⚠️ **Validation & Exception Handling** | Consistent and reliable API responses |


⚡ How to Run Locally
🖥 Backend Setup

# Clone repository
```properties
git clone https://github.com/surajshinde87/AgriSync.git
```

# Navigate to backend
```properties
cd backend
```

# Configure database in application.properties
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

# Run backend
```properties
mvn spring-boot:run
```
📡 Backend server runs at: http://localhost:8080

💻 Frontend Setup

# Navigate to frontend
```properties
cd frontend
```

# Install dependencies
```properties
npm install
```
# Run development server
```properties
npm run dev
```
🌐 Frontend runs at: http://localhost:5173


## 🧑‍💻 Developed By

**Suraj Shinde**

| Platform | Link |
|-----------|------|
| 🌐 **Portfolio** | [https://surajshindeportfolio.netlify.app](https://surajshindeportfolio.netlify.app) |
| 💼 **LinkedIn** | [https://www.linkedin.com/in/surajshinde87](https://www.linkedin.com/in/surajshinde87) |
| 🐦 **Twitter** | [https://x.com/surajshinde_87](https://x.com/surajshinde_87) |
| 📸 **Instagram** | [https://www.instagram.com/surajshinde_87](https://www.instagram.com/surajshinde_87) |

---

## 🏆 Highlights

| ✅ Feature | Description |
|------------|-------------|
| **Role-based architecture** | Supports Farmer, Buyer, and Driver roles |
| **Real-time WebSocket notifications** | Instant updates using STOMP + Socket.io |
| **Secure OTP via Google App Password** | Gmail 2-step verification integration |
| **JWT Authentication & Authorization** | Secure login and role protection |
| **Modular backend architecture** | Clean, layered Spring Boot structure |
| **Responsive & animated React UI** | Built with Tailwind CSS + Framer Motion |
| **Fully tested on localhost** | End-to-end tested frontend and backend |

---

## ⭐ Show Your Support

If you find this project helpful, please ⭐ the repository — it motivates me to keep building impactful solutions!


