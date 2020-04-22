const frames = document.querySelector('#frames');

var templates = {
    frame: makeTemplateCloner("frame")
};

function pushFrame(type, name) {
	const frame = templates.frame();

	if (type === 'package') {
		const package = packages.find(p => p.name === name);
		const allThings = [
			...(package.vars || []),
			...(package.types || []),
			...(package.funcs || []),
		];
		allThings.sort((a, b) => a.sort - b.sort);
		console.log(allThings);

		const allText = allThings.map(t => t.text).join('\n');

		frame.title.textContent = `package ${name}`;
		frame.contents.innerHTML = format(allText);
		console.log(format(allText));
	}

	frames.appendChild(frame.root);
}

function format(text) {
	text = text.replace(/\[\[[^\]]+\]\]/gm, '!!blah!!');
	text = text.replace(/\n/gm, '<br>');
	text = text.replace(/\t/gm, '<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>');

	return text;
}
