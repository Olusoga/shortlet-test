# REST Countries API Integration

This project implements a REST API using NestJS and TypeScript that integrates data from the REST Countries API. The API provides various endpoints to retrieve and process country data, including caching strategies and comprehensive documentation. The project follows clean code principles, SOLID design principles, and includes both unit and integration tests.

## Project Overview

The API is designed to fetch data from the REST Countries API and expose it through several endpoints with enhanced functionalities like pagination, filtering, sorting, and caching. 

## Technical Specifications
## Frameworks and Libraries
- NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.
- TypeScript: A strict syntactical superset of JavaScript that adds optional static typing.
- Redis: An in-memory data structure store, used as a database, cache, and message broker.
- Winston: A logger for Node.js applications.
- Prometheus: An open-source system monitoring and alerting toolkit.
- Grafana: An open-source platform for monitoring and observability, used to visualize Prometheus metrics.
- Docker: A platform for developing, shipping, and running applications in containers.

## Key Features
- Caching: Implemented using Redis to cache API responses for faster data retrieval and reduced load on the REST Countries API.
- Rate Limiting: Middleware to prevent abuse by limiting the number of requests a client can make.
- CORS Middleware: Ensuring secure cross-origin requests.
- Exception Handling: Centralized HTTP exception filter for consistent error responses.
- Custom Logger: Using Winston for detailed logging and tracking.
- Metrics: Monitoring API performance and usage using Prometheus and Grafana.
- Unit and Integration Tests: Ensuring code quality and reliability.
- Containerization: Using Docker to containerize the application for consistent and portable environments.

## Project Structure

```plaintext
src/
├── common/
|   ├──filters/
|   |   └── http-exception.filter.ts
│   ├──error
|   |   └──custom-exception-error.ts
|   ├── axios/
│       ├── axios.provider.ts
│       ├── axios.module.ts
├── security/
|      ├── middlewares
|      |      └── cors-middleware.ts
|      ├── rate-limiting
|              └── rate-limiting.module.ts
├── config/
│   ├── config.module.ts
|   ├──config.service.ts
├── modules/
│   ├── countries/
│   │   ├── dto/
│   │   │   ├── country-query.dto.ts
│   │   │   ├── country-details.dto.ts
│   │   ├── countries.controller.ts
|   |   ├── countries.controller.spec.ts
|   |   ├── countries.service.spec.ts
│   │   ├── countries.service.ts
│   │   ├── countries.module.ts
│   ├── redis/
│   │   ├── redis.service.ts
│   │   ├── redis.module.ts
│   ├── utils/
│   │   ├── cache_utils.ts
│   │   ├── cache_utils.module.ts
|   |   ├── cache_module.ts
|   |   ├── logging.ts
│   └── customLogger/
│       ├── custom_logger.service.ts
│       ├── custom_logger.module.ts
├── app.module.ts
├── app.controller.spec.ts
├── app.service.ts
├── main.ts
└── tests/
    ├── app.e2e-spec.ts
    └── jest.e2e.json
```

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Olusoga/shortlet-test
   cd shortlet-test
```
```
2. **Installation**
   ```bash
   npm install
   ```
   
3. **Environment Configuration**
  - `REDIS_HOST=your_redis_host`
  - `REDIS_PORT=your_redis_port`
  - `REDIS_PASSWORD=your_redis_password`
  - `PORT=your_port`
   
## Running Application
  
1. **Start Development Server**
```bash
   npm run start:dev
```
2. **Build Application**
 ```bash
   npm run build
   ```
3. **Run the Production Server**
```bash
   npm run start:prod
   ```
## Running with Docker
1. **Build Docker Image**
```bash
  docker build -t shortlet-test .
```
2. **Run Docker Container**
```bash
  docker run -p 3000:3000 shortlet-test
```
## Testing
To run tests, use the following commands:
```bash
  npm test
```
## Deployment
The application is deployed on Render. You can find the live API here, https://shortlet-test.onrender.com/.

## Documentation
Comprehensive API documentation is available and generated using OpenAI's tools. You can access it here, https://shortlet-test.onrender.com/api#/.

## Postman Documentation
Example API usage and endpoints are documented in Postman. You can access the Postman documentation here: https://documenter.getpostman.com/view/19781070/2sA3rwNuMM.

## Contributing
Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Todo
I had a lot of fun building this but there are some improvements I can still make:

- Add more test cases
- Have a standard response helper
- Include a makefile to ease the execution of some common tasks
- Health Checks and Auto-healing: Implement health checks and auto-healing mechanisms to ensure high -  availability.
## License
This project is licensed under the MIT License.