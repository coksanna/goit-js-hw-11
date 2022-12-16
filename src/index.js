import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import ImageApi from './image-service';

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  scrollZoom: false,  
});

const galleryRef = document.querySelector(".gallery");
const formRef = document.querySelector('form');
const loadMoreBtn = document.querySelector(".load-more");

const imageApi = new ImageApi();

galleryRef.addEventListener('click', onClick);
formRef.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
    e.preventDefault(); 
    clearMarkup();
    loadMoreBtn.classList.add('is-hidden');
    imageApi.query = e.currentTarget.elements.searchQuery.value.trim();
    imageApi.resetPage();
    await imageApi.fetchImages().then(createMarcup).then((data) => {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
    })
}

async function onLoadMore() {
  await imageApi.fetchImages().then(createMarcup).then((data) => {
    const total = data.totalHits / 40;
    if (imageApi.page >= total) {
      loadMoreBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
  });
  imageApi.page += 1;
}
  
function createMarcup(data) {
  if ( imageApi.query === '') {
      return;
  } else if (data.hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  } else {
    lightbox.refresh();
    const markup = data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<a class="gallery__item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes:</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views:</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments:</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads:</b> ${downloads}
      </p>
    </div>
    </a>`).join('');
    galleryRef.insertAdjacentHTML("beforeend", markup);
    if (data.total <= 40) {
      lightbox.refresh();
      return data;
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
    lightbox.refresh();
    return data;
  }
}
 
function clearMarkup() {
    galleryRef.innerHTML = "";    
}

function onClick(e) {
  window.addEventListener('keydown', closeModal);
  const galleryCard = e.target.classList.contains('gallery__image');
  if (!galleryCard) {
    return;
  };
}

function closeModal(e) {
  if (e.code === 'Escape') {
    lightbox.close(() => {
      window.removeEventListener('keydown', closeModal);
    });
  }
}


// import Notiflix from 'notiflix';
// import NewsApiServer from './url';
// import SimpleLightbox from 'simplelightbox';
// import "simplelightbox/dist/simple-lightbox.min.css";

// const lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
//   closeText: '🐠',
// });

// const refs = {
//   form: document.querySelector('form'),
//   input: document.querySelector('input'),
//   gallery: document.querySelector('.gallery'),
//   loadMore: document.querySelector('button.load-more')
// };
// console.log(refs)
// const newsApiServer = new NewsApiServer();
// refs.form.addEventListener('submit', onSubmiteClick);
// refs.gallery.addEventListener('click', onCardGallery);
// refs.loadMore.addEventListener('click', onMore);

// async function onSubmiteClick(e) {
//   e.preventDefault();
//   clearList();
//   refs.loadMore.classList.add('is-hiden');
//   newsApiServer.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
//   newsApiServer.resetPage();
//   await newsApiServer.getUrl().then(onList).then((data) => {

//     Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
//   })
  
// }

// async function onMore() {

//   await newsApiServer.getUrl().then(onList).then((data) => {
//     const total = data.totalHits / 40;
//     if (newsApiServer.page >= total) {
//       refs.loadMore.classList.add('is-hiden');
//       return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
//     }
//   });
//   newsApiServer.page += 1;
// }
// function onList(data) {

//   if ( newsApiServer.searchQuery === '') {
//     return;
//   } else if (data.hits.length === 0) {
//     return Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   } else {
//     // lightbox.refresh();
//     const list = data.hits
//       .map(
//         ({
//           webformatURL,
//           largeImageURL,
//           tags,
//           likes,
//           views,
//           comments,
//           downloads,
//         }) => {
//           return `
//  <a class="gallery__item" href="${largeImageURL}">
//   <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes: ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views: ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments: ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads: ${downloads}</b>
//     </p>
//   </div>
//   </a>
//  `;
//         }
//       )
//       .join('');
//     console.log(data.total);
//     refs.gallery.insertAdjacentHTML('beforeend', list);
//     if (data.total <= 40) {
//       lightbox.refresh();
//       return data;
//     } else {
//       refs.loadMore.classList.remove('is-hiden');
//     }
//     lightbox.refresh();

    
//     return data;
//   }

// }

// function clearList() {
//   refs.gallery.innerHTML = '';
// }

// function onCardGallery(event) {
//   event.preventDefault();
//   window.addEventListener('keydown', closeModalKeydown);
 
//   const findGalleryCard = event.target.classList.contains('gallery__image');
//   console.log(findGalleryCard)
//   if (!findGalleryCard) {
//     return;
//   }

// }

// function closeModalKeydown(e) {
//   if (e.code === 'Escape') {
//     lightbox.close(() => {
//       window.removeEventListener('keydown', closeModalKeydown);
//     });
//   }
// }
