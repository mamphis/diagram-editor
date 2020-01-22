import * as p5 from 'p5';
import { Diagram } from './diagram/diagram';
import { Renderer2D } from './misc/renderer2d';
import { DomRegistry } from './diagram/domregistry';
import { Dom } from './misc/dom';


const contentContainer = $('#content')[0];
export let diagram: Diagram;
export const registry = new DomRegistry();
export let dom: Dom;

const sketch = (p: p5) => {
    p.setup = () => {
        let canvas = p.createCanvas(contentContainer.clientWidth, contentContainer.clientHeight);
        diagram = new Diagram(p, canvas as Renderer2D);
        dom = new Dom(diagram);
    }

    p.draw = () => {
        p.background(255);
        diagram.draw();
    }
};

new p5(sketch, contentContainer);


