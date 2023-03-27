import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchEl.addEventListener('input', debounce(handleSearchInput, DEBOUNCE_DELAY));

function handleSearchInput(event) {
  const countryName = event.target.value.trim();

  if (!countryName) {
    clearCountryTamplateData();
    return;
  }

  fetchCountries(countryName)
    .then(dataCountries => {
      if (dataCountries.length > 10) {
        moreSpecificNameInfo();
        clearCountryTamplateData();
        return;
      }
      renderCountriesData(dataCountries);
    })
    .catch(error => {
      clearCountryTamplateData();
      errorWarning();
    });
}

function renderCountriesData(elements) {
  let template = '';
  let templateData = '';

  clearCountryTamplateData();

  if (elements.length === 1) {
    template = createTemplateList(elements);
    templateData = countryListEl;

    drawContriesInfo(templateData, template);
  } else {
    template = createTemplateInfo(elements);
    templateData = countryInfoEl;

    drawContriesList(templateData, template);
  }
}

function createTemplateList(elements) {
  return elements
    .map(
      ({ capital, flags, languages, name, population }) =>
        `<img src="${flags.svg}" alt="${
          name.official
        }" width="240" height="160" />
        <h1 class="country-info__title">${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Lenguages: ${Object.values(languages)}</p>`
    )
    .join(', ');
}

function createTemplateInfo(elements) {
  return elements
    .map(
      ({ name, flags }) =>
        `<li class="country-list__item">
          <img src="${flags.svg}" alt="${name.official}" width="120" height="80"/>
            Country: ${name.official}
          </li>`
    )
    .join('');
}

function clearCountryTamplateData() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function moreSpecificNameInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function errorWarning() {
  Notify.failure('Oops, there is no country with that name.');
}

function drawContriesList(countryListEl, markup) {
  countryListEl.innerHTML = markup;
}

function drawContriesInfo(countryInfoEl, markup) {
  countryInfoEl.innerHTML = markup;
}
