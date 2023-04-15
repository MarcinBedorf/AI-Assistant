export { Effect };
import { Particle } from './Particle';

class Effect {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.particlesArray = [];
		this.mainImage = document.getElementById('main-img');
		this.centerX = this.width * 0.5;
		this.centerY = this.height * 0.5;
		this.x = this.centerX - this.mainImage.width * 0.5;
		this.y = this.centerY - this.mainImage.height * 0.5;
		this.gap = 3;
	}
	init(context) {
		context.drawImage(this.mainImage, this.x, this.y);
		const pixels = context.getImageData(0, 0, this.width, this.height).data;
		for (let y = 0; y < this.height; y += this.gap) {
			for (let x = 0; x < this.width; x += this.gap) {
				const index = (y * this.width + x) * 4;
				const red = pixels[index];
				const green = pixels[index + 1];
				const blue = pixels[index + 2];
				const alpha = pixels[index + 3];
				const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

				if (alpha > 0) {
					this.particlesArray.push(new Particle(this, x, y, color));
				}
			}
		}
	}
	draw(context) {
		this.particlesArray.forEach(particle => particle.draw(context));
	}
	update() {
		this.particlesArray.forEach(particle => particle.update());
	}
	warp() {
		this.particlesArray.forEach(particle => particle.warp());
	}
	clear() {
		this.particlesArray.splice(0, this.particlesArray.length);
	}
}
