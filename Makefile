# Makefile

# Output directory
OUT_DIR=public/artifacts

build: format
	@bun build bin/main.ts --outdir bin --target bun --minify

build-binary:
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
	@bun run helper/patch.ts && make build && npm publish && make push && git push

npm-release-minor:
	@bun run helper/minor.ts && make build && npm publish && make push && git push

npm-release-major:
	@bun run helper/major.ts && make build && npm publish && make push && git push