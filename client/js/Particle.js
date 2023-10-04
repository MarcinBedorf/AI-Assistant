export default class Particle {
	constructor(effect, x, y, color) {
		this.effect = effect;
		this.x = Math.random() * this.effect.width;
		this.y = Math.random() * this.effect.height * 15;
		this.originX = Math.floor(x);
		this.originY = Math.floor(y);
		this.color = color;
		this.size = this.effect.gap;
		this.vx = 0;
		this.vy = 0;
		this.ease = 0.09;
		this.friction = 0.8;
	}
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.size, this.size);
	}
	update() {
		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
	}
	warp() {
		this.vx = Math.random() * 2 - 1;
		this.vy = Math.random() * 2 - 1;
		this.originX += this.vx * (this.effect.width * 2);
		this.originY += this.vy * (this.effect.height * 2);
		this.ease = 0.01;
	}
}
