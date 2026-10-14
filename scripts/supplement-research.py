import subprocess,json,base64,pathlib,datetime
root=pathlib.Path(__file__).resolve().parents[1]
files=[('cocos2d/cocos2d-x','licenses/LICENSE_cocos2d-x.txt'),('NVIDIAGameWorks/NvCloth','NvCloth/license.txt'),('aseprite/aseprite','EULA.txt'),('Luanti-org/luanti','COPYING.LESSER'),('bevyengine/bevy','LICENSE-MIT')]
out=[]
for repo,path in files:
 result=subprocess.run(['gh','api',f'repos/{repo}/contents/{path}'],capture_output=True,text=True)
 data=json.loads(result.stdout) if result.returncode==0 else {'error':result.stderr}
 if 'content' in data:data={'repo':repo,'path':path,'url':data['html_url'],'sha':data['sha'],'text':base64.b64decode(data['content']).decode('utf-8','replace')}
 out.append(data)
(root/'docs/research/supplemental-licenses.json').write_text(json.dumps({'collected_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':out},indent=2))
