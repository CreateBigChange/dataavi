install:
	npm install --global babel-cli
	npm install babel-preset-react

build:
	babel --presets react ./da/public/src --watch --out-dir ./da/public/build


