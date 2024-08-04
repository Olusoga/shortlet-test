# REST Countries API Integration

This project implements a REST API using NestJS and TypeScript that integrates data from the REST Countries API. The API provides various endpoints to retrieve and process country data, including caching strategies and comprehensive documentation. The project follows clean code principles, SOLID design principles, and includes both unit and integration tests.

## Project Overview

The API is designed to fetch data from the REST Countries API and expose it through several endpoints with enhanced functionalities like pagination, filtering, sorting, and caching. Key features include:

- **Caching**: Using Redis to cache API responses for improved performance.
- **Testing**: Comprehensive unit tests for services and integration tests for controllers.
- **Documentation**: Generated API documentation using OpenAI's tools.
- **Deployment**: Hosted on Render and source code managed via GitLab.

## Project Structure

```plaintext
src/
├── common/
|   ├──filters/
|   |   └── http-exception.filter.ts
│   ├── axios/
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
|   |   ├── cach_module.ts
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
   git clone https://gitlab.com/shoga1/shortlet-test.git
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
## Deployment
The application is deployed on Render. You can find the live API here, https://shortlet-test.onrender.com/.

## Documentation
Comprehensive API documentation is available and generated using OpenAI's tools. You can access it here, https://shortlet-test.onrender.com/api#/.

## Testing
To run tests, use the following commands:
```bash
  npm test
```
## Technical Specifications
## Frameworks and Libraries
- NestJS: A progressive Node.js framework for building efficient and scalable    server-side applications.
- TypeScript: A strict syntactical superset of JavaScript that adds optional static typing.
- Redis: An in-memory data structure store, used as a database, cache, and message broker.
- Winston: A logger for Node.js applications.

## Key Features
- Caching: Implemented using Redis to cache API responses for faster data retrieval and reduced load on the REST Countries API.
- Rate Limiting: Middleware to prevent abuse by limiting the number of requests a  client can make.
- CORS Middleware: Ensuring secure cross-origin requests.
- Exception Handling: Centralized HTTP exception filter for consistent error responses.
- Custom Logger: Using Winston for detailed logging and tracking.
- Metrics: Monitoring API performance and usage using Prometheus and Grafana.
- Unit and Integration Tests: Ensuring code quality and reliability.

## Contributing
Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.