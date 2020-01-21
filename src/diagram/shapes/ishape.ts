import { DiagramState } from '../../misc/diagramstate';
import * as p5 from 'p5';
import { Renderer2D } from '../../misc/renderer2d';

export interface IShape {
    name: string;
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void
}