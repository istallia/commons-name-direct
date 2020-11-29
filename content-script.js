/* --- 素材ページに来たらbackgroundにコモンズIDとタイトルを送信する --- */
if (typeof browser === 'undefined') browser = chrome;
const page_url = location.href.replace('https://', '').replace('http://', '');
if (page_url.startsWith('commons.nicovideo.jp/material') && !page_url.startsWith('commons.nicovideo.jp/material/agreement')) {
	const material_title = document.querySelector('div.commons_title').innerText;
	const material_id    = page_url.slice(29).replace('/', '');
	let sending = browser.runtime.sendMessage({
		content        : 'material-id',
		material_id    : material_id,
		material_title : material_title
	});
	console.log(material_id, material_title);
}
