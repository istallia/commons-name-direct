# コモンズ素材名直送ツール

ニコニ・コモンズで素材をダウンロードしようとするとファイル名がIDだけになる。しかしこれではファイル名からどのような素材なのか判然としない。  
そこでダウンロード時点でファイル名に素材名を付加するようにする。これでダウンロード時に手動で書き換える手間が減る。

## 導入

Chromeウェブストア、およびMozilla開発者センターで配布予定。  
サブスクライブするだけで機能は有効になる。

## 技術解説(兼 開発メモ)

素材ダウンロード時は`https://deliver.commons.nicovideo.jp/download/nc数字/nc数字_素材名.拡張子`のようなURLにアクセスするらしい。  
この時点ではまだ素材名がファイル名に付加されているのだが、なぜか`Content-Disposition`ヘッダでIDのみのファイル名を指定することで台無しにしている。  
そこでこのツールでこのヘッダを除去する。晴れて素材名付きのファイルがダウンロードできる。

ただ、ページ内リンクに使われる`#`や`\`などは一律で`_`に置き換えられてしまう。これが嫌なら自分で素材名を持ってくる必要がある。  
ただ、それをするにはcontent-scriptからbackground側に素材名を持ってくる必要があり、意外と手間がかかる。

参考1: https://memo.appri.me/programming/chromeext-referer-change  
参考2: https://teratail.com/questions/12850
