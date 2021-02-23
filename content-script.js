/* --- 素材ページに来たら色々と細工する --- */
if (typeof browser === 'undefined') browser = chrome;
const page_url = location.href.replace('https://', '').replace('http://', '');
if (page_url.startsWith('commons.nicovideo.jp/material') && !page_url.startsWith('commons.nicovideo.jp/material/agreement')) {
	/* backgroundにコモンズIDとタイトル、制作者を送信する */
	let sendData = () => {
		const material_title    = document.querySelector('div.commons_title').innerText;
		const material_creator  = document.querySelector('div.m_user_profile a.userlink').innerText;
		const material_id       = page_url.slice(29).replace('/', '');
		let sending_material_id = browser.runtime.sendMessage({
			content          : 'material-id',
			material_id      : material_id,
			material_title   : material_title,
			material_creator : material_creator
		});
		sessionStorage.setItem('commons-title-'+material_id, material_title);
		sessionStorage.setItem('commons-creator-'+material_id, material_creator);
	};
	sendData();
	document.querySelector('a[href*="/material/agreement/"] > input[type="button"]').addEventListener('click', sendData);
	/* backgroundにオプションを問い合わせ、コピー機能がtrueならばボタンにイベントを登録する */
	let asking_options = browser.runtime.sendMessage({content : 'get-option'}, options => {
		if (options['copy-title']) {
			let func = (pattern, event) => {
				const material_id      = page_url.slice(29).replace('/', '');
				const material_title   = sessionStorage.getItem('commons-title-'+material_id);
				const material_creator = sessionStorage.getItem('commons-creator-'+material_id);
				const copy_text        = pattern.replace('${id}', material_id).replace('${title}', material_title).replace('${creator}', material_creator);
				navigator.clipboard.writeText(copy_text);
			};
			document.querySelector('a[href*="/material/agreement/"] > input[type="button"]').addEventListener('click', func.bind(this, options['title-pattern']));
		}
	});
}


/* --- httpsに誘導する --- */
if (location.href.slice(4,5) !== 's') location.href = 'https://' + location.href.slice(7);
