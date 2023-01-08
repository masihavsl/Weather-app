const mainDiv = document.querySelector(".weather");
const cityDescription = document.querySelector(".city");
const temp = document.querySelector(".temp");
const iconImg = document.querySelector(".icon");
const description = document.querySelector(".description");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const search = document.querySelector(".search");
const search_bar = document.querySelector(".search-bar");

function startApp() {
  const getPos = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, (err) =>
        reject("Something went wrong " + err)
      );
    });

  async function helper(link) {
    const myLocData = await fetch(link);
    if (!myLocData.ok) throw new Error("No weather found.");
    return myLocData.json();
  }
  //getting the geo location and displaying it
  (async function () {
    try {
      const res = await getPos();
      const { latitude: lat, longitude: lng } = res.coords;
      const myLoc = await helper(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=e027990ab2dd4c0d75b25e1e5ad1ca7c`
      );
      displayData(myLoc);
    } catch (err) {
      window.alert(err);
    }
  })();
  //fetching the searched city data and displaying
  search.addEventListener("submit", function (e) {
    e.preventDefault();
    (async function () {
      try {
        mainDiv.classList.add("loading");
        const loc = await helper(
          `https://api.openweathermap.org/data/2.5/weather?q=${search_bar.value}&units=metric&appid=e027990ab2dd4c0d75b25e1e5ad1ca7c`
        );
        displayData(loc);
      } catch (err) {
        window.alert(err);
      }
    })();
  });
}

function displayData(data) {
  const { temp: t, humidity: h } = data.main;
  const { description: d, icon: i } = data.weather[0];
  mainDiv.classList.remove("loading");
  cityDescription.innerHTML = `Weather in ${data.name}`;
  temp.innerHTML = `${t}℃`;
  description.innerHTML = d;
  iconImg.src = `https://openweathermap.org/img/wn/${i}.png`;
  humidity.innerHTML = `Humidity: ${h}%`;
  wind.innerHTML = `Wind speed: ${data.wind.speed}km/h`;
  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" + data.name + "')";
}

startApp();
