const statusOutput = document.querySelector<HTMLElement>('#contact-status');
const template = document.querySelector<HTMLElement>('#message-template');
const copyTemplate = document.querySelector<HTMLButtonElement>('#copy-template');
const serviceLinks = document.querySelectorAll<HTMLAnchorElement>('[data-service]');
const defaultTemplate = template?.textContent ?? '';

const copyText = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    if (statusOutput) statusOutput.textContent = `${label} copied to clipboard.`;
  } catch {
    if (statusOutput)
      statusOutput.textContent = `Couldn’t copy automatically. Select the ${label.toLowerCase()} above.`;
  }
};

serviceLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const service = link.dataset.service;
    if (template && service) {
      template.textContent = defaultTemplate.replace('[e.g. custom beat]', service);
    }
  });
});

copyTemplate?.addEventListener('click', () => {
  const text = template?.textContent?.trim();
  if (text) void copyText(text, 'Message template');
});
