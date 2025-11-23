from flask import Flask, request, send_file
from mutagen.oggvorbis import OggVorbis
import tempfile

app = Flask(__name__)


@app.route('/', methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
def index(path=""):
    if request.method == 'POST':
        loopstart_val = request.form['loopstart']
        looplength_val = request.form['looplength']
        print('LOOPSTART:', loopstart_val)
        print('LOOPLENGTH:', looplength_val)
        myfile = request.files['myfile']
        tmp = tempfile.NamedTemporaryFile()
        print(tmp.name)
        with open(tmp.name, "wb") as f:
            f.write(myfile.read())
            f.close()
        ogg = OggVorbis(tmp.name)
        ogg['LOOPSTART'] = loopstart_val
        ogg['LOOPLENGTH'] = looplength_val
        ogg.save()
        print(ogg)
        filename = 'loop.ogg'
        return send_file(tmp.name, mimetype='audio/ogg', as_attachment=True, download_name=filename)
