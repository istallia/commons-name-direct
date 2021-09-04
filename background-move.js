/* --- クロスブラウザの違いを吸収 --- */
if (typeof browser === 'undefined') browser = chrome;


/* --- IDでの検索を素材ページに転送 --- */
browser.webRequest.onBeforeRequest.addListener(details => {
	/* 検索キーワードを取得 */
	const url     = new URL(details.url);
	const keyword = url.pathname.split('/').filter(text => text.length > 0).pop();
	/* IDなら転送 */
	if (/^nc\d{1,12}$/i.test(keyword)) {
		url.pathname = '/material/' + keyword;
		return {redirectUrl : url.href};
	}
	return {};
}, {
	urls : ['https://commons.nicovideo.jp/search/keyword/*']
}, ['blocking']);
