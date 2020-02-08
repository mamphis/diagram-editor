import { Promise } from 'bluebird';
import { Event } from './event';


export class FileUploader {
    private static modalContainer = $('#modal-fileuploader');
    private static fileInput = $('#currentFile') as JQuery<HTMLInputElement>;
    private static preview = $('#modal-fileuploader .preview-image>img') as JQuery<HTMLImageElement>;
    private static fileInputName = $('#currentFile~label') as JQuery<HTMLLabelElement>;

    private static ev = new Event<undefined>();
    static eventSubscriber = FileUploader.ev.subscriber;

    static getFile(accept: string, config: { readMethod: 'text' | 'dataUrl', preview: boolean, currentImage?: string }): Promise<string | undefined> {
        return new Promise<string | undefined>((res, rej) => {
            this.ev.fire('onOpen', undefined);
            let ok = $('#fileuploader-ok') as JQuery<HTMLButtonElement>;
            FileUploader.fileInput.attr('accept', accept);
            if (config.preview && config.currentImage) {
                FileUploader.preview.attr("src", config.currentImage);
            }

            FileUploader.modalContainer.modal('show');
            let fileSelected = false;
            let fileSrc: string = "";
            this.fileInput.on('change', (fe) => {
                let files = fe.target.files;
                if (!files) {
                    res(undefined);
                    return;
                }
                let file = files[0];

                let reader = new FileReader();

                reader.onloadend = (ev) => {
                    if (!ev.target) {
                        res(undefined);
                        return;
                    }
                    let str = ev.target.result || "";

                    if (typeof (str) == 'string') {
                        fileSrc = str;
                        if (config.preview) {
                            FileUploader.preview.attr('src', fileSrc);
                        }
                        fileSelected = true;
                        FileUploader.fileInputName.text(file.name);
                    } else {
                        res(undefined);
                    }
                };
                if (config.readMethod == 'dataUrl') {
                    reader.readAsDataURL(file);
                } else if (config.readMethod == 'text') {
                    reader.readAsText(file);
                }
            });

            FileUploader.modalContainer.one('hidden.bs.modal', (e) => {
                if (!fileSelected) {
                    res(undefined);
                }
                this.ev.fire('onClose', undefined);
            });

            ok.click(() => {
                if (fileSelected) {
                    res(fileSrc);
                    if (config.preview) {
                        FileUploader.preview.attr('src', "");
                    }
                    fileSelected = false;
                    FileUploader.fileInputName.text("Choose file");
                    fileSrc = "";
                    FileUploader.modalContainer.modal('hide');
                }
            })
        });
    }

    static getImage(currentImage?: string): Promise<string | undefined> {
        return this.getFile('image/*', { readMethod: "dataUrl", preview: true, currentImage: currentImage });
    }
}