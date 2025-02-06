class lokio < Formula
  desc 'Deskripsi aplikasi kamu'
  homepage 'https://github.com/any-source/lokio'
  url 'https://github.com/any-source/lokio/releases/download/0.0.2/lokio-darwin-x64.tar.gz'
  sha256 "ce011b9379f3a34b140659a6ab973527e4645f5a23c54b7451584034d5d14381"

  def install
    bin.install 'lokio'
  end

  test do
    system "\#{bin}/lokio", '--version'
  end
end
