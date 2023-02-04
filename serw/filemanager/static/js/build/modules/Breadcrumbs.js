export default class Breadcrumbs {
    constructor() {
        this.breadcrumbs = document.querySelector(".breadcrumbs");
        this.breadcrumbs.children[0].remove();
        this.path = window.location.pathname;
        this.getPath();
        this.finalPath = this.getPath();
    }
    getPath() {
        let path = this.path.split("/");
        path = path.filter((item) => item !== "").splice(1);
        return path;
    }
    createBreadcrumbs() {
        const breadcrumb = document.createElement("a");
        breadcrumb.classList.add("breadcrumb");
        breadcrumb.href = "/files/";
        breadcrumb.innerHTML = '<i class="fa-solid fa-house"></i>';
        breadcrumb.onmouseover = () => {
            this.breadcrumbs.children[0].classList.add("hover");
        };
        breadcrumb.onmouseout = () => {
            this.breadcrumbs.children[0].classList.remove("hover");
        };
        this.breadcrumbs.appendChild(breadcrumb);
        this.finalPath.forEach((item, index) => {
            const breadcrumb = document.createElement("a");
            breadcrumb.classList.add("breadcrumb");
            breadcrumb.href = `/files/${this.finalPath
                .slice(0, index + 1)
                .join("/")}`;
            breadcrumb.textContent = " / " + this.urldecode(item);
            breadcrumb.onmouseover = () => {
                for (let i = 0; i <= index + 1; i++) {
                    this.breadcrumbs.children[i].classList.add("hover");
                }
            };
            breadcrumb.onmouseout = () => {
                for (let i = 0; i < this.breadcrumbs.children.length; i++) {
                    this.breadcrumbs.children[i].classList.remove("hover");
                }
            };
            this.breadcrumbs.appendChild(breadcrumb);
        });
    }
    urldecode(url) {
        return decodeURIComponent((url + "").replace(/\+/g, "%20"));
    }
}
