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
if (page_url.startsWith('commons.nicovideo.jp/works/nc') && !page_url.startsWith('commons.nicovideo.jp/works/agreement')) {
	/* backgroundにコモンズIDとタイトル、制作者、拡張子を送信する */
	let sendData = () => {
		const element_title   = document.querySelector('div.titleArea > h1');
		const element_creator = document.querySelector('a.userName > span.name');
		if (element_title === null || element_creator === null) {
			setTimeout(sendData, 200);
			return;
		}
		const material_title   = element_title.innerText;
		const material_creator = element_creator.innerText;
		const script_tags      = [... document.getElementsByTagName('script')];
		let material_ext       = '';
		script_tags.forEach( elem => {
			const matches = /"ext":"(\w+)"/.exec(elem.innerText);
			if (matches !== null) {
				material_ext = matches[1];
			}
		} );
		const material_id = page_url.slice(26).replace('/', '').replace(/\?.+$/g, '').replace(/\#.+$/g, '');
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
let title_pattern_option = '';
document.addEventListener('DOMContentLoaded', () => {
	if (page_url.startsWith('commons.nicovideo.jp/works/agreement/nc')) {
		let asking_options = browser.runtime.sendMessage({content : 'get-option'}, options => {
			if (options['copy-title']) {
				title_pattern_option = options['title-pattern'];
				setTimeout(procRegistCopyEvent, 200);
			}
		});
	}
});
const procRegistCopyEvent = () => {
	const button = document.querySelector('form.buttonForm > button');
	if (button == null)
	{
		setTimeout(procRegistCopyEvent, 200);
		return;
	}
	let func = (pattern, event) => {
		const material_id      = page_url.slice(39).replace('/', '').replace(/\?.+$/g, '').replace(/\#.+$/g, '');
		const material_title   = sessionStorage.getItem('commons-title-'+material_id);
		const material_creator = sessionStorage.getItem('commons-creator-'+material_id);
		const copy_text        = pattern.replace('${id}', material_id).replace('${title}', material_title).replace('${creator}', material_creator);
		navigator.clipboard.writeText(copy_text);
	};
	button.addEventListener('click', func.bind(this, title_pattern_option));
};


/* --- httpsに誘導する --- */
if (location.href.slice(4,5) !== 's') location.href = 'https://' + location.href.slice(7);
