# WasteNot — Surplus Food Marketplace

A full-stack MERN application that connects food businesses with customers who want to purchase surplus food at discounted prices. This pickup-based marketplace helps reduce food waste while saving money.

## Features

- **Two user roles**: Sellers (food businesses) and Buyers (customers)
- **Surplus food listings**: Sellers add items with discounted prices and pickup details
- **Reservation system**: Buyers reserve food, sellers accept/reject, then mark as collected
- **Real-time dashboards**: Statistics and activity feeds for both roles
- **Search & filter**: Browse by category, search by name, sort by price
- **Secure authentication**: JWT-based auth with HTTP-only cookies

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone <repo-url>
cd WasteNot
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see `.env.example` for required variables):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/wastenot
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Usage

1. Register as a **Seller** to list surplus food
2. Register as a **Buyer** to browse and reserve food
3. Sellers manage listings and reservation requests
4. Buyers search, filter, and reserve food at discounted prices

## Project Structure

```
WasteNot/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/      # Auth & role middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Express app entry
├── frontend/
│   └── src/
│       ├── api/         # Axios service layer
│       ├── components/  # Reusable UI components
│       ├── context/     # React Context (auth)
│       ├── pages/       # Page components
│       ├── routes/      # Route guards
│       └── utils/       # Formatting utilities
└── README.md
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update profile |
| GET | /api/products | Browse listings (search, filter, sort) |
| GET | /api/products/:id | Get listing details |
| POST | /api/products | Create listing (seller) |
| PUT | /api/products/:id | Update listing (seller) |
| DELETE | /api/products/:id | Delete listing (seller) |
| GET | /api/products/seller/my-listings | Seller's own listings |
| POST | /api/reservations | Create reservation (buyer) |
| GET | /api/reservations/my | Buyer's reservations |
| GET | /api/reservations/incoming | Seller's incoming reservations |
| PUT | /api/reservations/:id/status | Update reservation status |
| GET | /api/dashboard/seller | Seller statistics |
| GET | /api/dashboard/buyer | Buyer statistics |

## License

MIT
