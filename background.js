/* --- ヘッダの書き換え --- */
if (typeof browser === 'undefined') browser = chrome;
browser.webRequest.onHeadersReceived.addListener(details => {
	// refererを 'http://example.com/' に書き換え:
	setResponseHeader(details, 'Content-Disposition', 'attachment;');

	return {
		responseHeaders: details.responseHeaders,
	};
}, {
	urls: ['https://deliver.commons.nicovideo.jp/download/*', 'http://deliver.commons.nicovideo.jp/download/*'],
}, [
	'responseHeaders',
	'blocking'
]);

/* --- IDとタイトルのキャッシュを作成する --- */
browser.runtime.onMessage.addListener((message, sender) => {
	sessionStorage.setItem('commons-'+message.material_id, replaceSpecialChars(message.material_title));
	console.log('commons-'+message.material_id, replaceSpecialChars(message.material_title));
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
	chars = ["\\",'/',':','*','?','a',"<",">",'|']
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
