# Event Microservice

A scalable event-driven microservice for real-time processing of user activity logs, built with Node.js, Express, and Kafka.

## 🚀 Live Demo

The service is deployed on AWS (free tier EC2 instance):

**Health Check:** [http://16.170.48.162:3000/health](http://16.170.48.162:3000/health)

## Architecture Overview

When I started building this service, I wanted something that could grow with the project without becoming a nightmare to maintain. Here's why I made the choices I did:

### Why Domain-Driven Design (DDD)?

Honestly, I went with DDD because it keeps things organized in a way that actually makes sense. Instead of throwing all my code into random folders, I structured it around what the service actually _does_:

```
src/
├── domain/          # The "what" - business logic lives here
│   ├── entities/    # Activity model and business rules
│   ├── repositories/# Interfaces for data access
│   └── services/    # Core business operations
├── application/     # The "how" - use cases that orchestrate things
│   └── useCases/    # CreateActivity, GetActivities, etc.
├── infrastructure/  # The "with what" - external stuff
│   ├── database/    # MongoDB connection and repos
│   └── messaging/   # Kafka producer/consumer
└── interfaces/      # The "entry points" - HTTP routes, controllers
    ├── http/
    └── middleware/
```

The big win here? If I need to swap out MongoDB for PostgreSQL someday, I only touch the `infrastructure` layer. The business logic doesn't care where data comes from.

### Why Kafka for Messaging?

I picked Kafka over something simpler like RabbitMQ because:

1. **It handles high throughput** - When you're logging user activities, things can get crazy fast. Kafka doesn't break a sweat.
2. **Messages stick around** - Unlike traditional queues, Kafka keeps messages for a configurable period. If something goes wrong, I can replay events.
3. **Consumer groups** - I can scale consumers independently. Need more processing power? Just spin up another instance.

The producer publishes activity events, and the consumer picks them up and persists them to MongoDB. Simple, but effective.

## Deployment

The service is containerized with Docker and can be deployed to Kubernetes:

- **Docker Compose** - For local development with Kafka and MongoDB
- **Kubernetes configs** - Basic deployment, service, and configmap manifests

The K8s setup is pretty minimal right now - just enough to get it running. In production, you'd want to add things like resource limits, HPA for autoscaling, and proper secrets management.

## Getting Started

```bash
# Install dependencies
npm install

# Start with Docker (recommended)
cd docker
docker-compose up -d

# Or run locally (needs Kafka & MongoDB running)
npm run dev
```

## API Endpoints

| Method | Endpoint          | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| POST   | `/api/activities` | Create a new activity log                |
| GET    | `/api/activities` | Fetch activities with pagination/filters |
| GET    | `/health`         | Health check endpoint                    |

## What I'd Improve

If I had more time, here's what I'd add:

- [ ] Request rate limiting
- [ ] Distributed tracing for debugging
- [ ] Prometheus metrics endpoint
- [ ] API documentation with Swagger

---
