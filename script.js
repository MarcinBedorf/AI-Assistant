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
	});
});
