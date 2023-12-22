"use strict";

const userSelection = ({ target }) => {
  const upTo = (el, tagName) => {
    tagName = tagName.toLowerCase();

    while (el && el.parentNode) {
      el = el.parentNode;

      if (el.tagName && el.tagName.toLowerCase() === tagName) {
        return el;
      }
    }

    return null;
  };

  const cards = document.querySelectorAll("li");
  const card = upTo(target, "li");

  cards.forEach((card) => card.classList.remove("shadow"));
  card.classList.add("shadow");
};

const icons = new Map()
  .set("facebook.com", "./assets/icons/facebook.svg")
  .set("twitter.com", "./assets/icons/twitter.svg")
  .set("instagram.com", "./assets/icons/instagram.svg");

const createElement = (
  type,
  { classNames, id, dataset, attributes, events } = {},
  ...children
) => {
  const elem = document.createElement(type);

  if (typeof classNames !== "undefined") {
    elem.classList.add(...classNames);
  }

  if (typeof id !== "undefined") {
    elem.id = id;
  }

  if (typeof dataset !== "undefined") {
    dataset.forEach((value, key) => (elem.dataset[key] = value));
  }

  if (typeof attributes !== "undefined") {
    attributes.forEach((value, key) => elem.setAttribute(key, value));
  }

  if (typeof events !== "undefined") {
    events.forEach((value, key) => elem.addEventListener(key, value));
  }

  elem.append(...children);

  return elem;
};

const imageLoad = ({ target }) =>
  document.getElementById(`wrapper-${target.dataset.id}`).append(target);

const imageError = ({ target }) => target.remove();

const sortImage = (
  { firstName, lastName, profilePicture, id },
  { className }
) => {
  const img = createElement("img", {
    classNames: [className],
    attributes: new Map([
      ["alt", `${firstName.trim()} ${lastName.trim()}`],
      ["src", profilePicture],
    ]),
    dataset: new Map([["id", id]]),
    events: new Map([
      ["error", imageError],
      ["load", imageLoad],
    ]),
  });

  return img;
};

const stringToColor = (str) => {
  let color = "#";
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;

    const preColor = "00" + value.toString(16);

    color += preColor.substring(preColor.length - 2);
  }

  return color;
};

const sortImageWrapper = (people) => {
  const { firstName, lastName, id } = people;

  const imageWrapper = createElement(
    "div",
    {
      classNames: ["card-image-wrapper"],
      id: `wrapper-${id}`,
    },
    createElement(
      "div",
      { classNames: ["initials"] },
      document.createTextNode(
        `${firstName.charAt(0)} ${lastName.charAt(0)}` || ""
      )
    )
  );

  imageWrapper.style.backgroundColor = stringToColor(firstName.trim());

  sortImage(people, { className: "card-image" });

  return imageWrapper;
};

const createLink = ({ firstName, lastName, contacts }) => {
  const sort = contacts.map((value) => value.replace("www.", "")).sort();

  let result = [];

  sort.forEach((value) => {
    const hostname = new URL(value).hostname;

    if (icons.has(hostname)) {
      result.push(
        createElement(
          "li",
          { classNames: ["social-icon"] },
          createElement(
            "a",
            {
              classNames: ["icon-link"],
              attributes: new Map([
                ["href", value],
                ["target", "_blank"],
              ]),
            },
            createElement("img", {
              classNames: ["icon"],
              attributes: new Map([
                ["src", icons.get(hostname)],
                ["alt", `${firstName.trim()} ${lastName.trim()}` || ""],
              ]),
            })
          )
        )
      );
    }
  });

  return result.filter(Boolean);
};

const returnUser = (people) =>
  createElement(
    "li",
    {
      classNames: ["card-wrapper"],
      events: new Map([["click", userSelection]]),
      id: people.id,
    },
    createElement(
      "article",
      { classNames: ["card-container"] },
      sortImageWrapper(people),
      createElement(
        "div",
        { classNames: ["content-wrapper"] },
        createElement(
          "h3",
          { classNames: ["card-name"] },
          document.createTextNode(
            `${people.firstName.trim()} ${people.lastName.trim()}` || ""
          )
        ),
        createElement(
          "p",
          { classNames: ["card-description"] },
          document.createTextNode(
            "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo"
          )
        ),
        createElement(
          "ul",
          { classNames: ["social-icons"] },
          ...createLink(people)
        )
      )
    )
  );

const body = document.querySelector("body");
const main = createElement("main", { classNames: ["main"] });
const section = createElement("section", { classNames: ["section"] });
const ul = createElement("ul", { classNames: ["user-card-list"] });

const cards = responseData.map((people) => returnUser(people));

body.append(main);
main.append(section);
section.append(ul);
ul.append(...cards);
