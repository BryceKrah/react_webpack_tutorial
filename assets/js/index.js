const printMessage = () => `
You have successfully configured webpack and babel
`;

window.onload = () => {
  let $h3 = document.getElementsByTagName('h3')[0];
  $h3.innerHTML = printMessage();
}
