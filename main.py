import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 5173

def open_browser():
    time.sleep(1.0)
    webbrowser.open(f"http://localhost:{PORT}")

def main():
    # Setup custom handler that serves files from the current folder
    handler = http.server.SimpleHTTPRequestHandler
    
    # Launch default web browser automatically in a separate thread
    threading.Thread(target=open_browser, daemon=True).start()
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving portfolio locally at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server.")

if __name__ == "__main__":
    main()
