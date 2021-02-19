class GetImages{

    constructor()
    {
        let tables = this.StartButtons();

        if(localStorage.getItem('files') != null)
        {
            let files = JSON.parse(localStorage.getItem('files'));

            this.AdicionarMidia(files);

            this.showTable(tables[0], tables[1]);

            
        }

        this.imagesWidth = 70;
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

        this.showNothing(tableClass, loadingElement);

        btnAdc.addEventListener('change', e =>{
            this.showLoad(tableClass, loadingElement);

            this.getPhotos(e).then((result) =>{
                this.AdicionarMidia(result, 
                    loopCheckbox.checked, 
                    autoPlayCheckbox.checked,
                    filterCheckbox.checked);
            }).finally((result) => {
                this.showTable(tableClass, loadingElement);
            });
        }, true);

        btnReset.addEventListener('click', e =>{
            this.deletePhotos();
            this.showNothing(tableClass, loadingElement);
        }, false);

        btnZoomIn.addEventListener('click', e =>{
            this.zoomInPhotos();  
        }, true);

        btnZoomOut.addEventListener('click', e =>{
            this.zoomOutPhotos();  
        }, true);

        return [tableClass, loadingElement];
    }

    zoomInPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        this.imagesWidth += 10;
        images.forEach(element => {
            element.style.width = this.imagesWidth + '%';
        });
    }

    zoomOutPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        this.imagesWidth -= 10;
        images.forEach(element => {
            element.style.width = this.imagesWidth + '%';
        });
    }

    showNothing(tableClass, loadingElement)
    {
        tableClass.style.display = 'none';
        loadingElement.style.display = 'none';
    }

    showTable(tableClass, loadingElement)
    {
        loadingElement.style.display = 'none';
        tableClass.style.display = 'table';            
    }

    showLoad(tableClass, loadingElement)
    {
        loadingElement.style.display = 'flex';
        tableClass.style.display = 'none'; 
    }

    deletePhotos()
    {
        let photoTable = document.querySelectorAll('th');
        photoTable.forEach((element, index, array)=>{
            element.parentNode.removeChild(element);
        });

        localStorage.clear();
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
                                photosArray.push({src: fileReader.result, fileType, id: i});

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
        let mediaFiles = [];
        for(let i = 0; i < files.length; i++)
        {
            let td = document.createElement('th');
            td.style.display = 'block';

            let media = document.createElement(files[i].fileType == 'data:image' ? 'img' : 'video');
            
            Object.assign(media, {
                src: files[i].src,
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
            
            mediaFiles.push({
                src: media.src, 
                autoplay: media.autoplay, 
                loop: media.loop,
                controls: true,
                muted: true,
                fileType: files[i].fileType,  
                className: 'mediaSize',
            });

            td.appendChild(media);
            document.querySelector('tr').appendChild(td);
        }

        console.log(JSON.stringify(mediaFiles));
        localStorage.setItem('files', JSON.stringify(mediaFiles));
        
    }
}