import * as p5 from 'p5';
import { Settings } from '../../misc/settings';
import { IShape } from './ishape';

export class Connection {
    constructor(public start: IShape, public startIndex: number, public end: IShape, public endIndex: number) {
        if (start.id == end.id && startIndex == endIndex) {
            throw new Error("Cannot connect the same connection-points.");
        }
    }

    draw(p: p5): void {

        // TODO: Performance Optimizing (Only recalculate when position of shapes have changed...)
        let startC = this.start.getConnectionLocation(this.startIndex);
        let endC = this.end.getConnectionLocation(this.endIndex);
        let bezierFactor = 4;

        // let pointStart = { x: startC.x + startC.direction.x * Settings.gridSize * bezierFactor, y: startC.y + startC.direction.y * Settings.gridSize * bezierFactor };
        // let pointEnd = { x: endC.x + endC.direction.x * Settings.gridSize * bezierFactor, y: endC.y + endC.direction.y * Settings.gridSize * bezierFactor }
        let pointStart = {
            x: startC.x + startC.direction.x * Settings.gridSize * bezierFactor,// + (endC.x - startC.x) / 3,
            y: startC.y + startC.direction.y * Settings.gridSize * bezierFactor,
        }

        let pointEnd = {
            x: endC.x + endC.direction.x * Settings.gridSize * bezierFactor,// - (endC.x - startC.x) / 3,
            y: endC.y + endC.direction.y * Settings.gridSize * bezierFactor,
        }

        let points: { x: number, y: number }[] = [];
        points.push(startC, pointStart, startC.direction, pointEnd, endC, endC.direction);
        points.forEach(point => {
            p.strokeWeight(4);
            p.point(point.x, point.y);
        })

        p.strokeWeight(1);
        p.noFill();
        p.stroke(0);
        p.bezier(startC.x, startC.y, pointStart.x, pointStart.y, pointEnd.x, pointEnd.y, endC.x, endC.y);
        return;

        let allStraight = false;

        do {
            allStraight = true;
            let direction = { x: 0, y: 0 };
            for (let i = 0; i < points.length - 1; i++) {
                let s = points[i];
                let e = points[i + 1];

                if (s.x == e.x || s.y == e.y) {
                    continue;
                } else {
                    allStraight = false;
                    let p1 = { x: 0, y: 0 };
                    let p2 = { x: 0, y: 0 };

                    direction.x = Math.sign(e.x - s.x);
                    direction.y = Math.sign(e.y - s.y);
                    // get the center point
                    let pCenter = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };

                    p1.x = pCenter.x;
                    p1.y = s.y;

                    p2.x = pCenter.x;
                    p2.y = e.y;

                    points.splice(i + 1, 0, p2);
                    points.splice(i + 1, 0, p1);
                    console.log(p1, p2, direction);

                }

            }
        } while (!allStraight);

        for (let i = 0; i < points.length - 1; i++) {
            let s = points[i];
            let e = points[i + 1];
            p.line(s.x, s.y, e.x, e.y);
            if (i == points.length - 2) {
                let vec = p.createVector(e.x - s.x, e.y - s.y);
                p.push();
                p.angleMode("degrees");
                p.fill(0);
                p.noStroke();
                p.translate(e.x, e.y);
                p.rotate(vec.heading() + 90);
                p.triangle(0, 0, -Settings.gridSize * 0.2, Settings.gridSize * 0.5, Settings.gridSize * 0.2, Settings.gridSize * 0.5);
                p.pop();
            }
        }
    }
}