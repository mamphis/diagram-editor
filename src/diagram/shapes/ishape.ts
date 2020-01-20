import * as p5 from 'p5';
export interface IShape {
    name: string;
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;

    draw(p: p5): void;
}