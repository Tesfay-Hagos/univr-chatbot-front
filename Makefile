.PHONY: install dev build start lint clean

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Start production server
start:
	npm run start

# Run linting
lint:
	npm run lint

# Clean build artifacts and node_modules
clean:
	rm -rf .next node_modules
