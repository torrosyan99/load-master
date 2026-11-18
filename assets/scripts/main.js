const header = document.querySelector(".header");
const toggle = header.querySelector(".header__toggle");
const mobile = window.matchMedia("(max-width: 850px)");

function setOpen(open) {
  header.classList.toggle("header--open", open);
  document.body.classList.toggle("page--menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "false";
  setOpen(open);
});

header.addEventListener("click", (event) => {
  if (event.target.closest("a") && mobile.matches) setOpen(false);
});


mobile.addEventListener("change", () => setOpen(false));
setOpen(false);

AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: 'ease-out',
  disable: () => window.innerWidth < 768
});

function initStages() {
  const content = document.getElementById("stage-content");
  if (!content) return;
  const buttons = document.querySelectorAll("[data-stage]");
  const stages = [
    [
      "Record the source.",
      "Choose a saved loading point or select a location on the map. Record the material, purchase quantity, purchase rate and optional purchase photos.",
    ],
    [
      "Connect the people and vehicle.",
      "Choose the driver and, where applicable, the vehicle for the delivery record. The quick-booking screen also provides a route into the trip draft.",
    ],
    [
      "Complete the delivery record.",
      "Add the site, DC date and number, sale quantity and rate. Attach optional proof-of-delivery photos and keep expenses with the trip.",
    ],
    [
      "Keep receipts and reports together.",
      "Record the customer payment with its date, amount and method. Review billing records, customer statements and business profit.",
    ],
  ];

  function selectStage(index) {
    const [title, description] = stages[index];
    content.innerHTML = `<span class="stage-content__number">0${index + 1}</span><h3 class="stage-content__title">${title}</h3><p class="stage-content__description">${description}</p>`;
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.stage) === index));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectStage(Number(button.dataset.stage)));
  });
  selectStage(0);
}

initStages()


function initToggleGroup({
                           containerSelector,
                           itemSelector,
                           triggerSelector
                         }) {
  const containers = containerSelector
    ? document.querySelectorAll(`[${containerSelector}]`)
    : [document];

  containers.forEach((container) => {
    const mode = containerSelector
      ? container.getAttribute(containerSelector)
      : null;

    const oneActive =
      mode === "one-active" ||
      mode === "one-active-important";

    const oneActiveImportant = mode === "one-active-important";

    const items = container.querySelectorAll(`[${itemSelector}]`);

    const setOpen = (item, open) => {
      item.classList.toggle("faq__item--open", open);

      const trigger = item.querySelector(`[${triggerSelector}]`);

      trigger?.setAttribute("aria-expanded", String(open));

      const content = item.querySelector("[data-accordion-content]");
      if (content) {
        content.inert = !open;
      }
    };

    let hasOpenItem = false;

    items.forEach((item) => {
      const isOpen = item.classList.contains("faq__item--open");

      if (oneActive && isOpen && hasOpenItem) {
        setOpen(item, false);
      } else {
        setOpen(item, isOpen);

        if (isOpen) hasOpenItem = true;
      }
    });

    if (oneActiveImportant && !hasOpenItem && items.length) {
      setOpen(items[0], true);
    }

    items.forEach((item) => {
      const trigger = item.querySelector(`[${triggerSelector}]`);

      trigger?.addEventListener("click", () => {
        const isOpen = item.classList.contains("faq__item--open");

        if (oneActiveImportant && isOpen) return;

        if (oneActive && !isOpen) {
          items.forEach((otherItem) => {
            if (otherItem !== item) {
              setOpen(otherItem, false);
            }
          });
        }

        setOpen(item, !isOpen);
      });
    });
  });
}

initToggleGroup({
  containerSelector: "data-accordions",
  itemSelector: "data-accordion",
  triggerSelector: "data-accordion-trigger"
});
