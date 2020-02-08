import * as p5 from 'p5';
import { Settings } from '../misc/settings';
import { Connection } from './shapes/connection';
import { Renderer2D } from '../misc/renderer2d';
import { DiagramState } from '../misc/diagramstate';
import { FileUploader } from '../misc/fileuploader';
import { dom, registry, contentContainer } from '../sketch';
import { IShape } from './shapes/ishape';
import { Rectangle } from './shapes/rectangle';
export class Diagram {
    public background?: p5.Image;
    private connections: Connection[] = [];
    public shapes: IShape[] = [];
    public state: DiagramState;
    private currentShape: IShape | undefined;
    private currentConnection: false | {
        x: number; y: number; id: string; index: number;
    } = false;

    previewShape?: IShape;
    selectedShape?: IShape;

    constructor(public p: p5, public canvas: Renderer2D) {
        this.shapes.push(new Rectangle(10, 10, 100, 100));
        this.state = DiagramState.DRAWING;
        this.p.mouseDragged = this.mouseDragged.bind(this);
        this.p.mousePressed = this.mousePressed.bind(this);
        this.p.mouseReleased = this.mouseReleased.bind(this);
        this.p.mouseClicked = this.mouseClicked.bind(this);

        let oldState = DiagramState.VIEW;
        FileUploader.eventSubscriber.on('onOpen', (data) => {
            oldState = this.state;
            this.state = DiagramState.UPLOAD;
        });

        FileUploader.eventSubscriber.on('onClose', (data) => {
            this.state = oldState;
        });
    }


    findShape(x: number, y: number): IShape | undefined {
        return this.shapes.reverse().filter(s => s.hovered(this.p))[0];
    }

    getShapeById(id: string): IShape | undefined {
        return this.shapes.filter(s => s.id == id)[0];
    }

    mouseDragged(ev: MouseEvent) {
        if (this.currentShape && this.state == DiagramState.DRAWING) {
            this.currentShape.x += ev.movementX;
            this.currentShape.y += ev.movementY;
        }
    }

    mousePressed(ev: MouseEvent) {
        if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 0 || this.p.mouseY > this.p.height) {
            return;
        }
        if (this.state == DiagramState.UPLOAD) {
            return;
        }

        this.currentShape = this.findShape(this.p.mouseX, this.p.mouseY);
        console.log(this.currentShape);
        if (this.currentShape) {
            this.currentConnection = this.currentShape.isOverConnection(this.p.mouseX, this.p.mouseY, this.p);
            console.log(this.currentConnection);
            if (this.currentConnection) {
                this.state = DiagramState.CONNECTION;
                this.currentShape = undefined;
            }
        }
    }

    mouseReleased(ev: MouseEvent) {
        if (this.state == DiagramState.UPLOAD) {
            return;
        }

        if (this.currentShape && this.currentShape.shouldSnap) {
            this.currentShape.snap(Settings.gridSize);
        }
        if (this.state == DiagramState.CONNECTION && this.currentConnection) {
            let underNode = this.findShape(this.p.mouseX, this.p.mouseY);
            if (underNode) {
                let endC = underNode.isOverConnection(this.p.mouseX, this.p.mouseY, this.p);
                if (endC) {
                    let start = this.getShapeById(this.currentConnection.id);
                    let end = this.getShapeById(endC.id);
                    if (start && end) {
                        try {
                            let connection = new Connection(start, this.currentConnection.index, end, endC.index);
                            this.connections.push(connection);
                        } catch (e) {
                            dom.alert('warning', e.message);
                        }
                    }
                }
            }
        }

        this.currentConnection = false;
        this.state = DiagramState.DRAWING;
        this.currentShape = void (0);
    }

    mouseClicked(ev: MouseEvent) {
        if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 0 || this.p.mouseY > this.p.height) {
            return;
        }

        if (this.state == DiagramState.UPLOAD) {
            return;
        }

        if (this.selectedShape) {
            this.selectedShape.isSelected = false;
        }

        this.selectedShape = this.findShape(this.p.mouseX, this.p.mouseY);
        dom.select(this.p, this.selectedShape);
        if (this.selectedShape) {
            this.selectedShape.isSelected = true;
        }
    }

    // keyPressed(ev) {
    //     if (ev.key == 'Backspace' || ev.key == 'Delete') {
    //         if (this.selectedShape) {
    //             this.connections = this.connections.filter(c => c.start.id != this.selectedShape.id && c.end.id != this.selectedShape.id);
    //             this.shapes = this.shapes.filter(s => s.id != this.selectedShape.id);
    //             this.selectedShape = void (0);
    //             this.dom.select(void (0));
    //         }
    //     }
    // }

    draw() {
        // Draw the background
        if (this.background) {
            this.p.image(this.background, 0, 0, this.p.width, this.p.height);
        } else {
            for (let x = 0; x < this.p.width; x += Settings.gridSize) {
                for (let y = 0; y < this.p.height; y += Settings.gridSize) {
                    this.p.point(x, y);
                }
            }
        }

        this.connections.forEach(c => c.draw(this.p));

        this.shapes.forEach(s => {
            this.p.noFill();
            this.p.strokeWeight(0);
            s.draw(this.p, this.canvas, this.state);
        });

        if (this.state == DiagramState.CONNECTION && this.currentConnection) {
            this.p.strokeWeight(3);
            this.p.stroke(12, 55, 165);
            this.p.line(this.currentConnection.x, this.currentConnection.y, this.p.mouseX, this.p.mouseY);
            this.p.strokeWeight(1);
            this.p.stroke(0);
        }

        if (this.previewShape &&
            this.p.mouseX > 0 &&
            this.p.mouseX < this.p.width &&
            this.p.mouseY > 0 &&
            this.p.mouseY < this.p.height) {
            this.previewShape.draw(this.p, this.canvas, DiagramState.VIEW);
        }
    }

    setBackground(res: string | undefined) {
        if (res) {
            this.background = this.p.loadImage(res);
        } else {
            this.background = void (0);
        }
    }

    export(): void {
        let dia = JSON.stringify({
            background: this.background,
            shapes: this.shapes.map(s => { return { type: s.name, data: s.serialize() } }),
            connections: this.connections,
        });

        this.download('DiagramData.json', dia);
    }

    private download(filename: string, text: string, type: string = 'application/json', charset: string = 'utf-8') {
        var pom = document.createElement('a');
        console.log(text);
        pom.setAttribute('href', `data:${type};charset=${charset},${encodeURIComponent(text)}`);
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }

    import(): void {
        FileUploader.getFile('.json', { readMethod: "text", preview: false }).then((str) => {
            if (!str) {
                return;
            }

            let obj = JSON.parse(str);
            if (!obj.shapes || !obj.connections) {
                dom.alert('danger', "The current File is not a valid Diagram File.");
            }
            // console.log(obj);
            this.shapes = [];
            this.connections = [];
            obj.shapes.forEach((shape: { type: string, data: string }) => {
                try {
                    let newShape = registry.getShape(shape.type);
                    this.shapes.push(newShape.deserialize(shape.data));
                } catch (e) {
                    dom.alert('danger', e.message);
                }
            });
            obj.connections.forEach((conn: Connection) => {
                try {
                    let start = this.shapes.find(s => s.id == conn.start.id);
                    let end = this.shapes.find(s => s.id == conn.end.id);
                    if (start && end) {
                        this.connections.push(new Connection(start, conn.startIndex, end, conn.endIndex));
                    } else {
                        throw new Error("Start or end of connection not found...");
                    }
                } catch (e) {
                    dom.alert('danger', e.message);
                }
            });
        })
    }
}