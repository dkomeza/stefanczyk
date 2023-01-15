const navbarItems = ["", "files", "favourite", "trash", "settings"];

export default class Navbar {
  navbar: HTMLElement;
  navbarList: HTMLElement;
  navbarListItems: NodeListOf<HTMLElement>;
  hoverElement: HTMLElement;
  currentPath: string;
  currentIcon: number;
  constructor() {
    this.navbar = document.querySelector(".navbar")!;
    this.navbarList = document.querySelector(".navbar-list")!;
    this.navbarListItems = this.navbarList.querySelectorAll("li");
    this.hoverElement = document.querySelector(".hover-effect")!;
    this.currentPath = window.location.pathname;
    this.currentIcon = this.getCurrentIcon();
  }
  getCurrentIcon() {
    const path = this.currentPath.split("/")[1];
    return navbarItems.indexOf(path);
  }
  createNavbar() {
    this.navbarListItems[this.currentIcon].classList.add("active");
    this.hoverElement.style.top = `${
      this.navbarListItems[this.currentIcon].offsetTop - 4
    }px`;
    this.hoverElement.style.height = `${
      this.navbarListItems[this.currentIcon].offsetHeight
    }px`;
    this.hoverElement.style.opacity = "1";
    this.navbarListItems.forEach((item) => {
      item.addEventListener("mouseover", () => {
        this.navbarListItems.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        this.hoverElement.style.top = `${item.offsetTop - 4}px`;
        this.hoverElement.style.height = `${item.offsetHeight}px`;
      });
    });
    this.navbarList.onmouseout = () => {
      this.navbarListItems.forEach((item) => {
        item.classList.remove("active");
      });
      this.navbarListItems[this.currentIcon].classList.add("active");
      this.hoverElement.style.top = `${
        this.navbarListItems[this.currentIcon].offsetTop - 4
      }px`;
      this.hoverElement.style.height = `${
        this.navbarListItems[this.currentIcon].offsetHeight
      }px`;
    };
  }
}
