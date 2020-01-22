import { BaseShape } from "./shapes/baseshape";
import { Rectangle } from "./shapes/rectangle";
import { Triangle } from "./shapes/triangle";
import { Button } from "../misc/button";
import { ImageUploader } from "../misc/imageuploader";

export class DomRegistry {
    shapes: (new (x: number, y: number, w: number, h: number) => BaseShape)[] = [];
    buttons: Button[] = [];
    constructor() {
        this.shapes.push(Rectangle);
        this.shapes.push(Triangle);

        this.buttons.push(new Button("Export Diagram", (diagram) => diagram.export()));
        this.buttons.push(new Button("Import Diagram", (diagram) => diagram.export()));
        this.buttons.push(new Button("Set Background", (diagram) => {
            ImageUploader.getImage().then(dataUrl => {
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