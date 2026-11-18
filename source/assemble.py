from pathlib import Path
import base64, json
root=Path(__file__).resolve().parent
files=[root/'assets'/('screen-%02d.jpg'%i) for i in range(2,9)]+[root/'assets'/name for name in ['town.webp','stats-original.jpg','info-original.jpg']]+[root/'assets'/(name+suffix) for name in ['post-win','victory','stats'] for suffix in ['-poster.jpg','.mp4']]
mime={'.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'}
art={p.stem:'data:'+mime[p.suffix]+';base64,'+base64.b64encode(p.read_bytes()).decode('ascii') for p in files}
html=(root/'template.html').read_text(encoding='utf-8')
html=html.replace('/* STYLES */',(root/'style.css').read_text(encoding='utf-8'))
html=html.replace('/* SCRIPT */','const ART = '+json.dumps(art)+';\n'+(root/'app.js').read_text(encoding='utf-8'))
target=root.parent/'index.html'
target.write_text(html,encoding='utf-8')
print(target)
