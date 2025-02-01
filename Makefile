# Makefile

push:
	@echo "🚀 Running push.sh..."
	@./shell/push.sh

fork:
	@echo "🚀 Running fork.sh..."
	@./shell/fork.sh

build:
	@echo "🚀 Building project..."
	@bun build bin/main.ts --outfile=public/bin/lokio --compile
	@bun build bin/main.ts --outfile=public/bin/lokio.exe --compile
	@echo "✅ Build completed!"

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
