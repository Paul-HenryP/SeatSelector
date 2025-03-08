FROM openjdk:21-slim AS builder
WORKDIR /seatselector

# Install required utilities
RUN apt-get update && apt-get install -y findutils && rm -rf /var/lib/apt/lists/*

# Copy the Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Make the gradlew script executable
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

# Final stage
FROM openjdk:21-slim
WORKDIR /seatselector
COPY --from=builder /seatselector/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]