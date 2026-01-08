# 📡 API Documentation

Complete API reference for the Cattle Disease Detection System.

## Base URL

```
Development: http://localhost:5000/api
Production: https://yourdomain.com/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Endpoints

### Authentication

#### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

**Errors:**
- `400` - Validation error (missing fields, invalid email, weak password)
- `409` - Email already exists

---

#### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

**Errors:**
- `400` - Missing credentials
- `401` - Invalid credentials
- `404` - User not found

---

#### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `401` - Unauthorized (invalid/expired token)

---

### Predictions

#### Upload Image for Prediction

Upload cattle image and get disease prediction.

**Endpoint:** `POST /predict`

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: <file> (PNG, JPG, JPEG - max 10MB)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "report": {
      "report_id": "RPT-1234567890",
      "user_id": "user_id",
      "status": "Diseased",
      "disease_name": "Lumpy Skin Disease",
      "stage": "Moderate",
      "confidence": 87.5,
      "precautions": [
        "Isolate affected cattle immediately",
        "Consult veterinarian for treatment",
        "Maintain hygiene in cattle shed"
      ],
      "recommendations": [
        "Administer prescribed medication",
        "Monitor temperature daily",
        "Provide nutritious feed"
      ],
      "image_url": "/uploads/image_filename.jpg",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  },
  "message": "Prediction completed successfully"
}
```

**Errors:**
- `400` - No image provided / Invalid file type / File too large
- `401` - Unauthorized
- `500` - Prediction failed

---

### Reports

#### Get User Reports

Retrieve all reports for authenticated user.

**Endpoint:** `GET /reports`

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`healthy`, `diseased`, `all`)
- `limit` (optional): Number of reports per page (default: 10)
- `page` (optional): Page number (default: 1)
- `sort` (optional): Sort field (default: `-timestamp`)

**Example:**
```http
GET /reports?status=diseased&limit=20&page=1&sort=-timestamp
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "report_id": "RPT-1234567890",
        "status": "Diseased",
        "disease_name": "Lumpy Skin Disease",
        "stage": "Moderate",
        "confidence": 87.5,
        "precautions": [...],
        "recommendations": [...],
        "image_url": "/uploads/image.jpg",
        "timestamp": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

**Errors:**
- `401` - Unauthorized

---

#### Get Single Report

Get detailed information about a specific report.

**Endpoint:** `GET /reports/:reportId`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "report": {
      "report_id": "RPT-1234567890",
      "user_id": "user_id",
      "status": "Diseased",
      "disease_name": "Lumpy Skin Disease",
      "stage": "Moderate",
      "confidence": 87.5,
      "precautions": [...],
      "recommendations": [...],
      "image_url": "/uploads/image.jpg",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not your report)
- `404` - Report not found

---

#### Delete Report

Delete a specific report.

**Endpoint:** `DELETE /reports/:reportId`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not your report)
- `404` - Report not found

---

### Admin Endpoints

All admin endpoints require admin role.

#### Get System Statistics

Get overall system statistics and analytics.

**Endpoint:** `GET /admin/stats`

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalReports": 500,
      "healthyCount": 300,
      "diseasedCount": 200,
      "diseaseDistribution": [
        { "_id": "Lumpy Skin Disease", "count": 120 },
        { "_id": "Foot and Mouth Disease", "count": 80 }
      ],
      "recentReports": [
        {
          "report_id": "RPT-1234567890",
          "user_name": "John Doe",
          "status": "Diseased",
          "disease_name": "Lumpy Skin Disease",
          "confidence": 87.5,
          "timestamp": "2024-01-01T12:00:00.000Z"
        }
      ],
      "monthlyTrends": [
        { "month": "January", "healthy": 50, "diseased": 30 }
      ]
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

#### Get All Users

Retrieve list of all registered users.

**Endpoint:** `GET /admin/users`

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `role` (optional): Filter by role (`user`, `admin`)
- `limit` (optional): Number of users per page (default: 20)
- `page` (optional): Page number (default: 1)
- `search` (optional): Search by name or email

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "reportCount": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 8,
      "limit": 20
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

#### Get All Reports (Admin)

Retrieve all reports in the system.

**Endpoint:** `GET /admin/reports`

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status` (optional): Filter by status
- `disease` (optional): Filter by disease name
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `limit` (optional): Number of reports per page
- `page` (optional): Page number

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reports": [...],
    "pagination": {...}
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

#### Update User Role

Change user's role (user/admin).

**Endpoint:** `PATCH /admin/users/:userId/role`

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  },
  "message": "User role updated successfully"
}
```

**Errors:**
- `400` - Invalid role
- `401` - Unauthorized
- `403` - Forbidden (not admin)
- `404` - User not found

---

#### Delete User

Delete a user account and all associated reports.

**Endpoint:** `DELETE /admin/users/:userId`

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not admin / cannot delete self)
- `404` - User not found

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 100 requests per 15 minutes
- **Unauthenticated**: 20 requests per 15 minutes
- **Admin endpoints**: 200 requests per 15 minutes

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Pagination

Paginated endpoints return:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## File Upload Specifications

### Supported Formats
- PNG
- JPG/JPEG
- Maximum size: 10MB
- Recommended resolution: 224x224 or higher

### Image Requirements
- Clear, well-lit image
- Cattle should be visible
- Avoid blurry or dark images
- Single cattle per image recommended

## Webhooks (Coming Soon)

Webhook support for real-time notifications:
- New prediction completed
- Report status changed
- User registered

## SDK & Libraries

### JavaScript/Node.js
```javascript
import CattleDiseaseAPI from 'cattle-disease-sdk';

const api = new CattleDiseaseAPI({
  baseURL: 'https://api.yourdomain.com',
  token: 'your_jwt_token'
});

// Upload image
const result = await api.predict(imageFile);
console.log(result.report);
```

### Python
```python
from cattle_disease import CattleDiseaseAPI

api = CattleDiseaseAPI(
    base_url='https://api.yourdomain.com',
    token='your_jwt_token'
)

# Upload image
result = api.predict('path/to/image.jpg')
print(result['report'])
```

## Support

For API support:
- Email: adadapee@gitam.in
- GitHub Issues: [Create Issue](https://github.com/Ayisha114/cattle-disease-detection-pro/issues)
- Documentation: [View Docs](https://github.com/Ayisha114/cattle-disease-detection-pro/tree/main/docs)

---

**Last Updated:** January 2024
