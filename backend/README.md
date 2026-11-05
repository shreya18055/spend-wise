# SpendWise Backend

Spring Boot REST API for the SpendWise personal finance tracker.

## Requirements
- Java 21
- Maven 3.9+

## Run tests
```bash
mvn clean test
```

## Run the API
```bash
mvn spring-boot:run
```

API base URL: http://localhost:8080/api

## Endpoints
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`
- `GET /api/transactions/summary`

## Create a transaction
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Groceries",
    "category": "Food",
    "amount": 850.00,
    "type": "EXPENSE",
    "transactionDate": "2026-11-05"
  }'
```

This starter currently uses an in-memory H2 database for the first API test.
Data is reset when the backend process stops. PostgreSQL will be configured next.
