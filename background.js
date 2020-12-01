/* --- オプションの初期値を保存 --- */
if (!localStorage.getItem('file_pattern')) {
	localStorage.setItem('file_pattern', '${id}_${title}');
	localStorage.setItem('copy_title', false);
	localStorage.setItem('title_pattern', '${title} (${id})');
}

/* --- ヘッダの書き換え --- */
if (typeof browser === 'undefined') browser = chrome;
browser.webRequest.onHeadersReceived.addListener(details => {
	const info_filename  = /filename="(.+)(\.\w{1,20})"/.exec(getResponseHeader(details, 'Content-Disposition'));
	const material_id    = info_filename[1];
	const material_ext   = info_filename[2];
	const material_title = sessionStorage.getItem('commons-'+material_id);
	const material_name  = replaceSpecialChars(localStorage.getItem('file_pattern').replace('${id}', material_id).replace('${title}', material_title));
	setResponseHeader(details, 'Content-Disposition', 'attachment; filename="'+encodeURI(material_name)+material_ext+'"; filename*=UTF-8\'\''+encodeURI(material_name)+material_ext);

	return {
		responseHeaders: details.responseHeaders,
	};
}, {
	urls: ['https://deliver.commons.nicovideo.jp/download/*', 'http://deliver.commons.nicovideo.jp/download/*'],
}, [
	'responseHeaders',
	'blocking'
]);

/* --- 拡張機能の各要素からのメッセージに反応する --- */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	/* IDとタイトルのキャッシュを作成する */
	if (message.content === 'material-id') {
		sessionStorage.setItem('commons-'+message.material_id, replaceSpecialChars(message.material_title));
		// console.log('commons-'+message.material_id, replaceSpecialChars(message.material_title));
	}
	/* オプションを送り返す */
	if (message.content === 'get-option') {
		sendResponse({
			'file-pattern'  : localStorage.getItem('file_pattern'),
			'copy-title'    : (localStorage.getItem('copy_title') === 'true'),
			'title-pattern' : localStorage.getItem('title_pattern')
		});
		return true;
	}
	/* オプションを設定する */
	if (message.content === 'set-option') {
		localStorage.setItem('file_pattern', message['file-pattern']);
		localStorage.setItem('copy_title', message['copy-title']);
		localStorage.setItem('title_pattern', message['title-pattern']);
	}
});

/* --- details.responseHeaders内のレスポンスヘッダを更新する関数 --- */
function setResponseHeader(details, key, val) {
	key = key.toLowerCase();
	for (let n in details.responseHeaders) {
		const got = details.responseHeaders[n].name.toLowerCase() == key;
		if (got) {
			details.responseHeaders[n].value = val;
			return;
		}
	}
	details.responseHeaders.push({
		name: key,
		value: val,
	});
}

/* --- レスポンスヘッダを取得 --- */
function getResponseHeader(details, key) {
	key = key.toLowerCase();
	for (let n in details.responseHeaders) {
		const got = details.responseHeaders[n].name.toLowerCase() == key;
		if (got) {
			return details.responseHeaders[n].value;
		}
	}
	return null;
}

/* --- ファイル名に使えない文字を全角に直す --- */
function replaceSpecialChars(filename) {
	const chars = {
		'\\' : '＼',
		'/' : '／',
		':' : '：',
		'*' : '＊',
		'?' : '？',
		'<' : '＜',
		'>' : '＞',
		'|' : '｜'
	};
	for (let char in chars) {
		filename = filename.replace(char, chars[char]);
	}
	return filename;
}
