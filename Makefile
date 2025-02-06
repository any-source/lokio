# Makefile
run: 
	@rm -rf test/main.js
	@bun build --minify bin/main.ts --outfile test/main.js --target bun
	@echo "cd test && bun run main.js"
	
npm: 
	@rf -rf bin/main.js
	@bun build --minify bin/main.ts --outfile bin/main.js --target bun

# Output directory
build:
	@rm -rf exce
	@bun build --compile --minify --target=bun-linux-x64 bin/main.ts --outfile exce/linux
	@upx --best --lzma exce/linux
	@bun build --compile --minify --target=bun-darwin-arm64 bin/main.ts --outfile exce/mac
	@bun build --compile --minify --target=bun-windows-x64 bin/main.ts --outfile exce/windows.exe
	@upx --best --lzma exce/windows.exe

size:
	@du -sh exce/linux exce/mac exce/windows.exe

push:
	@echo "🚀 Running push.sh..."
	@chmod +x ./shell/push.sh
	@./shell/push.sh

build-js: format
	@bun build bin/main.ts --outdir bin --target bun --minify

fork:
	@echo "🚀 Running fork.sh..."
	@chmod +x ./shell/fork.sh
	@./shell/fork.sh

# Lokio init
lokio:
	@public/bin/lokio

# Format
format:
	@bun run format


npm-release-patch:
	@bun run helper/patch.ts && make npm && npm publish && make push && git push

npm-release-minor:
	@bun run helper/minor.ts && make npm && npm publish && make push && git push

npm-release-major:
	@bun run helper/major.ts && make npm && npm publish && make push && git push