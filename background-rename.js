
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


/* --- 拡張機能の各要素からのメッセージに反応する --- */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	/* 動的ルールを作成する */
	if (message.content === 'material-id') {
		browser.storage.local.get(['file_pattern', 'copy_title', 'title_pattern', 'rule_id'], options => {
			const rule_id       = Number(options['rule_id'] | '0') + 1;
			const material_name = replaceSpecialChars(options['file_pattern'].replace('${id}', message['material_id']).replace('${title}', message['material_title']).replace('${creator}', message['material_creator']));
			const header_text   = 'attachment; filename="' + encodeURI(material_name) + message['material_ext'] + '"; filename*=UTF-8\'\'' + encodeURI(material_name) + message['material_ext'];
			console.log(material_name);
			console.log(header_text);
			browser.declarativeNetRequest.updateSessionRules({
				addRules : [
					{
						action : {
							responseHeaders : [
								{header:'Content-Disposition', operation:'set', value:header_text}
							],
							type : 'modifyHeaders'
						},
						condition : {
							urlFilter : '*://deliver.commons.nicovideo.jp/download/*',
							resourceTypes : ['main_frame', 'sub_frame']
						},
						id : rule_id
					}
				],
				removeRuleIds : [rule_id]
			});
			browser.storage.local.set({rule_id : rule_id % 10});
		});
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
