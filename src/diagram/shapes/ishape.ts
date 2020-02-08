import { DiagramState } from '../../misc/diagramstate';
import * as p5 from 'p5';
import { Renderer2D } from '../../misc/renderer2d';
import { ConnectionPoint } from '../../misc/connectionpoint';

export interface IShape {
    name: string;
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    shouldSnap: boolean;
    isSelected: boolean;
    customProperties: { [group: string]: undefined | { [prop: string]: undefined | 'text' | 'number' | 'longtext' | 'color' | 'image' } };

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void;
    getConnectionLocation(index: number): ConnectionPoint;
    isOverConnection(x: number, y: number, p5: p5): ConnectionPoint | false;
    hovered(p: p5): boolean;
    snap(gridSize: number): void;
    serialize():string;
    deserialize(data: string): this;
}