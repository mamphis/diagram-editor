import { Diagram } from '../diagram';
export interface IShape {
    name: string;
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;

    draw(p: Diagram): void;
}