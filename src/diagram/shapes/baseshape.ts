import * as p5 from 'p5';
import { IShape } from "./ishape";
import { Diagram } from '../diagram';

export abstract class BaseShape implements IShape {
    id: string;
    color: string;
    connectionSize: number;
    isSelected: boolean = false;

    abstract connectionPoints: { x: number, y: number }[];

    constructor(public name: string, public x: number, public y: number, public w: number, public h: number) {
        this.id = 'u' + Math.floor(Math.random() * 899999 + 100000);
        this.color = '#cccccc';
        this.connectionSize = 8;

    }

    hovered(p: p5): boolean {
        let hovering = this.x - this.connectionSize < p.mouseX
            && this.x + this.w + this.connectionSize > p.mouseX
            && this.y - this.connectionSize < p.mouseY
            && this.y + this.h + this.connectionSize > p.mouseY;

        return hovering;
    }

    draw(diagram: Diagram) {
        // Drawing the selection mark

        if (this.hovered(diagram.p) || this.isSelected) {
            diagram.p.noFill();
            diagram.p.strokeWeight(1);
            diagram.canvas.drawingContext.setLineDash([5, 5]);
            diagram.p.rectMode("corner");
            diagram.p.rect(this.x - this.connectionSize / 2, this.y - this.connectionSize / 2, this.w + this.connectionSize, this.h + this.connectionSize);
            diagram.canvas.drawingContext.setLineDash([]);
        }

        // drawing the connectionpoints
        if (this.hovered(diagram.p) || diagram.state == 'CONNECTION') {
            diagram.p.noFill();
            this.connectionPoints.forEach(cp => {
                let p = { x: this.x + this.w * cp.x, y: this.y + this.h * cp.y }
                diagram.p.strokeWeight(this.connectionSize);
                diagram.p.point(p.x, p.y);
                if (diagram.p.dist(p.x, p.y, diagram.p.mouseX, diagram.p.mouseY) <= this.connectionSize) {
                    diagram.p.strokeWeight(1);
                    diagram.p.ellipse(p.x, p.y, this.connectionSize * 2)
                }
            });

            diagram.p.strokeWeight(1);
        }
    }

    snap(gridSize: number) {
        if (Math.round(this.x % gridSize / gridSize) == 1) {
            this.x += gridSize - this.x % gridSize;
        } else {
            this.x -= this.x % gridSize;
        }
        if (Math.round(this.y % gridSize / gridSize) == 1) {
            this.y += gridSize - this.y % gridSize;
        } else {
            this.y -= this.y % gridSize;
        }
        if (Math.round(this.w % gridSize / gridSize) == 1) {
            this.w += gridSize - this.w % gridSize;
        } else {
            this.w -= this.w % gridSize;
        }
        if (Math.round(this.h % gridSize / gridSize) == 1) {
            this.h += gridSize - this.h % gridSize;
        } else {
            this.h -= this.h % gridSize;
        }
    }
}