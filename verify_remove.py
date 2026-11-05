import os, re

html = open('index.html', encoding='utf-8').read()
js = open('script.js', encoding='utf-8').read()

js_ids = set(re.findall(r"getElementById\(['\"](.*?)['\"]\)", js))
missing_ids = [i for i in sorted(js_ids) if f'id="{i}"' not in html]
print('Missing IDs in HTML:', missing_ids)
print('papa-tribute-wrapper in html:', 'papa-tribute-wrapper' in html)
print('Check completed successfully!')

