# 必要なファイルをzipに収めてパッケージング(?)するちょい役ツール

# --- 必要なモジュールをインポート``
import os
import zipfile

# --- 前回のzipがあれば削除
zip_name = 'commons-name-direct.zip'
if os.path.exists(zip_name):
	os.remove(zip_name)

# --- 必要なファイルを放り込んでまとめる
with zipfile.ZipFile(zip_name, 'w', compression=zipfile.ZIP_DEFLATED) as new_zip:
	new_zip.write('manifest.json')
	new_zip.write('LICENSE')
	new_zip.write('background.js')
	new_zip.write('content-script.js')
	new_zip.write('icon_32.png')
	new_zip.write('icon_48.png')
	new_zip.write('icon_128.png')

input('Complete.')
