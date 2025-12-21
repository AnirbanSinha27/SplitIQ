# SplitIQ Architecture

SplitIQ is a microservices-based expense management platform.

## Services
- Auth Service: authentication & identity
- Group Service: group & membership management
- Expense Service: expense creation & splits
- Settlement Service: balance optimization
- OCR Service: bill scanning & parsing

## Communication
- REST APIs
- JWT-based authentication
- Async processing for OCR & notifications

## Datastores
- PostgreSQL (core data)
- Redis (caching & async tasks)
- Object storage (bill images)
