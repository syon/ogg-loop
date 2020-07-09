from sanic import Sanic, response
from mutagen.oggvorbis import OggVorbis
import tempfile

app = Sanic()


@app.route('/', methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
async def index(request, path=""):
    if request.method == 'POST':
        loopstart_val = request.form['loopstart']
        looplength_val = request.form['looplength']
        print('LOOPSTART:', loopstart_val)
        print('LOOPLENGTH:', looplength_val)
        print('++++++++++++++++++++++++')
        myfile = request.files.get('myfile')
        tmp = tempfile.NamedTemporaryFile()
        f = open(tmp.name, "wb")
        f.write(myfile.body)
        ogg = OggVorbis(tmp.name)
        ogg['LOOPSTART'] = loopstart_val
        ogg['LOOPLENGTH'] = looplength_val
        ogg.save()
        print(ogg)
        filename = 'your.ogg'
        return await response.file(f.name, mime_type='audio/ogg', filename=filename)
