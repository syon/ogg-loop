#!/usr/bin/env python3
"""
Development API server that loads /api/read and /api/write endpoints
This allows testing Vercel serverless functions locally
"""
from flask import Flask
import sys
import os

# Add api directories to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'read'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'write'))

# Import the endpoint handlers
from read.index import index as read_handler
from write.index import index as write_handler

app = Flask(__name__)

# Register routes
@app.route('/api/read', methods=['POST'])
@app.route('/api/read/', methods=['POST'])
def api_read():
    """Read OGG Vorbis metadata"""
    return read_handler()

@app.route('/api/write', methods=['POST'])
@app.route('/api/write/', methods=['POST'])
def api_write():
    """Write OGG Vorbis metadata"""
    return write_handler()

if __name__ == '__main__':
    print('Starting API development server on http://localhost:3001')
    print('Endpoints:')
    print('  POST /api/read  - Read OGG metadata')
    print('  POST /api/write - Write OGG metadata')
    print('')
    print('This server uses the same code as Vercel serverless functions')
    print('located in /api/read/index.py and /api/write/index.py')
    app.run(host='0.0.0.0', port=3001, debug=True)
