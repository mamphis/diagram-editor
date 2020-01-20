import * as p5 from 'p5';
import { Diagram } from './diagram/diagram';


const contentContainer = $('#content')[0];
let diagram: Diagram;
const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(contentContainer.clientWidth, contentContainer.clientHeight);
        diagram = new Diagram(p);
    }

    p.draw = () => {
        diagram.draw();
    }
};

new p5(sketch, contentContainer);