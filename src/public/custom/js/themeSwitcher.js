let theme = 0;
const darkBackground = '#2b2b2b';
const whiteBackground = '#ffffff';
// eslint-disable-next-line no-unused-vars
function switchTheme() {
  const themeIcon = document.getElementById('themeIcon');
  if (theme == 0) {
    document.body.style.backgroundColor = darkBackground;
    themeIcon.classList.remove('fas');
    themeIcon.classList.add('far');
    changePagesBackgrounds();
    theme = 1;
  } else {
    document.body.style.backgroundColor = whiteBackground;
    themeIcon.classList.remove('far');
    themeIcon.classList.add('fas');
    changePagesBackgrounds();
    theme = 0;
  }
}

function changePagesBackgrounds() {
  if (window.location.pathname == '/') {
    changeAdBackground();
  }
  if (document.URL.includes('profile')) {
    changeAdBackground();
    changeProfileColor();
  }
}

function changeAdBackground() {
  const ads = document.getElementsByClassName('marketAdTheme');
  console.log(ads);
  if (theme == 0) {
    for (let index = 0; index < ads.length; index++) {
      ads[index].style.backgroundColor = darkBackground;
      ads[index].classList.add('whiteBorder');
    }
  } else {
    for (let index = 0; index < ads.length; index++) {
      ads[index].style.backgroundColor = whiteBackground;
      ads[index].classList.remove('whiteBorder');
    }
  }
}

function changeProfileColor() {
  const profileTheme = document.getElementById('profileTheme');
  if (theme == 0) {
    profileTheme.style.backgroundColor = darkBackground;
  } else {
    profileTheme.style.backgroundColor = whiteBackground;
  }
}
