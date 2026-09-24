# ======================================================
# DEVOPS NOTEBOOK — FIRST DOCKERFILE
# ======================================================
#
# Dockerfile contains instructions used to build
# a Docker image.
#
# Flow:
#
# Dockerfile
#     ↓
# docker build
#     ↓
# Docker image
#
# ======================================================


# ------------------------------------------------------
# 1. Base image
# ------------------------------------------------------

FROM node:22-alpine


# ------------------------------------------------------
# 2. Working directory
# ------------------------------------------------------

WORKDIR /app


# ------------------------------------------------------
# 3. Copy dependency files
# ------------------------------------------------------

COPY package*.json ./


# ------------------------------------------------------
# 4. Install dependencies
# ------------------------------------------------------

RUN npm ci


# ------------------------------------------------------
# 5. Copy application source code
# ------------------------------------------------------

COPY . .


# ------------------------------------------------------
# 6. Document the port
# ------------------------------------------------------

EXPOSE 5000


# ------------------------------------------------------
# 7. Start application
# ------------------------------------------------------

CMD ["npm", "start"]














# docker build -t devops-demo-api .
# # docker build
#     ↓
# Build an image

# -t devops-demo-api
#     ↓
# Give the image a name

# .
#     ↓
# Use the current directory as build context

# Port Bindings
# docker run -p 5000:5000 devops-demo-api
#     YOUR COMPUTER             CONTAINER
#      │                        │
#  localhost:5000  ───────→  :5000


# Detached mode 
# docker run -d -p 5000:5000 --name devops-demo-api-container devops-demo-api

# What -d means

# -d = detached mode

# Instead of:

# Terminal
#    ↓
# Docker container
#    ↓
# Terminal remains occupied

# you get:

# Terminal
#    ↓
# Docker starts container
#    ↓
# Terminal immediately available


# docker run
#     → create + start container

# -d
#     → detached/background mode

# --name
#     → gives the container a human-readable name

# docker ps
#     → shows currently running containers

# docker ps -a
#     → shows running + stopped containers


# e.g. -> docker logs devops-demo-api-container
# docker logs <container>
#     → show container logs



# e.g. -> docker logs -f devops-demo-api-container
# docker logs -f <container>
#     → continuously follow logs

# Ctrl + C while using docker logs -f
#     → stop watching logs
#     → container keeps running



# e.g. -> docker stop devops-demo-api-container
# docker stop <container>
#     ↓
# Running container
#     ↓
# Stopped container

# Important:
# STOP ≠ DELETE

# The container still exists.


# docker run
#     → creates a NEW container
#     → starts it

# docker start
#     → starts an EXISTING stopped container




# docker restart devops-demo-api-container

# This is essentially:

# STOP
#  ↓
# START



# docker exec
#     ↓
# Execute a command inside an existing
# RUNNING container.

# docker exec -it <container> sh
#     ↓
# Open an interactive shell.

# -i
#     → interactive

# -t
#     → terminal

# sh
#     → shell inside the container

# exit
#     → leave the shell
#     → DOES NOT stop the container

# e.g.
# docker exec -it devops-demo-api-container sh

# Then:

# pwd
# ls
# node --version
# exit


# docker exec devops-demo-api-container env

# You'll see many environment variables.

# docker run -d -p 5000:5000 --name devops-demo-api-container -e PORT=5000 devops-demo-api

# Environment Variable
#     =
# configuration provided outside application code

# Example:

# PORT=5000
# NODE_ENV=development
# DATABASE_URL=...

# Node.js reads it using:

# process.env.PORT
# process.env.NODE_ENV
# process.env.DATABASE_URL


# LOCAL
# .env
#  ↓
# dotenv
#  ↓
# process.env.PORT


# DOCKER
# docker run -e PORT=5000
#  ↓
# process.env.PORT



# Why shouldn't we put secrets in Dockerfile?

# ❌ Don't do:

# ENV DB_PASSWORD=myPassword123

# Why?

# Because the Dockerfile becomes part of your image/build history and potentially your source repository.

# Instead:

# Secret
#   ↓
# CI/CD secret store / hosting environment
#   ↓
# Container environment
#   ↓
# process.env.SECRET



# It shows Docker's detailed information about the container
# docker inspect devops-demo-api-container

# 1. Get the container IP
# docker inspect -f "{{.NetworkSettings.IPAddress}}" devops-demo-api-container

# 2. Check environment variables
# docker inspect -f "{{range .Config.Env}}{{println .}}{{end}}" devops-demo-api-container

# 3. Check port mapping
# docker port devops-demo-api-container



# Docker CLI:

# docker build
# docker run
# docker stop
# docker rm
# ...

# Docker Compose:

# compose.yaml
#      ↓
# docker compose up
#      ↓
# services start together


# docker compose up

# keeps your terminal attached to the Compose logs.

# Just like docker run -d, Compose has detached mode:

# docker compose up -d

# You'll get something similar to:

# [+] Running 1/1
#  ✔ Container devops-demo-api  Started

# Now your terminal is free.



# docker ps
#     ↓
# "What containers are running?"

# docker compose ps
#     ↓
# "What services in THIS Compose project are running?"



# docker compose up
#     → start services
#     → attach to logs

# docker compose up -d
#     → start services
#     → detached/background mode

# docker compose ps
#     → show Compose services

# docker compose logs
#     → show service logs

# docker compose logs -f
#     → follow logs

# docker compose down
#     → stop + remove Compose containers



# Docker Compose creates a network
# for services in the same Compose project.

# Service-to-service communication:

# API → mongo:27017

# NOT:

# API → localhost:27017




# FROM WINDOWS:
# localhost:27017
#        ↓
# MongoDB container


# FROM API CONTAINER:
# mongo:27017
#        ↓
# MongoDB container



# Docker Compose creates a network
# for services in the same Compose project.

# Service-to-service communication:

# API → mongo:27017

# NOT:

# API → localhost:27017



# Rebuild the Docker image

# Because we changed:

# package.json
# package-lock.json
# src/

# we need a new image.

# Run:

# docker compose build

# Then:

# docker compose up -d
# Step  — Check the API logs

# Run:

# docker compose logs api

# You want to see:

# MongoDB connected
# Server running on port: 5000

# This proves:

# API container
#      │
#      │ mongodb://mongo:27017
#      ↓
# MongoDB container

# is working.


# YAML is indentation-sensitive.

# services:
#   api:       ← service
#   mongo:     ← service
#   redis:     ← service

# All three belong directly to `services`.

# A wrong indentation can change the structure
# of the entire Compose configuration.

# Healthchecks tell Docker whether a service is responding; they don't magically make your application fault-tolerant. Your Redis fallback code and MongoDB error handling are still valuable


# Validate before starting

# This is an excellent habit:

# docker compose config

# If there's no validation error:

# docker compose down

# Then:

# docker compose up -d --build

# Check:

# docker compose ps


# Docker healthcheck
#         ↓
# Is the service actually responding?
#         ↓
# healthy / unhealthy

# depends_on without healthcheck:

# Start order

# depends_on + healthcheck condition:

# Start dependency
#       ↓
# Wait until healthy
#       ↓
# Start API