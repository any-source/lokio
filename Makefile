# Nama aplikasi dan versi
APP_NAME=lokio
VERSION=0.0.2
BINARY_PATH_MAC=store/brew/$(APP_NAME)
TAR_FILE=store/brew/$(APP_NAME)-darwin-x64.tar.gz
RB_FILE=store/brew_rb/$(APP_NAME).rb
GITHUB_USER_AND_REPO=any-source/lokio
GITHUB_SSH_LINK=git@github.com:any-source/lokio.git

# 🚀 Build dan Package
build: package-mac shasum brew-setup ## Build binary dan buat package tar.gz

package-mac: ## Build binary dan buat file tar.gz
	@echo "📦 Building binary untuk macOS..."
	@mkdir -p store/brew
	@bun build --compile --minify --target=bun-darwin-arm64 bin/main.ts --outfile $(BINARY_PATH_MAC)
	@tar -czvf $(TAR_FILE) -C store/brew $(APP_NAME)

shasum: ## Menghitung SHA256 dari binary
	@echo "🔑 Menghitung SHA256 dari $(TAR_FILE)..."
	@SHA256_HASH=$$(shasum -a 256 $(TAR_FILE) | awk '{ print $$1 }'); \
	echo "SHA256: $$SHA256_HASH"; \
	sed -i '' "s|sha256 ''|sha256 \"$$SHA256_HASH\"|" $(RB_FILE)

# 🏗️ Setup Homebrew Formula
brew-setup: ## Membuat formula Homebrew
	@echo "📝 Menyiapkan formula Homebrew..."
	@mkdir -p store/brew
	@SHA256_HASH=$$(shasum -a 256 $(TAR_FILE) | awk '{ print $$1 }'); \
	echo "class $(APP_NAME) < Formula" > $(RB_FILE); \
	echo "  desc 'Deskripsi aplikasi kamu'" >> $(RB_FILE); \
	echo "  homepage 'https://github.com/$(GITHUB_USER_AND_REPO)'" >> $(RB_FILE); \
	echo "  url 'https://github.com/$(GITHUB_USER_AND_REPO)/releases/download/$(VERSION)/$(APP_NAME)-darwin-x64.tar.gz'" >> $(RB_FILE); \
	echo "  sha256 \"$$SHA256_HASH\"" >> $(RB_FILE); \
	echo "" >> $(RB_FILE); \
	echo "  def install" >> $(RB_FILE); \
	echo "    bin.install '$(APP_NAME)'" >> $(RB_FILE); \
	echo "  end" >> $(RB_FILE); \
	echo "" >> $(RB_FILE); \
	echo "  test do" >> $(RB_FILE); \
	echo "    system \"\#{bin}/$(APP_NAME)\", '--version'" >> $(RB_FILE); \
	echo "  end" >> $(RB_FILE); \
	echo "end" >> $(RB_FILE)

# 📤 Upload ke GitHub Releases
brew-release: ## Upload tar.gz ke GitHub Releases
	@echo "📤 Mengunggah rilis ke GitHub..."
	@gh release create $(VERSION) $(TAR_FILE) --title "Release $(VERSION)" --notes "Rilis versi $(VERSION)"

# 🔄 Instalasi & Update
brew-install: ## Install aplikasi dari Homebrew
	brew tap $(GITHUB_USER_AND_REPO) $(GITHUB_SSH_LINK)
	brew install $(APP_NAME)

brew-update: ## Update aplikasi jika ada versi baru
	brew update
	brew upgrade $(APP_NAME)

# 📚 Help
help: ## Menampilkan daftar perintah Makefile
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
