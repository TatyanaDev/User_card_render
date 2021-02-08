"use strict";

function userChoice({ currentTarget }) {
  currentTarget.classList.toggle("shadow");
}

const icons = new Map()
  .set("facebook.com", "./assets/icon/facebook.svg")
  .set("twitter.com", "./assets/icon/twitter.svg")
  .set("instagram.com", "./assets/icon/instagram.svg");

const cardContainer = document.querySelector(".userCardList");
const cards = responseData.map((people) => returnUser(people));
cardContainer.append(...cards);

function returnUser(people) {
  return createElement(
    "li",
    { classNames: ["cardWrapper"], onClick: userChoice },
    createElement(
      "article",
      { classNames: ["cardContainer"] },
      sortImageWrapper(people),
      createElement(
        "div",
        { classNames: ["contentWrapper"] },
        createElement(
          "h3",
          { classNames: ["cardName"] },
          document.createTextNode(
            `${people.firstName} ${people.lastName}`.trim() || ""
          )
        ),
        createElement(
          "p",
          { classNames: ["cardDescription"] },
          document.createTextNode(
            "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo"
          )
        ),
        createElement(
          "ul",
          { classNames: ["socialIcons"] },
          ...createLink(people)
        )
      )
    )
  );
}

function sortImageWrapper(people) {
  const { firstName, lastName, id } = people;
  const imageWrapper = createElement(
    "div",
    {
      classNames: ["cardImageWrapper"],
      id: `wrapper${id}`,
    },
    createElement(
      "div",
      { classNames: ["initials"] },
      document.createTextNode(
        `${firstName.charAt(0)} ${lastName.charAt(0)}`.trim() || ""
      )
    )
  );
  imageWrapper.style.backgroundColor = stringToColour(firstName);
  sortImage(people, { className: "cardImage" });
  return imageWrapper;
}

function sortImage({ firstName, lastName, profilePicture, id }, { className }) {
  const img = createElement("img", {
    classNames: [className],
    attributes: new Map([
      ["alt", `${firstName} ${lastName}`],
      ["src", profilePicture],
    ]),
    dataset: new Map([["id", id]]),
    events: new Map([
      ["error", imageError],
      ["load", imageLoad],
    ]),
  });
  return img;
}

function createLink({ firstName, lastName, contacts }) {
  const sort = contacts
    .map((value) => {
      return value.replace("www.", "");
    })
    .sort();
  let result = [];
  sort.forEach((value) => {
    const hostname = new URL(value).hostname;
    if (icons.has(hostname)) {
      result.push(
        createElement(
          "li",
          { classNames: ["socialIcon"] },
          createElement(
            "a",
            {
              classNames: ["iconLink"],
              attributes: new Map([
                ["href", value],
                ["target", "_blank"],
              ]),
            },
            createElement("img", {
              classNames: ["icon"],
              attributes: new Map([
                ["src", icons.get(hostname)],
                ["alt", `${firstName} ${lastName}` || ""],
              ]),
            })
          )
        )
      );
    }
  });
  return result.filter(Boolean);
}

function imageError({ target }) {
  target.remove();
}

function imageLoad({
  target,
  target: {
    dataset: { id },
  },
}) {
  document.getElementById(`wrapper${id}`).append(target);
}

function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

function createElement(
  type,
  { classNames, id, dataset, attributes, events } = {},
  ...children
) {
  const elem = document.createElement(type);
  if (typeof classNames !== "undefined") elem.classList.add(...classNames);
  if (typeof id !== "undefined") elem.id = id;
  if (typeof dataset !== "undefined")
    dataset.forEach((value, key) => {
      elem.dataset[key] = value;
    });
  if (typeof attributes !== "undefined")
    attributes.forEach((value, key) => {
      elem.setAttribute(key, value);
    });
  if (typeof events !== "undefined")
    events.forEach((value, key) => {
      elem.addEventListener(key, value);
    });
  elem.append(...children);
  return elem;
}

// $("li").click(function () {
//   $(this).toggleClass("shadow");
// });

// cardWrapper.click(function () {
//   $(this).toggleClass("shadow");
// });

// function userChoice({ currentTarget }) {
//   currentTarget.classList.toggle("shadow");
// }

// document.getElementsByClassName("cardWrapper").onClick(userChoice());
