import * as p5 from 'p5';
import { DiagramState } from '../../misc/diagramstate';
import { Renderer2D } from '../../misc/renderer2d';
import { ConnectionPoint } from '../../misc/connectionpoint';
import { IShape } from './ishape';

export abstract class BaseShape<T> implements IShape {
    id: string;
    color: string;
    connectionSize: number;
    isSelected: boolean = false;
    shouldSnap: boolean = true;

    customProperties: { [group: string]: undefined | {[prop in keyof T]?: 'text' | 'number' | 'longtext'|'color' } } = {};

    abstract connectionPoints: { x: number, y: number }[];

    constructor(public name: string, public x: number, public y: number, public w: number, public h: number) {
        this.id = 'u' + Math.floor(Math.random() * 899999 + 100000);
        this.color = '#cccccc';
        this.connectionSize = 8;
    }

    getConnectionLocation(index: number): ConnectionPoint {
        let c = this.connectionPoints[index];
        return {
            x: this.x + this.w * c.x,
            y: this.y + this.h * c.y,
            id: this.id,
            index: index,
            direction: {
                x: ((this.x + this.w * c.x) - (this.x + this.w / 2)) / (this.w / 2),
                y: ((this.y + this.h * c.y) - (this.y + this.h / 2)) / (this.h / 2)
            }
        };
    }

    isOverConnection(x: number, y: number, p5: p5): ConnectionPoint | false {

        let connection = this.connectionPoints.map((c, i) => {
            return {
                x: this.x + this.w * c.x,
                y: this.y + this.h * c.y,
                id: this.id,
                index: i,
                direction: {
                    x: ((this.x + this.w / 2) - this.x + this.w * c.x) / (this.w / 2),
                    y: ((this.y + this.h / 2) - this.y + this.h * c.y) / (this.h / 2)
                }
            }
        }).filter(p => Math.abs(p5.dist(p5.mouseX, p5.mouseY, p.x, p.y)) <= this.connectionSize);
        return connection.length > 0 ? connection[0] : false;
    }

    hovered(p: p5): boolean {
        let hovering = this.x - this.connectionSize < p.mouseX
            && this.x + this.w + this.connectionSize > p.mouseX
            && this.y - this.connectionSize < p.mouseY
            && this.y + this.h + this.connectionSize > p.mouseY;

        return hovering;
    }

    draw(p5: p5, canvas: Renderer2D, state: DiagramState): void {
        // Drawing the selection mark
        if (this.hovered(p5) || this.isSelected) {
            p5.noFill();
            p5.strokeWeight(1);
            canvas.drawingContext.setLineDash([5, 5]);
            p5.rectMode("corner");
            p5.rect(this.x - this.connectionSize / 2, this.y - this.connectionSize / 2, this.w + this.connectionSize, this.h + this.connectionSize);
            canvas.drawingContext.setLineDash([]);
        }

        // drawing the connectionpoints
        if ((this.hovered(p5) && state != DiagramState.VIEW) || state == DiagramState.CONNECTION) {
            p5.noFill();
            this.connectionPoints.forEach(cp => {
                let p = { x: this.x + this.w * cp.x, y: this.y + this.h * cp.y }
                p5.strokeWeight(this.connectionSize);
                p5.point(p.x, p.y);
                if (p5.dist(p.x, p.y, p5.mouseX, p5.mouseY) <= this.connectionSize) {
                    p5.strokeWeight(1);
                    p5.ellipse(p.x, p.y, this.connectionSize * 2)
                }
            });

            p5.strokeWeight(1);
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
            this.w = Math.max(this.w, gridSize);
        }
        if (Math.round(this.h % gridSize / gridSize) == 1) {
            this.h += gridSize - this.h % gridSize;
        } else {
            this.h -= this.h % gridSize;
            this.h = Math.max(this.h, gridSize);
        }
    }
}