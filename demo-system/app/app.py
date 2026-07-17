from flask import Flask
import logging

logging.basicConfig(
    filename="logs/app.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

app = Flask(__name__)

@app.get("/")
def health():
    logging.info("Health endpoint called")
    return {
        "status": "running"
    }

if __name__ == "__main__":
    logging.info("Server started")
    app.run(
        host="0.0.0.0",
        port=5000
    )