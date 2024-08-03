# REST Countries API Integration

This project implements a REST API using NestJS and TypeScript that integrates data from the REST Countries API. The API provides various endpoints to retrieve and process country data, including caching strategies and comprehensive documentation. The project follows clean code principles, SOLID design principles, and includes both unit and integration tests.

## Project Overview

The API is designed to fetch data from the REST Countries API and expose it through several endpoints with enhanced functionalities like pagination, filtering, sorting, and caching. Key features include:

- **Caching**: Using Redis to cache API responses for improved performance.
- **Testing**: Comprehensive unit tests for services and integration tests for controllers.
- **Documentation**: Generated API documentation using OpenAI's tools.
- **Deployment**: Hosted on Render and source code managed via GitLab.

## Project Structure

- **src**
  - **modules**
    - **countries**
      - `countries.controller.ts` - Handles HTTP requests related to countries.
      - `countries.service.ts` - Contains business logic for processing country data.
      - **dto**
        - `country-query.dto.ts` - Data Transfer Object for country queries.
        - `country-details.dto.ts` - Data Transfer Object for country details.
    - **cache**
      - `cache.service.ts` - Manages caching using Redis.
    - **config**
      - `config.module.ts` - Configuration settings.
    - **common**
      - `custom-logger.service.ts` - Custom logging service.
    - `app.module.ts` - Main application module.
  - `main.ts` - Entry point of the application.

## Installation

1. **Clone the Repository**

   ```bash
   git clone <your-gitlab-repo-url>
   cd <project-directory>
```
```
2. **Install dependecies**
   ```bash
   npm install
```