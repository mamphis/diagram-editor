import { registry } from "../sketch";
import * as p5 from 'p5';
import { Renderer2D } from "./renderer2d";
import { DiagramState } from "./diagramstate";
import { Promise } from 'bluebird';
import { Diagram } from "../diagram/diagram";
import { IShape } from "../diagram/shapes/ishape";

export class Dom {
    private shapeContainer = $('#shapes') as JQuery<HTMLDivElement>;
    private loadingDiv = $('#loading') as JQuery<HTMLDivElement>;
    constructor(private diagram: Diagram) {
        new Promise((res, rej) => {
            Promise.all(registry.shapes.map(shape => {
                return new Promise((reso, reje) => {
                    let size = (this.shapeContainer.width() || 1) * 0.3;
                    let s = new shape(0, 0, size, size) as IShape;
                    console.log(s);
                    new Promise<Renderer2D>((resolve, reject) => {
                        let canvas!: Renderer2D;

                        let script = (sketch: p5) => {
                            sketch.setup = () => {
                                canvas = sketch.createCanvas(size, size) as Renderer2D;
                                resolve(canvas);
                                s.draw(sketch, canvas, DiagramState.VIEW);
                            };
                        }

                        let instance = new p5(script);

                        instance.remove();
                    }).then((instance) => {
                        let preview = instance.drawingContext.canvas.toDataURL();
                        let shapeDiv = $('<div />')
                            .addClass('col col-5 text-center m-1')
                            .append(
                                $('<img />')
                                    .attr('src', preview)
                            ).append(
                                $('<span />')
                                    .text(s.name)
                            ).dblclick(() => {
                                let newShape = new shape(size, size, size, size);
                                diagram.shapes.push(newShape);
                            }).attr('draggable', 'false');

                        this.shapeContainer.append(shapeDiv);
                        reso();
                    });
                });
            })).then(() => {
                setTimeout(() => res(), 200);
            });
        }).then(() => {
            this.loadingDiv.hide();
            this.loadingDiv.removeClass('d-flex');
        })
    }
}