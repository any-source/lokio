# Makefile
.PHONY: build bundle clean

# Bundle data files first
bundle:
	@echo "📦 Bundling data files..."
	@bun run cmd/_.ts
	@echo "✅ Bundle completed!"

# Clean previous builds
clean:
	@echo "🧹 Cleaning previous builds..."
	@rm -rf public/bin
	@mkdir -p public/bin
	@echo "✅ Clean completed!"

# Main build process
build: clean bundle
	@echo "🚀 Building project..."
	@bun build bin/main.ts --outfile=public/bin/lokio --compile
	@bun build bin/main.ts --outfile=public/bin/lokio.exe --compile
	@echo "✅ Build completed!"

push:
	@echo "🚀 Running push.sh..."
	@chmod +x ./shell/push.sh
	@./shell/push.sh

fork:
	@echo "🚀 Running fork.sh..."
	@chmod +x ./shell/fork.sh
	@./shell/fork.sh

clean:
	@echo "🧹 Cleaning up..."
	@rm -rf public/bin/lokio public/bin/lokio.exe
	@echo "✅ Clean completed!"

# Lokio init
lokio:
	@public/bin/lokio

# Check version
lokio-v:
	@public/bin/lokio -v

# Information
lokio-i:
	@public/bin/lokio i

# Create new project
lokio-c:
	@public/bin/lokio c

# Make file
lokio-m:
	@public/bin/lokio m

# Format
format:
	@bun run format
