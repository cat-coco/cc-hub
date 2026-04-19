# syntax=docker/dockerfile:1
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
COPY pom.xml ./
COPY ch-common/pom.xml ch-common/
COPY ch-security/pom.xml ch-security/
COPY ch-user/pom.xml ch-user/
COPY ch-content/pom.xml ch-content/
COPY ch-interaction/pom.xml ch-interaction/
COPY ch-qa/pom.xml ch-qa/
COPY ch-stats/pom.xml ch-stats/
COPY ch-notification/pom.xml ch-notification/
COPY ch-web/pom.xml ch-web/
RUN mvn -B -q -e -T 1C dependency:go-offline || true
COPY . .
RUN mvn -B -q -DskipTests -T 1C package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /src/ch-web/target/ch-web.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar app.jar"]
