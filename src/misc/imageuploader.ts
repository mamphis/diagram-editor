import { Promise } from 'bluebird';


export class ImageUploader {
    private static modalContainer = $('#modal-fileuploader');
    private static fileInput = $('#currentFile') as JQuery<HTMLInputElement>;
    private static preview = $('#modal-fileuploader .preview-image>img') as JQuery<HTMLImageElement>;


    static getImage(): Promise<string | undefined> {
        return new Promise<string | undefined>((res, rej) => {
            let ok = $('#fileuploader-ok') as JQuery<HTMLButtonElement>;

            ImageUploader.modalContainer.modal('show');
            let imageSelected = false;
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
                        ImageUploader.preview.attr('src', fileSrc);
                        imageSelected = true;
                    } else {
                        res(undefined);
                    }
                };

                reader.readAsDataURL(file);
            });

            ImageUploader.modalContainer.one('hidden.bs.modal', (e) => {
                if (!imageSelected) {
                    res(undefined);
                }
            });

            ok.click(() => {
                if (imageSelected) {
                    res(fileSrc);
                    ImageUploader.preview.attr('src', "");
                    imageSelected = false;
                    fileSrc = "";
                    ImageUploader.modalContainer.modal('hide');
                }
            })
        });
    }
}