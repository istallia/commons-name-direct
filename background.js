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

/* details.requestHeaders内のレスポンスヘッダを更新する関数 */
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

/* レスポンスヘッダを取得 */
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
