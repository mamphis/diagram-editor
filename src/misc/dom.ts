import { registry } from "../sketch";
import * as p5 from 'p5';
import { Renderer2D } from "./renderer2d";
import { DiagramState } from "./diagramstate";
import { Promise } from 'bluebird';
import { Diagram } from "../diagram/diagram";
import { Settings } from "./settings";
import { IShape } from "../diagram/shapes/ishape";

export class Dom {
    private shapeContainer = $('#shapes') as JQuery<HTMLDivElement>;
    private toolbarContainer = $('#toolbar') as JQuery<HTMLDivElement>;
    private loadingDiv = $('#loading') as JQuery<HTMLDivElement>;
    private alertContainer = $('#alert-container') as JQuery<HTMLDivElement>;
    private propertyContainer = $('#properties') as JQuery<HTMLDivElement>;

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
                                    if (newShape.shouldSnap) {
                                        newShape.snap(Settings.gridSize);
                                    }
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
        setTimeout(() => { alert.fadeOut(); }, 5000);
    }

    select(selectedShape?: IShape) {
        this.propertyContainer.html('');

        if (!selectedShape) {
            return;
        }

        let baseDataGroup = $('<div />') as JQuery<HTMLDivElement>;
        baseDataGroup.addClass('d-flex flex-wrap mt-2');
        baseDataGroup.append(
            $('<span>')
                .addClass('col col-12 font-weight-bold')
                .css('font-size', 'large')
                .text("General")
        );

        this.appendNumericTextbox(selectedShape, 'x', baseDataGroup);
        this.appendNumericTextbox(selectedShape, 'y', baseDataGroup);
        this.appendNumericTextbox(selectedShape, 'w', baseDataGroup);
        this.appendNumericTextbox(selectedShape, 'h', baseDataGroup);
        this.appendColorTextbox(selectedShape, 'color', baseDataGroup);

        this.propertyContainer.append(baseDataGroup);
        for (let group of Object.keys(selectedShape.customProperties)) {
            let dataGroup = $('<div />') as JQuery<HTMLDivElement>;
            dataGroup.addClass('d-flex flex-wrap mt-2');
            dataGroup.append(
                $('<span>')
                    .addClass('col col-12 font-weight-bold')
                    .css('font-size', 'large')
                    .text(group)
            );

            let props = selectedShape.customProperties[group];
            if (props) {
                for (let prop of Object.keys(props)) {
                    switch (props[prop]) {
                        case 'text':
                            this.appendTextbox(selectedShape, prop as keyof IShape, dataGroup);
                            break;
                        case 'longtext':
                            this.appendTextarea(selectedShape, prop as keyof IShape, dataGroup);
                            break;
                        case 'number':
                            this.appendNumericTextbox(selectedShape, prop as keyof IShape, dataGroup);
                            break;
                        case 'color':
                            this.appendColorTextbox(selectedShape, prop as keyof IShape, dataGroup);
                            break;
                    }
                }

                this.propertyContainer.append(dataGroup);
            }
        }
    }

    private appendColorTextbox(shape: IShape, property: keyof IShape, group: JQuery<HTMLDivElement>): void {
        let field = $('<div />');
        field.addClass('col col-6 row mt-2');
        let caption = $('<span />').addClass('col col-5').text(property);
        let value = $('<input type="color" />').addClass('col col-7').val(shape[property] as unknown as string);

        value.change((ev) => {
            shape[property] = $(ev.target).val() as never;
        });

        field.append(caption, value);

        group.append(field);
    }

    private appendTextbox(shape: IShape, property: keyof IShape, group: JQuery<HTMLDivElement>): void {
        let field = $('<div />');
        field.addClass('col col-6 row mt-2');
        let caption = $('<span />').addClass('col col-5').text(property);
        let value = $('<input type="text" />').addClass('col col-7').val(shape[property] as unknown as string);

        value.change((ev) => {
            shape[property] = $(ev.target).val() as never;
        });

        field.append(caption, value);

        group.append(field);
    }

    private appendTextarea(shape: IShape, property: keyof IShape, group: JQuery<HTMLDivElement>): void {
        let field = $('<div />');
        field.addClass('col col-12 row mt-2');
        let caption = $('<span />').addClass('col col-12').text(property);
        let value = $('<textarea></textarea>').addClass('col col-12').val(shape[property] as unknown as string);

        value.change((ev) => {
            shape[property] = $(ev.target).val() as never;
        });

        field.append(caption, value);

        group.append(field);
    }

    private appendNumericTextbox(shape: IShape, property: keyof IShape, group: JQuery<HTMLDivElement>): void {
        let field = $('<div />');
        field.addClass('col col-6 row mt-2');
        let caption = $('<span />').addClass('col col-5').text(property);
        let value = $('<input type="number" />').addClass('col col-7').val(shape[property] as unknown as string);

        value.change((ev) => {
            shape[property] = parseInt($(ev.target).val() as string) as never;
            if (shape.shouldSnap) {
                shape.snap(Settings.gridSize);
            }
        });

        field.append(caption, value);

        group.append(field);
    }
}