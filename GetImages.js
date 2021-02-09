class GetImages{


    constructor()
    {
        console.log('Abri')
        this.StartButtons();
    }

    StartButtons()
    {
        let btnAdc = document.querySelector('.btn-adicionar');
        let btnReset = document.querySelector('.btn-reset');
        
        let btnZoomIn = document.querySelector('.btnRight');
        let btnZoomOut = document.querySelector('.btnLeft');

        btnAdc.addEventListener('change', e =>{
            this.getPhotos(e).then((result) =>{
                console.log(result);
                this.AdicionarMidia(result);
            });
        }, true);

        btnReset.addEventListener('click', e =>{
            this.deletePhotos();
            
        }, false);

        btnZoomIn.addEventListener('click', e =>{
            this.zoomInPhotos();  
        }, true);

        btnZoomOut.addEventListener('click', e =>{
            this.zoomOutPhotos();  
        }, true);
    }

    zoomInPhotos()
    {
        
        let images = document.querySelectorAll('.mediaSize');

        images.forEach(element => {
            element.style.width = '100%';
        });
    }

    zoomOutPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        images.forEach(element => {
            element.style.width = '70%';
        });
    }

    deletePhotos()
    {
        let photoTable = document.querySelectorAll('th');
        console.log(photoTable);

        photoTable.forEach((element, index, array)=>{
            element.parentNode.removeChild(element);
        });
    }

    getPhotos(event)
    {

        return new Promise((resolve, reject) =>
        {
            let photos = event.target.files;

            if(photos)
            {
                let photosArray = []; 
                for(let i=0; i < photos.length; i++)
                {
                    let fileReader = new FileReader();
                    fileReader.onloadend = ()=>
                    {
                        let fileType = fileReader.result.slice(0, 10);
                        
                        switch(fileType)
                        {
                            case 'data:image':
                            case 'data:video':
                                photosArray.push({fileData: fileReader.result, fileType, id: i});

                                if(photos.length == photosArray.length) {
                                    fileReader.abort();
                                    resolve(photosArray);
                                }
                                break;

                            default:
                                alert('Insira um formato de arquivo valido');
                                reject();
                                break;
                        }
                        
                        fileReader.abort();
                    }
                    fileReader.readAsDataURL(photos[i]);
                }
            }
        });
    }  
        
    AdicionarMidia(files)
    {
        files.sort((element1, element2) =>{
            return element1.id - element2.id;
        });

        for(let i = 0; i < files.length; i++)
        {
            let td = document.createElement('th');
            td.style.display = 'block';

            let media = document.createElement(files[i].fileType == 'data:image' ? 'img' : 'video');
            
            Object.assign(media, {
                src: files[i].fileData,
                autoplay: false,
                loop: true, 
                controls: true,
                muted: true,
                className: 'mediaSize'
            });

            td.appendChild(media);
            document.querySelector('tr').appendChild(td);
        }
        
    }
}