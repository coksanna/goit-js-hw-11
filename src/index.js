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