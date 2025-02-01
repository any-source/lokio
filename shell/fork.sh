#!/bin/bash

# Hentikan jika ada error
set -e

# Tambahkan remote upstream jika belum ada
if ! git remote | grep -q "upstream"; then
  git remote add upstream https://github.com/any-source/lokio.git
  echo "Upstream remote added."
fi

# Ambil perubahan terbaru dari repository asli
git fetch upstream

# Checkout ke main dan gabungkan perubahan dari upstream
git checkout main
git merge upstream/main --no-edit

# Push perubahan ke repository fork di GitHub
git push origin main

echo "Fork updated successfully!"
