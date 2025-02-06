class lokio < Formula
  desc 'Deskripsi aplikasi kamu'
  homepage 'https://github.com/any-source/lokio'
  url 'https://github.com/any-source/lokio/releases/download/latest/lokio-darwin-x64.tar.gz'
  sha256 ''

  def install
    bin.install 'lokio'
  end

  test do
    system "\#{bin}/lokio", '--version'
  end
end
