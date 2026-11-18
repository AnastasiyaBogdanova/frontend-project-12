install:
	npm ci

build:
	npm run build

start:
	npx start-server -s ./dist -p $${PORT:-5001}

develop:
	npm run dev