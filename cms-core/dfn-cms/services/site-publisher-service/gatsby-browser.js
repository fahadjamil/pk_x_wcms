import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css"
import "bootstrap-v4-rtl/dist/js/bootstrap.min.js"
import "react-lazy-load-image-component/src/effects/blur.css"

const addScript = url => {
  const script = document.createElement("script")
  script.src = url
  script.async
  document.body.appendChild(script)
}

export const onInitialClientRender = () => {
//   addScript("/ua/assets/ua-scripts-1620802552250.js")
  console.log("in side onInitialClientRender -------")
}

export const onServiceWorkerUpdateFound = () => {
  console.log("in side onServiceWorkerUpdateFound -------")
}

export const disableCorePrefetching = () => {
  console.log("in side  disableCorePrefetching ------------------")
}
export const onClientEntry = () => {
  // addScript("/bk-static/ua-root-creation.js")
}
export const onPostPrefetchPathname = () => {
  console.log("in side onPostPrefetchPathname  ------------------")
}
export const onPreRouteUpdate = () => {
  console.log("in side  onPreRouteUpdate ------------------")
}
export const onPrefetchPathname = () => {
  console.log("in side onPrefetchPathname  ------------------")
}
export const onRouteUpdate = () => {
  console.log("in side  onRouteUpdate ------------------")
}
export const onRouteUpdateDelayed = () => {
  console.log("in side  onRouteUpdateDelayed ------------------")
}
export const onServiceWorkerActive = () => {
  console.log("in side onServiceWorkerActive  ------------------")
}
export const onServiceWorkerInstalled = () => {
  console.log("in side  onServiceWorkerInstalled ------------------")
}
export const onServiceWorkerRedundant = () => {
  console.log("in side onServiceWorkerRedundant  ------------------")
}
export const onServiceWorkerUpdateReady = () => {
  console.log("in side  onServiceWorkerUpdateReady ------------------")
}
export const registerServiceWorker = () => {
  console.log("in side  registerServiceWorker ------------------")
}
export const replaceComponentRenderer = () => {
  console.log("in side  replaceComponentRenderer  ------------------")
}
export const replaceHydrateFunction = () => {
  console.log("in side  replaceHydrateFunction ------------------")
}
export const shouldUpdateScroll = () => {
  console.log("in side shouldUpdateScroll  ------------------")
}
export const wrapPageElement = () => {
  console.log("in side  wrapPageElement ------------------")
}
export const wrapRootElement = () => {
  console.log("in side wrapRootElement  ------------------")
}
