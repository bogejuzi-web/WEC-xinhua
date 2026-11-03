"""Local prototype preview; Markdown is always read from its original file."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse

ROOT = Path(__file__).resolve().parent
VERSION = ROOT.parent
DOCUMENTS = {
    "业务流程图.md", "接口数据对照.md",
    "新华健康权益对接标准接口(1).md", "保单管理接口文档V1.0.docx",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path.startswith('/version-docs/'):
            name = path[len('/version-docs/'):]
            if name not in DOCUMENTS:
                self.send_error(404)
                return
            source = VERSION / name
        elif path == '/reference/adr.md':
            source = VERSION.parents[1] / 'ADR/2026-11-02-新华对接讨论确认记录.md'
        else:
            return super().do_GET()
        try:
            content = source.read_bytes()
        except OSError:
            self.send_error(404, 'Source document unavailable')
            return
        self.send_response(200)
        mime = self.guess_type(str(source))
        if source.suffix == '.md':
            mime = 'text/plain; charset=utf-8'
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def list_directory(self, path):
        self.send_error(404)
        return None


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=4194)
    args = parser.parse_args()
    print(f'Prototype: http://127.0.0.1:{args.port}/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
