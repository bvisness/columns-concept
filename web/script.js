const frames = document.querySelector('#frames');

var templates = {
    frame: makeTemplateCloner("frame")
};

function pushFrame(type, name, packageName = null) {
	const frame = templates.frame();

	if (type === 'package') {
		const package = packages.find(p => p.name === name);
		const allThings = [
			...(package.vars || []),
			...(package.types || []),
			...(package.funcs || []),
		];
		allThings.sort((a, b) => a.sort - b.sort);

		const allText = allThings.map(t => t.text).join('\n');

		frame.title.textContent = `package ${name}`;
		frame.contents.innerHTML = format(allText, name);
	} else if (type === 'var') {
		let varPackageName = packageName;

		const parts = name.split('.');
		if (parts.length > 1) {
			varPackageName = parts[0];
		}

		const package = packages.find(p => p.name === varPackageName);

		const allText = [
			`package ${packageName}\n`,
			...(package.vars || []).map(v => v.text),
		].join('\n');

		frame.title.textContent = `variables in package ${varPackageName}`;
		frame.contents.innerHTML = format(allText, varPackageName);
	} else if (type === 'type') {
		let typePackageName = packageName;
		let typeName = name;

		const parts = name.split('.');
		if (parts.length > 1) {
			typePackageName = parts[0];
			typeName = parts[1];
		}

		const package = packages.find(p => p.name === typePackageName);
		const type = package.types.find(t => t.name === typeName);

		if (type.isInterface) {
			const implementers = package.types.filter(t => (t.implements || []).includes(typeName));

			const allText = [
				`package ${typePackageName}\n`,
				type.text,
				'<span class="note">Implemented by...</span>\n',
				...implementers.map(t => `[[${t.name} / type ${t.name}]]`),
			].join('\n');

			frame.title.textContent = `type ${typeName}`;
			frame.contents.innerHTML = format(allText, typePackageName);
		} else {
			const methods = (package.funcs || []).filter(m => m.receiverType === typeName);
			methods.sort((a, b) => a.sort - b.sort);

			let allItems = [
				`package ${typePackageName}\n`,
			];

			if (type.implements) {
				const implements = type.implements.map(t => `[[${t} / type ${t}]]`).join(', ');
				allItems.push(`<span class="note">Implements: ${implements}</span>`);
			}

			allItems = allItems.concat([
				type.text,
				...methods.map(m => m.text),
			]);

			const allText = allItems.join('\n');

			frame.title.textContent = `type ${typeName}`;
			frame.contents.innerHTML = format(allText, typePackageName);
		}
	} else if (type === 'func') {
		let funcPackageName = packageName;
		let funcName = name;

		const parts = name.split('.');
		if (parts.length > 1) {
			funcPackageName = parts[0];
			funcName = parts[1];
		}

		const package = packages.find(p => p.name === funcPackageName);

		const nameParts = funcName.split(':');
		if (nameParts.length > 1) {
			// it's a method
			pushFrame('type', nameParts[0], package.name);
			return;
		} else {
			const func = package.funcs.find(f => f.name === funcName);

			const allText = [
				`package ${funcPackageName}\n`,
				func.text,
			].join('\n');

			frame.title.textContent = `func ${funcName}`;
			frame.contents.innerHTML = format(allText, funcPackageName);
		}
	}

	frames.appendChild(frame.root);
}

function format(text, package) {
	text = text.replace(/\[\[([a-zA-Z]+) +\/ +([a-z]+) +([a-zA-Z.:]+)\]\]/gm, `<a href="javascript:pushFrame('$2', '$3', '${package}')">$1</a>`);
	text = text.replace(/\n/gm, '<br>');
	text = text.replace(/\t/gm, '<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>');
	text = text.replace(/<<[^>]+>>/gm, '');

	return text;
}
