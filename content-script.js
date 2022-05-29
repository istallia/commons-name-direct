/*
 * Copyright (C) 2020-2022 istallia
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* --- 素材ページに来たら色々と細工する --- */
if (typeof browser === 'undefined') browser = chrome;
const page_url = location.href.replace('https://', '').replace('http://', '');
if (page_url.startsWith('commons.nicovideo.jp/material/nc') && !page_url.startsWith('commons.nicovideo.jp/material/agreement')) {
	/* backgroundにコモンズIDとタイトル、制作者、拡張子を送信する */
	let sendData = () => {
		const element_title    = document.querySelector('div.materialHeadTitle');
		const element_creator  = document.querySelector('div.mUserProfile a.materialUsername');
		const element_ext      = document.querySelector('table.minfo > tbody > tr:nth-child(1) > td:nth-child(2)');
		if (element_title === null || element_creator === null) {
			setTimeout(sendData, 200);
			return;
		}
		const material_title   = element_title.innerText;
		const material_creator = element_creator.innerText;
		const material_ext     = element_ext.innerText;
		const material_id      = page_url.slice(29).replace('/', '').replace(/\?.+$/g, '').replace(/\#.+$/g, '');
		if (!material_ext) return;
		let sending_material_id = browser.runtime.sendMessage({
			content          : 'material-id',
			material_id      : material_id,
			material_title   : material_title,
			material_creator : material_creator,
			material_ext     : material_ext
		});
		sessionStorage.setItem('commons-title-'+material_id, material_title);
		sessionStorage.setItem('commons-creator-'+material_id, material_creator);
	};
	sendData();
}


/* --- backgroundにオプションを問い合わせ、コピー機能がtrueならばボタンにイベントを登録する --- */
document.addEventListener('DOMContentLoaded', () => {
	if (page_url.startsWith('commons.nicovideo.jp/material/agreement/nc')) {
		let asking_options = browser.runtime.sendMessage({content : 'get-option'}, options => {
			if (options['copy-title']) {
				let func = (pattern, event) => {
					const material_id      = page_url.slice(39).replace('/', '').replace(/\?.+$/g, '').replace(/\#.+$/g, '');
					const material_title   = sessionStorage.getItem('commons-title-'+material_id);
					const material_creator = sessionStorage.getItem('commons-creator-'+material_id);
					const copy_text        = pattern.replace('${id}', material_id).replace('${title}', material_title).replace('${creator}', material_creator);
					navigator.clipboard.writeText(copy_text);
				};
				document.querySelector('form[action^="/material/download/nc"] > div').addEventListener('click', func.bind(this, options['title-pattern']));
			}
		});
	}
});


/* --- httpsに誘導する --- */
if (location.href.slice(4,5) !== 's') location.href = 'https://' + location.href.slice(7);
