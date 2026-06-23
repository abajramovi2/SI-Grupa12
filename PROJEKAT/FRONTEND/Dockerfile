FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Railway should use production endpoints; local docker-compose overrides this to development.
ARG BUILD_CONFIGURATION=production
RUN npm run build -- --configuration ${BUILD_CONFIGURATION}

# Install http-server to serve the static files
RUN npm install -g http-server

# Railway dynamically assigns PORT via env variable
EXPOSE ${PORT:-4200}

# Generate public runtime configuration from Railway variables, then serve the app.
CMD ["sh", "-c", "printf 'window.__TIM12_CONFIG__ = { apiUrl: \"%s\", keycloakUrl: \"%s\" };\\n' \"${API_URL:-https://backend-production-5561.up.railway.app/api}\" \"${KEYCLOAK_URL:-}\" > dist/TIM12Frontend/browser/runtime-config.js && exec http-server dist/TIM12Frontend/browser -p ${PORT:-4200} -a 0.0.0.0"]
