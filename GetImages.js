class GetImages{

    constructor()
    {
        this.StartButtons();
    }

    StartButtons()
    {
        let btnAdc = document.querySelector('.btn-adicionar');
        let btnReset = document.querySelector('.btn-reset');
        
        let btnZoomIn = document.querySelector('.btnRight');
        let btnZoomOut = document.querySelector('.btnLeft');

        let filterCheckbox = document.querySelector('.checkboxBW');
        let loopCheckbox = document.querySelector('.checkboxLoop');
        let autoPlayCheckbox = document.querySelector('.checkboxAutoplay');

        let tableClass = document.querySelector('.imagesTable');
        let loadingElement = document.querySelector('.loadingImages');

        tableClass.style.display = 'none';
        loadingElement.style.display = 'none';

        btnAdc.addEventListener('change', e =>{
            loadingElement.style.display = 'flex';
            this.getPhotos(e).then((result) =>{
                this.AdicionarMidia(result, 
                    loopCheckbox.checked, 
                    autoPlayCheckbox.checked,
                    filterCheckbox.checked);
            }).finally(() => {
                loadingElement.style.display = 'none';
                tableClass.style.display = 'table';
            });
        }, true);

        btnReset.addEventListener('click', e =>{
            this.deletePhotos();
            tableClass.style.display = 'none';
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
                    fileReader.onload = ()=>
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
        
    AdicionarMidia(files, loop=false, autoplay=false, bwFilter=false)
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
                autoplay,
                loop, 
                controls: true,
                muted: true,
                className: 'mediaSize'
            });

            if(bwFilter==true)
            {
                media.className = 'mediaSize bwFilter';
            }
           
            td.appendChild(media);
            document.querySelector('tr').appendChild(td);
        }
        
    }
}