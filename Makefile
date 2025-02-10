# Variabel
NAME=lokio
VERSION=1.0.3
BUILD_DIR=build
SRC_DIR=bin

# Platform targets
DARWIN_TARGETS=darwin-x64 darwin-arm64
LINUX_TARGETS=linux-x64 linux-arm64
WINDOWS_TARGETS=win-x64

# Tools
BUN=bun

# Default target
all: clean setup build package

# Setup project
setup:
	@echo "Installing dependencies..."
	@$(BUN) install

# Build binary
build:
	@echo "Building binary..."
	@mkdir -p $(BUILD_DIR)
	@$(BUN) build $(SRC_DIR)/main.ts --compile --outfile=$(BUILD_DIR)/$(NAME)

# Package binaries
package: build
	@echo "Packaging binaries..."
	@cd $(BUILD_DIR) && cp $(NAME) $(NAME)-base
	
	# Darwin builds
	@cd $(BUILD_DIR) && cp $(NAME)-base $(NAME)-darwin && \
		zip $(NAME)-darwin-x64.zip $(NAME)-darwin && \
		zip $(NAME)-darwin-x64-profile.zip $(NAME)-darwin && \
		zip $(NAME)-darwin-x64-baseline.zip $(NAME)-darwin && \
		zip $(NAME)-darwin-x64-baseline-profile.zip $(NAME)-darwin
	
	@cd $(BUILD_DIR) && cp $(NAME)-base $(NAME)-darwin-arm && \
		zip $(NAME)-darwin-aarch64.zip $(NAME)-darwin-arm && \
		zip $(NAME)-darwin-aarch64-profile.zip $(NAME)-darwin-arm
	
	# Linux builds
	@cd $(BUILD_DIR) && cp $(NAME)-base $(NAME)-linux && \
		zip $(NAME)-linux-x64.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-profile.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-baseline.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-baseline-profile.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-musl.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-musl-profile.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-musl-baseline.zip $(NAME)-linux && \
		zip $(NAME)-linux-x64-musl-baseline-profile.zip $(NAME)-linux
	
	@cd $(BUILD_DIR) && cp $(NAME)-base $(NAME)-linux-arm && \
		zip $(NAME)-linux-aarch64.zip $(NAME)-linux-arm && \
		zip $(NAME)-linux-aarch64-profile.zip $(NAME)-linux-arm && \
		zip $(NAME)-linux-aarch64-musl.zip $(NAME)-linux-arm && \
		zip $(NAME)-linux-aarch64-musl-profile.zip $(NAME)-linux-arm
	
	# Windows builds
	@cd $(BUILD_DIR) && cp $(NAME)-base $(NAME)-windows.exe && \
		zip $(NAME)-windows-x64.zip $(NAME)-windows.exe && \
		zip $(NAME)-windows-x64-profile.zip $(NAME)-windows.exe && \
		zip $(NAME)-windows-x64-baseline.zip $(NAME)-windows.exe && \
		zip $(NAME)-windows-x64-baseline-profile.zip $(NAME)-windows.exe
	
	# Cleanup temporary files
	@cd $(BUILD_DIR) && rm $(NAME)-base $(NAME)-darwin $(NAME)-darwin-arm $(NAME)-linux $(NAME)-linux-arm $(NAME)-windows.exe
	
	# Generate checksums
	@cd $(BUILD_DIR) && shasum -a 256 *.zip > SHASUMS256.txt

# Clean build artifacts
clean:
	@echo "Cleaning build directory..."
	@rm -rf $(BUILD_DIR)
	@mkdir -p $(BUILD_DIR)

# Install globally
install: all
	@echo "Installing globally..."
	@sudo cp $(BUILD_DIR)/$(NAME) /usr/local/bin/$(NAME)
	@sudo chmod +x /usr/local/bin/$(NAME)

.PHONY: all setup build package clean install

# 📤 Upload ke GitHub Releases
release:
	@echo "📤 Mengunggah rilis ke GitHub..."
	@gh release create v$(VERSION) $(BUILD_DIR)/*.zip $(BUILD_DIR)/SHASUMS256.txt \
		--title "Release v$(VERSION)" \
		--notes "Release version $(VERSION)" \
		--draft=false \
		--prerelease=false

push:
	@echo "🚀 Running push.sh..."
	@chmod +x ./shell/push.sh
	@./shell/push.sh

# Format
format:
	@bun run format

fork:
	@echo "🚀 Running fork.sh..."
	@chmod +x ./shell/fork.sh
	@./shell/fork.sh

npm-update-version-patch:
	@bun run helper/patch.ts

npm-publish-patch:
	@bun run build && npm publish && make push && git push

npm-update-version-minor:
	@bun run helper/minor.ts

npm-publish-minor:
	@bun run build && npm publish && make push && git push

npm-update-version-major:
	@bun run helper/major.ts

npm-publish-major:
	@bun run build && npm publish && make push && git push