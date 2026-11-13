install:
	npm ci

build:
	npm run build

start:
	px start-server -s ./dist -p $${PORT:-5001}

develop:
	npm run dev