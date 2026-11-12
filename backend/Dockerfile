
# Single-stage build: Maven build and Java runtime in the same image
FROM maven:3.9.9-eclipse-temurin-21

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Backend port
EXPOSE 8081

# Start the Spring Boot application
ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]
