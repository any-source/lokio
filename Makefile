# Makefile
# Makefile for building across multiple platforms

# Output directory
OUT_DIR=public/install

# Default target
build: clean build-all
	@echo "✅ All builds completed!"

# Build for all platforms
build-all: build-windows build-linux build-mac
	@echo "🚀 Builds for all platforms completed!"

# Build for Windows
build-windows:
	@bun build --compile --target=bun-windows-x64 bin/main.ts --outfile=$(OUT_DIR)/windows.exe	

# Build for Linux
build-linux:
	@bun build --compile --target=bun-linux-x64 bin/main.ts --outfile=$(OUT_DIR)/linux
	

# Build for macOS
build-mac:
	@bun build --compile --target=bun-darwin-x64 bin/main.ts --outfile=$(OUT_DIR)/macos-intel	
	@bun build --compile --target=bun-darwin-arm64 bin/main.ts --outfile=$(OUT_DIR)/macos-chip

# Clean build artifacts
clean:
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
