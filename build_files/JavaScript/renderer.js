document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed (renderer.js)');

  const sendButton = document.getElementById('sendButton');

  if (sendButton) {
    sendButton.addEventListener('click', () => {
      if (window.myApi) {
        window.myApi.sendMessage('Hello from renderer');
      } else {
        console.error('window.myApi is not defined');
      }
    });
  } else {
    console.error('sendButton element not found');
  }
});
