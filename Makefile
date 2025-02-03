# Makefile

# Output directory
OUT_DIR=public/artifacts

build: format
	@bun build bin/main.ts --outdir bin --target bun --minify

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