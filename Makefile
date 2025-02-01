# Makefile

# Main build process
build:
	@echo "🚀 Updating data..."
	@rm -rf public/data   # Hapus folder data lama jika ada
	@mkdir -p public/data  # Buat folder public/data jika belum ada
	@cp -r data/* public/data/   # Salin semua file dari /data ke public/data
	@echo "🔄 Data updated!"
	
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
