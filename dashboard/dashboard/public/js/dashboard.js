const thesidebar = document.getElementById("sidebar");
const sidebar = document.getElementById("svg_the_sidebar");
const svg_sidebar = document.getElementsByClassName("svg_sidebar");
const go_to_dashboard = document.getElementById("go_to_dashboard");
const go_to_dashboard_server = document.getElementById("go_to_dashboard_server");
let txt_to_remove_0 = document.getElementById("txt_to_remove_0");
let txt_to_remove_1 = document.getElementById("txt_to_remove_1");
let home = "";
let home2 = "";
sidebar.addEventListener("click", e => {
  if (thesidebar.classList.toString().includes("collapse")) {
    thesidebar.classList.remove("collapse");
    go_to_dashboard.classList.remove("active");
    home = document.getElementById("home");
    home2 = document.getElementById("home2");
    home.remove();
    home2.remove()

    const span1 = document.createElement('span');
    span1.setAttribute("id", "txt_to_remove_0");
    go_to_dashboard.appendChild(span1);
    txt_to_remove_0 = document.getElementById("txt_to_remove_0");
    txt_to_remove_0.innerHTML = "Accueil";

    const span2 = document.createElement('span');
    span2.setAttribute("id", "txt_to_remove_1");
    go_to_dashboard_server.appendChild(span2);
    txt_to_remove_1 = document.getElementById("txt_to_remove_1");
    txt_to_remove_1.innerHTML = "Serveurs";


    svg_sidebar[0].firstElementChild.points[0].x = 15;
    svg_sidebar[0].firstElementChild.points[1].x = 9;
    svg_sidebar[0].firstElementChild.points[2].x = 15;

    txt_to_remove_0 = document.getElementById("txt_to_remove_0");
    txt_to_remove_1 = document.getElementById("txt_to_remove_1");
  } else {
    thesidebar.classList.add("collapse");
    go_to_dashboard.classList.add("active");
    txt_to_remove_0.remove();
    txt_to_remove_1.remove();

    const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg1.setAttributeNS(null, "width", "24px");
    svg1.setAttributeNS(null, "height", "24px");
    svg1.setAttributeNS(null, "viewBox", "0 0 24 24");
    svg1.setAttributeNS(null, "fill", "none");
    svg1.setAttributeNS(null, "stroke", "currentColor");
    svg1.setAttributeNS(null, "stroke-width", "2");
    svg1.setAttributeNS(null, "stroke-linecap", "round");
    svg1.setAttributeNS(null, "stroke-linejoin", "round");
    svg1.setAttributeNS(null, "style", "margin-left: -10px;");
    svg1.setAttributeNS(null, "id", "home");

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg1.appendChild(path1);
    path1.setAttributeNS(null, 'd', "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z")

    const polyline1 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    svg1.appendChild(polyline1);
    polyline1.setAttributeNS(null, 'points', "9 22 9 12 15 12 15 22")


    go_to_dashboard.appendChild(svg1)

    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg2.setAttributeNS(null, "width", "24px");
    svg2.setAttributeNS(null, "height", "24px");
    svg2.setAttributeNS(null, "viewBox", "0 0 24 24");
    svg2.setAttributeNS(null, "fill", "none");
    svg2.setAttributeNS(null, "stroke", "currentColor");
    svg2.setAttributeNS(null, "stroke-width", "2");
    svg2.setAttributeNS(null, "stroke-linecap", "round");
    svg2.setAttributeNS(null, "stroke-linejoin", "round");
    svg2.setAttributeNS(null, "style", "margin-left: -10px;");
    svg2.setAttributeNS(null, "id", "home2");

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg2.appendChild(path2);
    path2.setAttributeNS(null, 'x', "2");
    path2.setAttributeNS(null, 'y', "2");
    path2.setAttributeNS(null, 'width', "20");
    path2.setAttributeNS(null, 'height', "8");
    path2.setAttributeNS(null, 'rx', "2");
    path2.setAttributeNS(null, 'ry', "2");

    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg2.appendChild(path3);
    path3.setAttributeNS(null, 'x', "2");
    path3.setAttributeNS(null, 'y', "14");
    path3.setAttributeNS(null, 'width', "20");
    path3.setAttributeNS(null, 'height', "8");
    path3.setAttributeNS(null, 'rx', "2");
    path3.setAttributeNS(null, 'ry', "2");

    const polyline2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg2.appendChild(polyline2);
    polyline2.setAttributeNS(null, 'x1', "6")
    polyline2.setAttributeNS(null, 'y1', "6")
    polyline2.setAttributeNS(null, 'x2', "6")
    polyline2.setAttributeNS(null, 'y2', "6")

    const polyline3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg2.appendChild(polyline3);
    polyline3.setAttributeNS(null, 'x1', "6")
    polyline3.setAttributeNS(null, 'y1', "18")
    polyline3.setAttributeNS(null, 'x2', "6")
    polyline3.setAttributeNS(null, 'y2', "18")


    go_to_dashboard_server.appendChild(svg2)

    svg_sidebar[0].firstElementChild.points[0].x = 9;
    svg_sidebar[0].firstElementChild.points[1].x = 15;
    svg_sidebar[0].firstElementChild.points[2].x = 9;

    home = document.getElementById("home");
    home2 = document.getElementById("home2");
  }
});
