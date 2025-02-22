let url;
let coordinates;
let formattedDate;
let fulldate;
let fulltime;
let day;
let latitude;
let longitude;
let current;
let repeat;
let search_history = [];
const key = "af9a4ea660de41109c542457250902";
const date = document.querySelector(".date");
const address = document.querySelector(".address");
const input = document.querySelector(".input");
const search = document.querySelector(".search");
const title = document.querySelector(".title");
const history_list = document.querySelector(".history_list");
const item = document.querySelector(".city-item");
const info = [address, title, date];

function animate(){
  info.forEach((name) => {
    name.classList.toggle("transition_info");
  })

  setTimeout(() => {
    info.forEach((name) => {
      name.classList.toggle("transition_info");
    })
  }, 300);
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherData();
    setTimeout(() => {
      input.value = "";
    }, 500);
    e.preventDefault();
  }
});

history_list.addEventListener("click", (e) => {
  const item = e.target.closest(".city-item");
  if (!item) return;
  getWeatherData(item.textContent.trim());
});

search.addEventListener("click", () => {
  input.focus();
});

function getWeatherData(city) {
  coordinates = input.value || city;
  url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${coordinates}`;
  current = city
  try {
    fetch(url)
      .then(async (response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message);
        }
        
        console.log(data);
    
        // Extract and format local time
        let localtime = new Date(data.location.localtime);
        day = localtime.toLocaleString("en-US", { weekday: "long" });
        fulldate = localtime.toLocaleString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric",
        });
        fulltime = localtime.toLocaleString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit",
        });

        latitude = data.location.lat;
        longitude = data.location.lon;

        date.innerHTML = `<div>${day}</div><div>${fulldate}</div><div>${data.location.tz_id}</div>`;
        history_list.innerHTML = `<div>${fulltime}</div>`; 
        title.innerHTML = `<div class="icon">${data.current.condition.text}</div><div class="cloud">${data.current.cloud}%<img src="${data.current.condition.icon}"></div>`;
        address.innerHTML = `<div><div>${data.location.name}</div><div>${data.location.region}, ${data.location.country}</div></div><div>${convertToDMS(latitude, true)}  ${convertToDMS(longitude, false)}</div>`;

        animate();
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error.message);
      });

      

  } catch (e) {
    console.log("Invalid coordinates");
  }
}




function convertToDMS(decimal, isLatitude) {
  let direction = isLatitude 
    ? (decimal >= 0 ? "N" : "S") 
    : (decimal >= 0 ? "E" : "W");

  let degrees = Math.floor(decimal);
  let minutes = Math.floor((decimal - degrees) * 60);
  let seconds = ((decimal - degrees - minutes / 60) * 3600).toFixed(2);

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

function historycheck(input) {
  if (!search_history.includes(input.toLowerCase())) {
    search_history.push(input.toLowerCase());
    add_history();
  }

  if (search_history.length > 0) {
    history_list.classList.remove("empty");
    const emptyMessage = document.querySelector(".empty_message");
    if (emptyMessage){
      history_list.removeChild(emptyMessage);
    }
  }
}


function add_history() {
  const list_item = document.createElement("div");
  list_item.classList.add("city");

  const item = document.createElement("div");
  item.classList.add("city-item");
  list_item.appendChild(item);

  const arrow = document.createElement("img");
  arrow.src = "arrow.png";
  item.appendChild(arrow);

  const name = document.createElement("div");
  name.textContent = search_history.at(-1);
  item.appendChild(name);

  history_list.appendChild(list_item);
}

getWeatherData("ormoc");
if (search_history.length === 0) {
  const empty_history = document.createElement('div');
  empty_history.classList.add("empty_message");
  empty_history.innerHTML = `<div class="empty_message">History is empty</div>`;
  history_list.appendChild(empty_history);
  history_list.classList.toggle("empty");
}

