# Data Ingestion API

A RESTful API service to ingest data IDs in prioritized batches, process them asynchronously with rate limiting, and provide status updates.

---

## Features

- Accepts ingestion requests with an array of IDs and priority (HIGH, MEDIUM, LOW).
- Processes IDs in batches of 3 concurrently.
- Prioritizes requests based on priority levels.
- Implements rate limiting (max 1 batch every 5 seconds).
- Endpoint to check ingestion status by request ID.
- Built with Node.js and Express.

---

## API Endpoints

### POST `/ingest`

Submit a data ingestion request.

- **Request Body:**

  ```json
  {
    "ids": [1, 2, 3, 4, 5],
    "priority": "HIGH"
  }
