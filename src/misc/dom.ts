import { registry } from "../sketch";
import * as p5 from 'p5';
import { Renderer2D } from "./renderer2d";
import { DiagramState } from "./diagramstate";
import { Promise } from 'bluebird';
import { Diagram } from "../diagram/diagram";
import { IShape } from "../diagram/shapes/ishape";

export class Dom {
    private shapeContainer = $('#shapes') as JQuery<HTMLDivElement>;
    private toolbarContainer = $('#toolbar') as JQuery<HTMLDivElement>;
    private loadingDiv = $('#loading') as JQuery<HTMLDivElement>;
    private alertContainer = $('#alert-container') as JQuery<HTMLDivElement>;

    constructor(private diagram: Diagram) {
        new Promise((res, rej) => {
            Promise.all(
                registry.shapes.map(shape => {
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
                                .addClass('col col-5 text-center m-1 shape')
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



                            shapeDiv.on('dragstart', (ev) => {
                                var img = new Image();
                                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
                                ev.originalEvent?.dataTransfer?.setDragImage(img, 0, 0);
                                if (ev.originalEvent?.dataTransfer) {
                                    ev.originalEvent.dataTransfer.effectAllowed = 'all';
                                }

                                diagram.previewShape = new shape(diagram.p.mouseX, diagram.p.mouseY, size, size);
                            });

                            shapeDiv.on('drag', (ev) => {
                                ev.preventDefault();
                                if (diagram.previewShape) {
                                    diagram.previewShape.x = diagram.p.mouseX - size / 2;
                                    diagram.previewShape.y = diagram.p.mouseY - size / 2;
                                }
                            });

                            shapeDiv.on('dragend', (ev) => {
                                if (diagram.previewShape &&
                                    diagram.p.mouseX > 0 &&
                                    diagram.p.mouseX < diagram.p.width &&
                                    diagram.p.mouseY > 0 &&
                                    diagram.p.mouseY < diagram.p.height) {
                                    diagram.shapes.push(diagram.previewShape);
                                }

                                diagram.previewShape = void (0);
                            })

                            this.shapeContainer.append(shapeDiv);
                            reso();
                        });
                    });
                }).concat(
                    registry.buttons.map(button => {
                        return new Promise((reso, reje) => {
                            let buttonDiv = $('<div />')
                                .addClass('btn btn-primary m-2')
                                .append(
                                    $('<span />')
                                        .text(button.name)
                                ).click(() => {
                                    button.onclick(diagram);
                                }).attr('draggable', 'false');

                            this.toolbarContainer.append(buttonDiv);
                            reso();
                        });
                    })
                )).then(() => {
                    setTimeout(() => res(), 200);
                });
        }).then(() => {
            this.loadingDiv.hide();
            this.loadingDiv.removeClass('d-flex');
        })
    }

    alert(mode: 'info' | 'warning' | 'danger', message: string) {
        let alert = $('<div role="alert" />').addClass(`alert alert-${mode} w-50`).text(message);
        this.alertContainer.append(alert);
        setTimeout(() => { alert.remove(); }, 5000);
    }
}