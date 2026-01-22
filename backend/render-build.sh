#!/usr/bin/env bash
# Render build script

echo "🔨 Building Spring Boot application..."

# Build the application
./mvnw clean package -DskipTests

echo "✅ Build complete!"
