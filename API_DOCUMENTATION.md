# MongoDB Atlas API Documentation

This project includes serverless functions that connect to MongoDB Atlas and serve data as RESTful API endpoints.

## MongoDB Connection

- **Connection String**: `mongodb+srv://aya:aya123@cluster0.kuiihgt.mongodb.net/AmanaBookstore`
- **Database Name**: `AmanaBookstore`
- **Connection Utility**: `src/lib/mongodb.ts`

## API Endpoints

### 1. GET /api/books

Retrieves all documents from the "books" collection.

**Request:**
```http
GET /api/books
```

**Response:**
```json
[
  {
    "_id": "...",
    "id": "1",
    "title": "Fundamentals of Classical Mechanics",
    "author": "Dr. Ahmad Al-Kindi",
    ...
  }
]
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### 2. GET /api/cart

Retrieves all documents from the "cart" collection.

**Request:**
```http
GET /api/cart
```

**Response:**
```json
[
  {
    "_id": "...",
    "bookId": "1",
    "quantity": 2,
    "addedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `500`: Server error

**Additional Methods:**
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart?itemId=...` - Remove item from cart

---

### 3. GET /api/reviews

Retrieves all documents from the "reviews" collection.

**Request:**
```http
GET /api/reviews
```

**Response:**
```json
[
  {
    "_id": "...",
    "id": "review-1",
    "bookId": "1",
    "author": "Dr. Yasmin Al-Baghdadi",
    "rating": 5,
    "title": "Excellent foundation for physics students",
    ...
  }
]
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

## Implementation Details

### Connection Management

The MongoDB connection is managed efficiently:
- **Development**: Uses a global variable to preserve connection across Hot Module Replacement (HMR)
- **Production**: Creates a new connection for each request
- **Connection Pooling**: MongoDB driver handles connection pooling automatically

### Error Handling

All endpoints include:
- Try/catch blocks for error handling
- Proper error messages in JSON format
- HTTP status codes (200, 400, 500)
- Console logging for debugging

### Headers

All GET endpoints return:
- `Content-Type: application/json`
- Appropriate cache headers

---

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables (Optional):**
   Create `.env.local` file:
   ```
   MONGODB_URI=mongodb+srv://aya:aya123@cluster0.kuiihgt.mongodb.net/AmanaBookstore
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Test Endpoints:**
   - `http://localhost:3000/api/books`
   - `http://localhost:3000/api/cart`
   - `http://localhost:3000/api/reviews`

---

## MongoDB Atlas Configuration

Make sure to:
1. Add your IP address to MongoDB Atlas IP Access List
2. Verify database name matches: `AmanaBookstore`
3. Verify collection names: `books`, `cart`, `reviews`
4. Ensure data is imported into collections

---

## Notes

- All functions use `async/await` for asynchronous operations
- Database connections are automatically managed by MongoDB driver
- In serverless environments, connections are reused efficiently
- No manual connection closing needed (handled by MongoDB driver)

