# Makefile

# Output directory
OUT_DIR=public/artifacts

build-npm:
	@bun build bin/main.ts --outdir bin --target bun --minify

build-binary: build-bin-windows build-bin-linux build-bin-mac
	@echo "🚀 Builds for all platforms completed!"

build-bin-windows:
	@bun build --compile --target=bun-windows-x64 bin/main.ts --outfile=$(OUT_DIR)/windows.exe	

build-bin-linux:
	@bun build --compile --target=bun-linux-x64 bin/main.ts --outfile=$(OUT_DIR)/linux

build-bin-mac:
	@bun build --compile bin/main.ts --outfile=$(OUT_DIR)/macos	
	@bun build --compile --target=bun-darwin-x64 bin/main.ts --outfile=$(OUT_DIR)/macos-intel	
	@bun build --compile --target=bun-darwin-arm64 bin/main.ts --outfile=$(OUT_DIR)/macos-chip

clean-bin:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf $(OUT_DIR)/*
	@echo "✅ Build artifacts cleaned!"

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
	@bun run helper/patch.ts && make build-npm && npm publish && make push && git push

npm-release-minor:
	@bun run helper/minor.ts && make build-npm && npm publish && make push && git push

npm-release-major:
	@bun run helper/major.ts && make build-npm && npm publish && make push && git push