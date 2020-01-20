import * as p5 from 'p5';
import { IShape } from "./ishape";

export abstract class BaseShape implements IShape {
    id: string;
    color: string;
    
    constructor(public name: string, public x: number, public y: number, public w: number, public h: number) {
        this.id = 'u' + Math.floor(Math.random() * 899999 + 100000);
        this.color = '#cccccc';
    }

    draw(p: p5) {

    }
}