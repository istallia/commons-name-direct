/* --- 素材ページに来たら色々と細工する --- */
if (typeof browser === 'undefined') browser = chrome;
const page_url = location.href.replace('https://', '').replace('http://', '');
if (page_url.startsWith('commons.nicovideo.jp/material') && !page_url.startsWith('commons.nicovideo.jp/material/agreement')) {
	/* backgroundにコモンズIDとタイトルを送信する */
	const material_title    = document.querySelector('div.commons_title').innerText;
	const material_id       = page_url.slice(29).replace('/', '');
	let sending_material_id = browser.runtime.sendMessage({
		content        : 'material-id',
		material_id    : material_id,
		material_title : material_title
	});
	// console.log(material_id, material_title);
	/* backgroundにオプションを問い合わせ、コピー機能がtrueならばボタンにイベントを登録する */
	let asking_options = browser.runtime.sendMessage({content : 'get-option'}, options => {
		if (options['copy-title']) {
			let func = (pattern, event) => {
				console.log('ボタンがクリックされたらしい。');
				console.log(pattern);
			};
			document.querySelector("#material_left > div.commons_preview > div.commons_download > table > tbody > tr > td > div.center > a > input[type=image]").addEventListener('click', func.bind(this, options['title-pattern']));
		}
	});
}
