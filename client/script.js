import { Effect } from './js/Effect';
import bot from './assets/bot.png';
import user from './assets/user.svg';

window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const effect = new Effect(canvas.width, canvas.height);
	effect.init(ctx);

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		effect.draw(ctx);
		effect.update();
		requestAnimationFrame(animate);
	}
	animate();

	const warpBtn = document.getElementById('btn-warp');
	warpBtn.addEventListener('click', function () {
		effect.warp();

		this.classList.add('invisible');

		let isAnimating = true;
		function fadeOut() {
			ctx.globalAlpha -= 0.01;
			if (ctx.globalAlpha > 0 && isAnimating) {
				requestAnimationFrame(fadeOut);
			} else {
				effect.clear();
			}
		}
		fadeOut();

		setTimeout(() => {
			isAnimating = false;
		}, 3000);
		document.getElementById('app').style.display = 'flex';
	});
});

document.getElementById('app').style.display = 'none';
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
	element.textContent = '';

	loadInterval = setInterval(() => {
		element.textContent += '.';
		if (element.textContent === '....') {
			element.textContent = '';
		}
	}, 300);
}

function typeText(element, text) {
	let index = 0;

	let interval = setInterval(() => {
		if (index < text.length) {
			element.innerHTML += text.charAt(index);
			index++;
		} else {
			clearInterval(interval);
		}
	}, 20);
}

function generateUniqueID() {
	const timestamp = Date.now();
	const randomNumber = Math.random();
	const hexadecimalString = randomNumber.toString(16);

	return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
	return `
		<div class="wrapper ${isAi && 'ai'}">
			<div class="chat">
				<div class="profile">
					<img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}"/>
				</div>
				<div class="message" id="${uniqueId}">${value}</div>
			</div>
		</div>
		`;
}

const handleSubmit = async e => {
	e.preventDefault();
	const data = new FormData(form);
	if (!data.get('prompt').trim()) {
		return;
	}
	chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
	form.reset();
	const uniqueId = generateUniqueID();
	chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
	chatContainer.scrollTop = chatContainer.scrollHeight;
	const messageDiv = document.getElementById(uniqueId);
	loader(messageDiv);

	const response = await fetch('https://assistant-1zh2.onrender.com', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt: data.get('prompt'),
		}),
	});

	clearInterval(loadInterval);
	messageDiv.innerHTML = ' ';

	if (response.ok) {
		const data = await response.json();
		const parsedData = data.bot.trim();
		typeText(messageDiv, parsedData);
	} else {
		const err = await response.text();
		messageDiv.innerHTML = 'Something went wrong';
		alert(err);
	}
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		handleSubmit(e);
	}
});
