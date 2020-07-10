from flask import Flask, request, jsonify
from mutagen.oggvorbis import OggVorbis

app = Flask(__name__)


@app.route('/', methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
def index(path=""):
    if request.method == 'POST':
        myfile = request.files.get('myfile')
        ogg = OggVorbis(myfile)
        d = dict()
        for k, v in ogg.items():
            d[k] = v
        print(d)
        return jsonify(d)
