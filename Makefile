# Nama aplikasi dan versi
APP_NAME=lokio
VERSION=0.0.4
BINARY_PATH_MAC=store/brew/$(APP_NAME)
TAR_FILE=store/brew/$(APP_NAME)-darwin-x64.tar.gz
FORMULA_DIR=Formula
RB_FILE=$(FORMULA_DIR)/$(APP_NAME).rb
GITHUB_USER_AND_REPO=any-source/lokio
TAP_REPO=any-source/homebrew-lokio
TAP_DIR=homebrew-lokio

# 🚀 Build dan Package
.PHONY: build package-mac shasum brew-setup brew-release brew-install help update-tap

build: package-mac shasum brew-setup ## Build binary dan buat package tar.gz

package-mac: ## Build binary untuk macOS (ARM64 dan x64)
	@echo "📦 Building binary untuk macOS..."
	@mkdir -p store/brew
	@echo "Building untuk ARM64..."
	@bun build --compile --minify --target=bun-darwin-arm64 bin/main.ts --outfile $(BINARY_PATH_MAC)
	@echo "Building untuk x64..."
	@bun build --compile --minify --target=bun-darwin-x64 bin/main.ts --outfile $(BINARY_PATH_MAC)-x64
	@tar -czvf $(TAR_FILE) -C store/brew $(APP_NAME) $(APP_NAME)-x64

shasum: ## Menghitung SHA256 dari binary
	@echo "🔑 Menghitung SHA256 dari $(TAR_FILE)..."
	@SHA256_HASH=$$(shasum -a 256 $(TAR_FILE) | awk '{ print $$1 }'); \
	echo "SHA256: $$SHA256_HASH"; \
	sed -i '' "s|sha256 \".*\"|sha256 \"$$SHA256_HASH\"|" $(RB_FILE)

# 🏗️ Setup Homebrew Formula
brew-setup: ## Membuat formula Homebrew
	@echo "📝 Menyiapkan formula Homebrew..."
	@mkdir -p $(FORMULA_DIR)
	@SHA256_HASH=$$(shasum -a 256 $(TAR_FILE) | awk '{ print $$1 }'); \
	echo "class Lokio < Formula" > $(RB_FILE); \
	echo "  desc 'Lokio CLI tool'" >> $(RB_FILE); \
	echo "  homepage 'https://github.com/$(GITHUB_USER_AND_REPO)'" >> $(RB_FILE); \
	echo "  version '$(VERSION)'" >> $(RB_FILE); \
	echo "  url 'https://github.com/$(GITHUB_USER_AND_REPO)/releases/download/v$(VERSION)/$(APP_NAME)-darwin-x64.tar.gz'" >> $(RB_FILE); \
	echo "  sha256 \"$$SHA256_HASH\"" >> $(RB_FILE); \
	echo "" >> $(RB_FILE); \
	echo "  def install" >> $(RB_FILE); \
	echo "    if Hardware::CPU.arm?" >> $(RB_FILE); \
	echo "      bin.install '$(APP_NAME)' => '$(APP_NAME)'" >> $(RB_FILE); \
	echo "    else" >> $(RB_FILE); \
	echo "      bin.install '$(APP_NAME)-x64' => '$(APP_NAME)'" >> $(RB_FILE); \
	echo "    end" >> $(RB_FILE); \
	echo "  end" >> $(RB_FILE); \
	echo "" >> $(RB_FILE); \
	echo "  test do" >> $(RB_FILE); \
	echo "    assert_match \"$(VERSION)\", shell_output(\"\#{bin}/$(APP_NAME) --version\")" >> $(RB_FILE); \
	echo "  end" >> $(RB_FILE); \
	echo "end" >> $(RB_FILE)

# 📤 Upload ke GitHub Releases
brew-release: ## Upload tar.gz ke GitHub Releases
	@echo "📤 Mengunggah rilis ke GitHub..."
	@gh release create v$(VERSION) $(TAR_FILE) \
		--title "Release v$(VERSION)" \
		--notes "Release version $(VERSION)" \
		--draft=false \
		--prerelease=false

update-tap: ## Update formula in tap repository and submit to Homebrew
	@echo "🔄 Updating formula in tap repository..."
	@if [ ! -d "$(TAP_DIR)" ]; then \
		git clone git@github.com:$(TAP_REPO).git || (echo "Failed to clone repository" && exit 1); \
	fi
	@cd $(TAP_DIR) && \
		git pull || true && \
		mkdir -p Formula && \
		cp ../$(RB_FILE) Formula/ && \
		git add . && \
		if [ -n "$$(git status --porcelain)" ]; then \
			git commit -m "Update $(APP_NAME) formula to v$(VERSION)" && \
			git push; \
		else \
			echo "No changes to commit"; \
		fi
	@echo "📤 Submit the pull request to Homebrew to include your tap."
	@echo "To do this, go to: https://github.com/Homebrew/homebrew-core/pulls and submit a pull request for your tap repository."

# 🔄 Instalasi & Update
brew-install: ## Install aplikasi dari Homebrew
	brew tap $(TAP_REPO)
	brew install $(APP_NAME)

# 📚 Help
help: ## Menampilkan daftar perintah Makefile
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'