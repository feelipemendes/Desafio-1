/*
 * Estado da Aplicação (state)
 */
let totalPeople = null;
let allPeople = null;
let filteredPeople = null;

let countFemale = null;
let countMale = null;
let totalAge = null;
let averageAge = null;

let tabFilterUsers = null;
let tabStatistic = null;

let botaoBuscar = null;
let inputBuscar = null;

window.addEventListener('load', () => {
  tabFilterUsers = document.querySelector('#tabFilterUsers');
  tabStatistic = document.querySelector('#tabStatistic');

  botaoBuscar = document.querySelector('#botaoBuscar');
  inputBuscar = document.querySelector('#inputBuscar');

  doFetchAsync();

  inputBuscar.addEventListener('keyup', handleFormSubmit);
  botaoBuscar.addEventListener('click', handleFormSubmit);
});
function handleFormSubmit(event) {
  checkButtonSubmit();

  if (event.key === 'Enter') {
    doFilter(inputBuscar.value);
  }
}
function doFilter(firstName) {
  filteredPeople = allPeople
    .filter((person) => {
      return person.name.toLowerCase().search(firstName.toLowerCase()) !== -1;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  render();
}

async function doFetchAsync() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allPeople = json.results.map((person) => {
    return {
      name: `${person.name.first} ${person.name.last}`,
      picture: person.picture.large,
      dob: person.dob.age,
      gender: person.gender,
    };
  });
}

function render() {
  calcTotalPeople();
  sumFemale();
  sumMale();
  sumTotalAge();
  calcAverageAge(totalAge, totalPeople);
  renderPeopleList();
  renderStatistic();
}

function renderPeopleList() {
  let peopleHtml = `<div>
                      <h4>${totalPeople} usuários(a) encontrados(a)</h4>`;

  filteredPeople.forEach((person) => {
    const { name, picture, dob, gender } = person;

    const personHtml = `
    <div class='person'>
    
    <ul class="collection">
      <li class="collection-item avatar">
        <img src="${picture}" alt="" class="circle" />
        <span class="title">${name}</span>
        <p>
          ${dob}, anos           
        </p>      
      </li>
    </ul>
    </div>
    `;

    peopleHtml += personHtml;
  });

  tabFilterUsers.innerHTML = peopleHtml;
}
function renderStatistic() {
  let statisticHtml = `<div>
                          <p>
                            Sexo Feminino: <strong>${countFemale}</strong>
                          </p>
                          <p>
                            Sexo Masculino: <strong>${countMale}</strong>
                          </p>
                          <p>
                            Soma das Idades: <strong>${totalAge}</strong>
                          </p>
                          <p>
                            Média das Idades: <strong>${averageAge.toFixed(
                              2
                            )}</strong>
                          </p>`;
  tabStatistic.innerHTML = statisticHtml;
}
function calcTotalPeople() {
  totalPeople = filteredPeople.length;
}
function sumFemale() {
  countFemale = filteredPeople.filter((person) => {
    return person.gender === 'female';
  }).length;
}
function sumMale() {
  countMale = filteredPeople.filter((person) => {
    return person.gender === 'male';
  }).length;
}
function sumTotalAge() {
  totalAge = filteredPeople.reduce((accumulator, current) => {
    return (accumulator += current.dob);
  }, 0);
}
function calcAverageAge() {
  if (totalPeople === 0) {
    averageAge = 0;
    return;
  }
  averageAge = totalAge / totalPeople;
}
function checkButtonSubmit() {
  if (inputBuscar.value !== '') {
    botaoBuscar.classList.remove('disabled');
  } else {
    botaoBuscar.classList.add('disabled');
  }
}
