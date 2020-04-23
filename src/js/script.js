const container = document.getElementById('container');
const favoriteList = document.getElementById('favorite-list');
const modalWindow = document.getElementById('movie-details-modal')

const blocks = document.getElementById('blocks').innerHTML;
const favorite = document.getElementById('favorite').innerHTML;
const modalTemplate = document.getElementById('movie-details-template').innerHTML;

renderFavoriteList();

async function fetchData(url, genre) {
	const data = {};
	const response = await fetch(url);
	data.blocks = await response.json();
	if (genre) {
		const newData = {};
		newData.blocks = data.blocks.filter(el => {
			return el.genres.some(e => e.toLowerCase() == genre.toLowerCase());
		})
		renderTemplates(blocks, newData, container);
		return;
	}
	renderTemplates(blocks, data, container)
}

fetchData('http://my-json-server.typicode.com/moviedb-tech/movies/list ');

container.addEventListener('click', (e) => {
	const card = e.target.closest('.card');
	const btn = e.target.closest('.addFavorite')

	if (!card) return;

	if (!container.contains(card)) return;

	if(btn) {
		(async function() {
				const response = await fetch(`http://my-json-server.typicode.com/moviedb-tech/movies/list/${card.dataset.id}`)
				const data = await response.json();
				const item = {
					id: data.id,
					name: data.name,
				}
				const icon = btn.firstElementChild;
				addFavoriteMovie(item, icon);
				renderFavoriteList();
			}
		)()
		return;
	}

	(async function() {
			const response = await fetch(`http://my-json-server.typicode.com/moviedb-tech/movies/list/${card.dataset.id}`)
			const data = await response.json();
			modalWindow.style.display = 'block';
			renderTemplates(modalTemplate, data, modalWindow);

			const closeBtn = document.querySelector('.close');

			closeBtn.addEventListener('click', () => {
				modalWindow.style.display = 'none';
				modalWindow.innerHTML = '';
			})
		})()
})

function addFavoriteMovie(item, icon) {
	let data = localStorage.getItem('favorite-list');
	if(!data) {
		const moviesArray = [item];
		toggleItemIcon(icon, 'far', 'fas');
		localStorage.setItem('favorite-list', JSON.stringify(moviesArray));
	}
	if(data) {
		const moviesArray = JSON.parse(data);
		if(moviesArray.every(el => el.id !== item.id)) {
			toggleItemIcon(icon, 'far', 'fas');
			moviesArray.push(item);
			localStorage.setItem('favorite-list', JSON.stringify(moviesArray));
			return;
		}
		removeFavoriteMovie(moviesArray, item, 'favorite-list');
		toggleItemIcon(icon, 'fas', 'far');
	}
}

function removeFavoriteMovie(arr, element, LocalStorageKey) {
	const newArr = arr.filter(el => el.id !== +element.id );
	localStorage.setItem(LocalStorageKey, JSON.stringify(newArr));
}

function renderTemplates(template, context, container) {
	const templates = Handlebars.compile(template);
	const html = templates(context);
	container.innerHTML = html;
}

function renderFavoriteList() {
	const context = {};
	const data = localStorage.getItem('favorite-list');
	context.list = JSON.parse(data);
	renderTemplates(favorite, context, favoriteList)
	favoriteList.addEventListener('click', (e) => {
		const btn = e.target.closest('.remove-movie');

		if (btn) {
			removeFavoriteMovie(context.list, btn.dataset, 'favorite-list');
			renderFavoriteList();
		}
	})
}

function toggleItemIcon(el, removeClass, addClass) {
	el.classList.remove(removeClass);
	el.classList.add(addClass);
}

// Movies filter

const selectGenre = document.querySelector('.choose-genre');
selectGenre.addEventListener('change', (e) => {
	fetchData('http://my-json-server.typicode.com/moviedb-tech/movies/list', e.target.value);
})
