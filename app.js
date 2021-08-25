const routes = {
  '/' : home,
  '/users' : users,
  '/canvas' : canvas
};
const methods = {
  '/users' : initUserPage,
  '/canvas' : initCanvasPage
}

const appDiv = document.getElementById('app');
appDiv.innerHTML = routes[window.location.pathname] || home;

const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname
  )

  appDiv.innerHTML = routes[pathname] || home
  if (methods[pathname]) {
    methods[pathname]()
  }
}

window.onpopstate = () => {
  appDiv.innerHTML = routes[window.location.pathname] || home
}
