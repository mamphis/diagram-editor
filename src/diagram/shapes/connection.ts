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
        p.strokeWeight(1);
        p.stroke(0);

        // TODO: Performance Optimizing (Only recalculate when position of shapes have changed...)
        let startC = this.start.getConnectionLocation(this.startIndex);
        let endC = this.end.getConnectionLocation(this.endIndex);
        let pointStart = { x: startC.x + startC.direction.x * Settings.gridSize, y: startC.y + startC.direction.y * Settings.gridSize };
        let pointEnd = { x: endC.x + endC.direction.x * Settings.gridSize, y: endC.y + endC.direction.y * Settings.gridSize }

        let points: { x: number, y: number }[] = [];
        points.push(startC, pointStart, pointEnd, endC);
        let allStraight = false;

        do {
            allStraight = true;
            for (let i = 0; i < points.length - 1; i++) {
                let s = points[i];
                let e = points[i + 1];

                if (s.x == e.x || s.y == e.y) {
                    continue;
                } else {
                    allStraight = false;
                    let p1 = { x: 0, y: 0 };
                    let p2 = { x: 0, y: 0 };

                    // get the center point
                    let pCenter = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };

                    p1.x = pCenter.x;
                    p1.y = s.y;

                    p2.x = pCenter.x;
                    p2.y = e.y;

                    points.splice(i + 1, 0, p2);
                    points.splice(i + 1, 0, p1);
                }
            }
        } while (!allStraight);

        for (let i = 0; i < points.length - 1; i++) {
            let s = points[i];
            let e = points[i + 1];
            p.line(s.x, s.y, e.x, e.y);
        }
    }
}