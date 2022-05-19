
if (typeof browser === 'undefined') browser = chrome;

/* --- オプションの初期値を保存 --- */
browser.storage.local.get(['file_pattern'], options => {
	if (!options['file_pattern']) {
		browser.storage.local.set({
			file_pattern  : '${id}_${title}',
			copy_title    : false,
			title_pattern : '${title} (${id})'
		});
	}
});


/* --- ヘッダの書き換え --- */
// browser.webRequest.onHeadersReceived.addListener(details => {
// 	/* 組み立てに必要な情報を入手 */
// 	const info_filename    = /filename="(.+)(\.\w{1,20})"/.exec(getResponseHeader(details, 'Content-Disposition'));
// 	const material_id      = info_filename[1];
// 	const material_ext     = info_filename[2];
// 	const material_title   = sessionStorage.getItem('commons-title-'+material_id);
// 	const material_creator = sessionStorage.getItem('commons-creator-'+material_id);
// 	/* タイトルや作者が正常にキャッシュされていたか確認 */
// 	if (String(material_title) === 'null' || String(material_creator) === 'null') {
// 		return {
// 			responseHeaders: details.responseHeaders,
// 		};
// 	}
// 	/* 各種情報を組み立てて反映 */
// 	const material_name = replaceSpecialChars(localStorage.getItem('file_pattern').replace('${id}', material_id).replace('${title}', material_title).replace('${creator}', material_creator));
// 	setResponseHeader(details, 'Content-Disposition', 'attachment; filename="'+encodeURI(material_name)+material_ext+'"; filename*=UTF-8\'\''+encodeURI(material_name)+material_ext);

// 	return {
// 		responseHeaders: details.responseHeaders,
// 	};
// }, {
// 	urls: ['https://deliver.commons.nicovideo.jp/download/*', 'http://deliver.commons.nicovideo.jp/download/*'],
// }, [
// 	'responseHeaders',
// 	'blocking'
// ]);


/* --- 拡張機能の各要素からのメッセージに反応する --- */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	/* IDとタイトルのキャッシュを作成する */
	if (message.content === 'material-id') {
		sessionStorage.setItem('commons-title-'+message.material_id, replaceSpecialChars(message.material_title));
		sessionStorage.setItem('commons-creator-'+message.material_id, replaceSpecialChars(message.material_creator));
		// console.log('commons-title-'+message.material_id, replaceSpecialChars(message.material_title));
	}
	/* オプションを送り返す */
	if (message.content === 'get-option') {
		browser.storage.local.get(['file_pattern', 'copy_title', 'title_pattern'], options => {
			sendResponse({
				'file-pattern'  : options['file_pattern'],
				'copy-title'    : options['copy_title'],
				'title-pattern' : options['title_pattern']
			});
		});
		return true;
	}
	/* オプションを設定する */
	if (message.content === 'set-option') {
		browser.storage.local.set({
			file_pattern  : message['file-pattern'],
			copy_title    : message['copy-title'],
			title_pattern : message['title-pattern']
		});
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
		name  : key,
		value : val,
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
		'|' : '｜',
		'.' : '．',
		',' : '，'
	};
	for (let char in chars) {
		filename = filename.replace(char, chars[char]);
	}
	return filename;
}
