/* --- 初期値を設定 --- */
if (typeof browser === 'undefined') browser = chrome;
let file_pattern  = '${id}_${title}';
let copy_title    = false;
let title_pattern = '${title} (${id})';

/* --- フォームに諸々を設定する --- */
document.addEventListener('DOMContentLoaded', () => {
	browser.runtime.sendMessage({content : 'get-option'}, options => {
		/* フォームに現在の設定値を反映する */
		file_pattern  = options['file-pattern'] || file_pattern;
		copy_title    = options['copy-title'] || copy_title;
		title_pattern = options['title-pattern'] || title_pattern;
		document.getElementById('commons_file_pattern').value  = file_pattern;
		document.getElementById('commons_copy_title').checked  = copy_title;
		document.getElementById('commons_title_pattern').value = title_pattern;
		document.getElementById('commons_file_pattern').addEventListener('input', sendOptions);
		document.getElementById('commons_copy_title').addEventListener('change', sendOptions);
		document.getElementById('commons_title_pattern').addEventListener('input', sendOptions);
	});
});

/* --- backgroundに設定値を送る --- */
let sendOptions = () => {
	file_pattern  = document.getElementById('commons_file_pattern').value;
	copy_title    = document.getElementById('commons_copy_title').checked;
	title_pattern = document.getElementById('commons_title_pattern').value;
	browser.runtime.sendMessage({
		'content' : 'set-option',
		'file-pattern' : file_pattern,
		'copy-title' : copy_title,
		'title-pattern' : title_pattern
	});
};
