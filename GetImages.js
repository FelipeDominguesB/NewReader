class GetImages{

    constructor()
    {
        
        this.inputFileElement = document.querySelector('#filesForm');
        
        this.btnAdc = document.querySelector('.btn-adicionar');
        this.btnReset = document.querySelector('.btn-reset');
        this.btnZoomIn = document.querySelector('.btnRight');
        this.btnZoomOut = document.querySelector('.btnLeft');
        this.btnHide = document.querySelector('.btn-hide');

        this.filterCheckbox = document.querySelector('.checkboxBW');
        this.loopCheckbox = document.querySelector('.checkboxLoop');
        this.autoPlayCheckbox = document.querySelector('.checkboxAutoplay');
        
        this.tableClass = document.querySelector('.imagesTable');
        this.showImages = document.querySelector('.exibicaoImagens')
        this.selectImages = document.querySelector('.exibicaoOpcoes');
        this.loadingElement = document.querySelector('.loadingImages');
        this.resetFilesDiv = document.querySelector('.resetFilesDiv');
        this.StartButtons();
        this.imagesWidth = 70;
        
    }

    StartButtons()
    {
        this.showNothing();

        this.btnAdc.addEventListener('click', e =>{
            this.inputFileElement.click();
        }, true);

        this.inputFileElement.addEventListener('change', e =>{
            this.showLoad();
            this.getPhotos(e).then((result) =>{
                this.AdicionarMidia(result, 
                    this.loopCheckbox.checked, 
                    this.autoPlayCheckbox.checked,
                    this.filterCheckbox.checked);
            }).finally((result) => {
                this.showTable();
                this.inputFileElement.value = '';
            });
        }, true);

        this.btnReset.addEventListener('click', e =>{
            this.deletePhotos();
            this.showNothing();
        }, false);

        this.btnZoomIn.addEventListener('click', e =>{
            this.zoomInPhotos();  
        }, true);

        this.btnZoomOut.addEventListener('click', e =>{
            this.zoomOutPhotos();  
        }, true);

        this.btnHide.addEventListener('click', e =>{
            this.HideShowResetFilesVisibility();
        }, true);

        this.resetFilesDiv.addEventListener('mouseenter', e=>{
            this.HideShowResetFilesVisibility(1);
        });
    }

    zoomInPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        if(this.imagesWidth < 100) this.imagesWidth += 10;
        images.forEach(element => {
            element.style.width = this.imagesWidth + '%';
        });
    }

    HideShowResetFilesVisibility(opacity = 0)
    {
        this.resetFilesDiv.style.opacity = opacity;
        
        if(opacity == 0) 
        {
            
            this.resetFilesDiv.style.position = 'absolute';
        }
        else
        {
            this.resetFilesDiv.style.position = 'static';
        }
    }

    zoomOutPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        if(this.imagesWidth >20) this.imagesWidth -= 10;
        images.forEach(element => {
            element.style.width = this.imagesWidth + '%';
        });
    }

    showNothing()
    {
        this.selectImages.style.display = 'flex';
        this.showImages.style.display = 'none';
        this.loadingElement.style.display = 'none';
    }

    showTable()
    {
        this.selectImages.style.display = 'none';
        this.loadingElement.style.display = 'none';
        this.showImages.style.display = 'flex';            
    }

    showLoad()
    {
        this.selectImages.style.display = 'none';
        this.loadingElement.style.display = 'flex';
        this.showImages.style.display = 'none'; 
    }

    deletePhotos()
    {
        let photoTable = document.querySelectorAll('th');
        photoTable.forEach((element)=>{
            element.parentNode.removeChild(element);
        });

    }

    getPhotos(e)
    {
        return new Promise((resolve, reject) =>
        {
            let photos = e.target.files;

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
    
        for(let i = 0; i < files.length; i++)
        {
            let td = document.createElement('th');
            td.style.display = 'block';
            td.style.padding = 0;

            let media = document.createElement(files[i].fileType == 'data:image' ? 'img' : 'video');
            
            Object.assign(media, {
                src: files[i].src,
                autoplay,
                loop, 
                controls: true,
                muted: true,
                className: 'mediaSize',
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