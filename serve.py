"""RK Films local preview server — sends no-cache headers so edits show instantly."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, *args):
        pass  # quiet


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), NoCacheHandler)
    print("RK Films preview: http://localhost:8000 (no-cache mode)")
    server.serve_forever()
