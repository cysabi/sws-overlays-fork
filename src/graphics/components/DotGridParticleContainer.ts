import { Application, Graphics, Particle, ParticleContainer, Rectangle } from 'pixi.js';

export class DotGridParticleContainer extends ParticleContainer {

    readonly particles: Particle[] = [];
    readonly gridSize: [number, number];

    constructor(app: Application, dotRadius: number) {
        super({
            dynamicProperties: {
                vertex: true
            }
        });

        const dotGraphics = new Graphics({
            width: dotRadius,
            height: dotRadius
        });
        dotGraphics.circle(0, 0, dotRadius).fill(0xFFFFFF);
        const dotTexture = app.renderer.generateTexture({ target: dotGraphics });

        const dotCountX = Math.ceil(app.renderer.width / dotRadius);
        const dotCountY = Math.ceil(app.renderer.height / dotRadius);
        const dotOffsetX = -((dotCountX * dotRadius - app.renderer.width) / 2) + dotRadius / 2;
        const dotOffsetY = -((dotCountY * dotRadius - app.renderer.height) / 2) + dotRadius / 2;

        for (let i = 0; i < dotCountX; i++) {
            for (let j = 0; j < dotCountY; j++) {
                const particle = new Particle({
                    texture: dotTexture,
                    x: dotRadius * i + dotOffsetX,
                    y: dotRadius * j + dotOffsetY,
                    scaleX: 0,
                    scaleY: 0,
                    anchorX: 0.5,
                    anchorY: 0.5
                });
                this.addParticle(particle);
                this.particles.push(particle);
            }
        }

        this.gridSize = [dotCountX, dotCountY];
        this.boundsArea = new Rectangle(0, 0, app.renderer.width, app.renderer.height);
    }
}
