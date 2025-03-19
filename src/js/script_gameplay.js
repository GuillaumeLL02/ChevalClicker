//define the buttons of velocities and excitement
const button_add_click = document.querySelector('input[type="button"][id=add_click]');

const speedElement = document.querySelector('div[id=speed]');
const energyElement = document.querySelector('div[id=energy]');

let nb_click = 0;
let velocity = 0;
let speed = 1;
let energy = 100;
let emplacement = 0;
let ending = false;

let coins = localStorage.getItem("coins");

if (coins == null) {
  localStorage.setItem("coins", "0");
  coins = localStorage.getItem("coins");
}



//show all the buttons
button_add_click.disabled = false;

//Upgrades :
const button_upgrade_1 = document.querySelector('input[type="button"][id=upgrade_1]');
const button_upgrade_2 = document.querySelector('input[type="button"][id=upgrade_2]');
const button_upgrade_3 = document.querySelector('input[type="button"][id=upgrade_3]');
const button_upgrade_4 = document.querySelector('input[type="button"][id=upgrade_4]');
const button_upgrade_5 = document.querySelector('input[type="button"][id=upgrade_5]');


//button upgrade 1 : 10 energy
button_upgrade_1.addEventListener("click", () => {
  energy = energy + 10;
  button_upgrade_1.disabled = true;
});

//button upgrade 2 : 5 speed
button_upgrade_2.addEventListener("click", () => {
  speed = speed + 5;
  button_upgrade_2.disabled = true;
});

//button upgrade 3 : pause energy
button_upgrade_3.addEventListener("click", () => {
  energy = energy;
  button_upgrade_3.disabled = true;
});

//button upgrade 4 : 10 energy
button_upgrade_4.addEventListener("click", () => {
  energy = energy + 10;
  button_upgrade_4.disabled = true;
});

//button upgrade 5 : 10 energy
button_upgrade_5.addEventListener("click", () => {
  energy = energy + 10;
  button_upgrade_5.disabled = true;
});

const change_of_var = () => {
  energy = energy - 1;
  if (energy < 0 && ending == false) {
    energy = 0;
    speed = 0;
    ending = true;
    console.log("Number of coins : " + coins);
    coins = Math.floor(Number(coins) + Number(emplacement * 20));
    localStorage.setItem("coins", coins);
  }
  else if (energy < 0 && ending == true) {
    energy = 0;
    speed = 0;
  }
  else {
    speed = velocity * 0.9;
  }
  emplacement = emplacement + speed;
  document.getElementById("speed").textContent = speed.toFixed(2) + ' m/s';
  document.getElementById("energy").textContent = energy.toFixed(2);
  document.getElementById("prog_speed").value = speed.toFixed(2);
  document.getElementById("prog_energy").value = energy.toFixed(2);
  document.getElementById("prog_empl").value = emplacement.toFixed(2);
  document.getElementById("coins_numbers").textContent = coins;
};

setInterval(change_of_var, 1000);

const change_velocity = () => {
  if (velocity > 0) {
    velocity = velocity - 1;
  }
  document.getElementById("prog_velo").value = velocity.toFixed(2);
  document.getElementById("velocity").textContent = velocity.toFixed(2);
}

setInterval(change_velocity, 500);

//when the button is clicked, the velocity is changed (ADD)
button_add_click.addEventListener("click", () => {
  console.log("ADD");
  velocity++;
  document.getElementById("nb_of_click").textContent = nb_click;
  velocity = 10;
  if (energy == 0) {
    button_add_click.disabled = true;
  }
});