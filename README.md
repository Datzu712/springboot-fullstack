# Spring Boot + Webpack Project / Caso de estudio 1 - U fidelitas

This project is a full-stack application that uses Spring Boot for the backend and Webpack for the frontend.

## Prerequisites

- Java 21
- Node.js
- npm or yarn
- Maven

## Getting Started

### Backend

1. **Build the backend:**

    ```sh
    mvn clean install
    ```

2. **Run the backend:**

    ```sh
    mvn spring-boot:run
    ```

### Frontend

1. **Navigate to the frontend directory:**

    ```sh
    cd frontend
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Build the frontend:**

    ```sh
    npm run build
    ```

4. **For development mode with hot reloading:**

    ```sh
    npm run watch
    ```

## Project Structure

- `src/main/java/com/web/server`: Contains the Spring Boot backend code.
- `frontend`: Contains the frontend code managed by Webpack. The output is saved in `src/main/resources/static`.
- `pom.xml`: Maven configuration file.
- `package.json`: Node.js configuration file.

## Scripts

### Backend

- `mvn clean install`: Builds the backend.
- `mvn spring-boot:run`: Runs the Spring Boot application.

### Frontend

- `npm run build`: Builds the frontend for production.
- `npm run watch`: Builds the frontend in development mode with hot reloading.
- `npm run serve`: Serves the frontend using Webpack Dev Server.

## License

This project is licensed under the MIT License.