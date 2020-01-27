import { BaseShape } from "./shapes/baseshape";
import { Rectangle } from "./shapes/rectangle";
import { Triangle } from "./shapes/triangle";
import { Button } from "../misc/button";
import { FileUploader } from "../misc/fileuploader";
import { Text } from "./shapes/textshape";
import { IShape } from "./shapes/ishape";

export class DomRegistry {
    shapes: (new (x: number, y: number, w: number, h: number) => BaseShape<IShape>)[] = [];
    buttons: Button[] = [];
    constructor() {
        this.shapes.push(Rectangle);
        this.shapes.push(Triangle);
        this.shapes.push(Text);

        this.buttons.push(new Button("Export Diagram", (diagram) => diagram.export()));
        this.buttons.push(new Button("Import Diagram", (diagram) => diagram.import()));
        this.buttons.push(new Button("Set Background", (diagram) => {
            FileUploader.getImage().then(dataUrl => {
                if (dataUrl !== undefined) {
                    diagram.setBackground(dataUrl)
                }
            });
        }));
        
        this.buttons.push(new Button("Clear Background", (diagram) => {
            diagram.setBackground(undefined)
        }));
    }
}