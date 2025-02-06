class Lokio < Formula
  desc 'Lokio CLI tool'
  homepage 'https://github.com/any-source/homebrew-lokio'
  version '0.0.2'
  url 'https://github.com/any-source/homebrew-lokio/releases/download/v0.0.2/lokio-darwin-x64.tar.gz'
  sha256 "e337e22fd232e4a3745c865baf6c27e55ea516ac21c9d846f4e3bcf2ff42bcf6"

  def install
    if Hardware::CPU.arm?
      bin.install 'lokio' => 'lokio'
    else
      bin.install 'lokio-x64' => 'lokio'
    end
  end

  test do
    assert_match "0.0.2", shell_output("\#{bin}/lokio --version")
  end
end
