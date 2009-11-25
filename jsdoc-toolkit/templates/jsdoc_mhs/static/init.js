var contentGetter = function(liElement) {
	return liElement.firstChild.firstChild.data;
};

new ListFilter(
		document.getElementById("classPattern"),
		document.getElementById("classList"),
		contentGetter
);

new ListFilter(
		document.getElementById("globalsPattern"),
		document.getElementById("globalsList"),
		contentGetter
);