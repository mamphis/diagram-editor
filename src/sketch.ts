import * as p5 from 'p5';
import { Diagram } from './diagram/diagram';
import { Renderer2D } from './misc/renderer2d';
import { DomRegistry } from './diagram/domregistry';
import { Dom } from './misc/dom';
import { IShape } from './diagram/shapes/ishape';
import { DiagramState } from './misc/diagramstate';


export const contentContainer = $('#content')[0];
export let diagram: Diagram;
export const registry = new DomRegistry();
export let dom: Dom;
export let defaultImage: p5.Image;

let contextMenu = (ev: JQuery.ContextMenuEvent, shape?: IShape) => {
    return $('<div id="contextMenu"/> ')
        .offset({ left: ev.clientX, top: ev.clientY })
        .addClass('d-flex flex-column cm')
        .append(
            $('<div />')
                .text('Delete Shape')
                .addClass('cm-button' + (shape ? '' : ' disabled'))
                .on('click', () => {
                    if (shape) {
                        diagram.removeShape(shape);
                        $('#contextMenu').remove();
                    }
                })
        ).append(
            $('<div />')
                .text('Edit Shape')
                .addClass('cm-button' + (shape ? '' : ' disabled'))
                .on('click', () => {
                    if (shape) {
                        let oldState = diagram.state;
                        diagram.state = DiagramState.UPLOAD;
                        diagram.selectShape.call(diagram, shape);
                        console.log("selected Shape")
                        $('#contextMenu').remove();
                        setTimeout(() => diagram.state = oldState, 10);
                    }
                })
        ).append(
            $('<div />')
                .text('Download Diagram')
                .addClass('cm-button')
                .on('click', () => {
                    let img = diagram.canvas.drawingContext.canvas.toDataURL().replace(/^data:.*,/, "");
                    diagram.download('Diagram.png', img, 'image/png', 'utf-8;base64')
                    $('#contextMenu').remove();
                })
        );
};

$('#content').on('contextmenu', (ev) => {
    ev.preventDefault();
    $('#contextMenu').remove();
    let shape = diagram.findShape(ev.offsetX, ev.offsetY);
    $('#content').append(contextMenu(ev, shape));
});

$('#content').on('mousedown', (ev) => {
    if ($('#contextMenu').length > 0) {
        ev.preventDefault();
        if ($('#contextMenu:hover').length == 0) {
            $('#contextMenu').remove();
        }
    }
});

const sketch = (p: p5) => {
    p.preload = () => {
        defaultImage = p.loadImage('data:image/svg+xml,' + encodeURIComponent('<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="image-polaroid" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-image-polaroid fa-w-14 fa-3x"><path fill="currentColor" d="M112 192a48 48 0 1 0-48-48 48 48 0 0 0 48 48zm0-64a16 16 0 1 1-16 16 16 16 0 0 1 16-16zm304-96H32A32 32 0 0 0 0 64v384a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32zm0 416H32v-80h384zM85.2 336l52-69.33 40 53.33-12 16zm120 0l76-101.33 76 101.33zm210.8 0h-18.8L294 198.41c-6.06-8.07-19.56-8.07-25.62 0l-71.19 94.91L150 230.41c-6.06-8.07-19.56-8.07-25.62 0L45.18 336H32V64h384z" class=""></path></svg>'));
    }

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


