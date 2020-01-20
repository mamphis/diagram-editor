import * as p5 from 'p5';
import { Diagram } from './diagram/diagram';
import { Renderer2D } from './misc/renderer2d';


const contentContainer = $('#content')[0];
let diagram: Diagram;
const sketch = (p: p5) => {
    p.setup = () => {
        let canvas = p.createCanvas(contentContainer.clientWidth, contentContainer.clientHeight);
        diagram = new Diagram(p, canvas as Renderer2D);
    }

    p.draw = () => {
        p.background(255);
        diagram.draw();
    }
};

new p5(sketch, contentContainer);