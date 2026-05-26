.PHONY: install dev dev-db dev-api dev-ui setup-local build deploy stop clean

# ─── Install ──────────────────────────────────────────────
install:
	cd backend && npm install
	cd space-filled-site && npm install
	cd cdk && npm install

# ─── Local Development ────────────────────────────────────
# Starts everything: DynamoDB Local, backend API, Angular dev server
dev: dev-db setup-local
	@echo ""
	@echo "Starting backend API on :8841 and Angular on :8842..."
	@echo "Admin password: admin"
	@echo ""
	$(MAKE) -j2 dev-api dev-ui

dev-db:
	@echo "Starting DynamoDB Local on :8840..."
	docker compose up -d dynamodb-local
	@sleep 2

setup-local:
	cd backend && npm run setup-local

dev-api:
	cd backend && npm start

dev-ui:
	cd space-filled-site && npm start

stop:
	docker compose down

# ─── Build ────────────────────────────────────────────────
build: build-backend build-frontend

build-backend:
	cd backend && npm run build
	cp backend/package.json backend/dist/package.json
	cd backend/dist && npm install --omit=dev --no-package-lock --silent

build-frontend:
	cd space-filled-site && node_modules/.bin/ng build

# ─── Deploy ───────────────────────────────────────────────
# Reads secrets from .env file (ADMIN_PASSWORD, JWT_SECRET)
# Override with env vars if needed: ADMIN_PASSWORD=xxx make deploy
-include .env
export ADMIN_PASSWORD JWT_SECRET

deploy: build
	@if [ -z "$$ADMIN_PASSWORD" ]; then echo "Error: ADMIN_PASSWORD not set"; exit 1; fi
	@if [ -z "$$JWT_SECRET" ]; then echo "Error: JWT_SECRET not set"; exit 1; fi
	cd cdk && npx cdk deploy --require-approval never --profile personal

# ─── Cleanup ──────────────────────────────────────────────
clean:
	rm -rf backend/dist backend/.local-images
	rm -rf space-filled-site/dist
	rm -rf cdk/dist cdk/cdk.out
	docker compose down
