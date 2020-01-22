import * as p5 from 'p5';
import { Settings } from '../misc/settings';
import { Connection } from './shapes/connection';
import { IShape } from './shapes/ishape';
import { Rectangle } from './shapes/rectangle';
import { Renderer2D } from '../misc/renderer2d';
import { DiagramState } from '../misc/diagramstate';
import { FileUploader } from '../misc/fileuploader';
import { dom } from '../sketch';
export class Diagram {
    public background?: p5.Image;
    private connections: Connection[] = [];
    public shapes: IShape[] = [];
    public state: DiagramState;

    constructor(public p: p5, public canvas: Renderer2D) {
        // this.shapes.push(new Rectangle());
        this.state = DiagramState.DRAWING;
    }

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

        this.connections.forEach(c => c.draw(this));

        this.shapes.forEach(s => s.draw(this.p, this.canvas, this.state));
    }

    setBackground(res: string | undefined) {
        if (res) {
            this.background = this.p.loadImage(res);
        } else {
            this.background = void (0);
        }
    }

    export(): void {
        let dia =  JSON.stringify({
            background: this.background,
            shapes: this.shapes,
            connections: this.connections,
        });

        this.download('DiagramData.json', dia);
    }

    private download(filename:string, text:string) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:application/json;charset=utf-8,' + text);
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
            if(!obj.shapes || !obj.connections) {
                dom.alert('danger', "The current File is not a valid Diagram File.");
            }
            console.log(obj);
        })
    }
}