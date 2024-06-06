/* -------------------------- Email Form Submission ------------------------- */

const form = document.querySelector('form');
const submitButton = document.getElementById('contact-submit-button');
const emailDialog = document.getElementById('email-dialog');
const dialogCloseButton = document.querySelector('dialog button');

emailDialog.addEventListener('click', (event) => {
  if (event.target === emailDialog) {
    emailDialog.close();
  }
});

dialogCloseButton.addEventListener('click', () => {
  emailDialog.close();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  submitButton.innerHTML = 'Sending...';

  console.log('Form submitted');

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      form.reset();
      resetSubmitButton();
      emailDialog.showModal();
    }
  } catch (error) {
    console.error('Error submitting the form', error);
    alert('Failed to submit the form. Please try again.');
    resetSubmitButton();
  }
});

function resetSubmitButton() {
  submitButton.innerHTML = 'Submit Message';
}
