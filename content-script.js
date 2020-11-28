/* --- 素材ページに来たらbackgroundにコモンズIDとタイトルを送信する --- */
if (typeof browser === 'undefined') browser = chrome;
const page_url = location.href.replace('https://').replace('http://');
if (page_url.startsWith('commons.nicovideo.jp/material') && !page_url.startsWith('commons.nicovideo.jp/material/agreement')) {
	const sending = browser.runtime.sendMessage({
		material_id    : 'nc2525',
		material_title : '素晴らしい素材'
	});
}
