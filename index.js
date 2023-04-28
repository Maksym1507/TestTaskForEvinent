const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let quantityPoints = 0;

const namesOfPoints = ["A", "B", "C", "D"];

let points = [];
let circles = [];
let pointsOfIntersectionOfTwoCircles = [];

function drawPoints() {
  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  getInfoAboutCoordinatesOfSelectedPoints();
}

canvas.addEventListener("click", (e) => {
  if (quantityPoints < 4) {
    points.push({ x: e.offsetX, y: e.offsetY });
    console.log(points[quantityPoints].x);
    quantityPoints++;
    if (quantityPoints == 4) {
      createCircles(e);
    }
  }

  drawPoints();
});

canvas.addEventListener("mousedown", function (event) {
  const mousePosX = event.clientX - canvas.getBoundingClientRect().left;
  const mousePosY =
    event.clientY - Math.floor(canvas.getBoundingClientRect().top);

  for (const point of points) {
    if (
      Math.sqrt(
        Math.pow(mousePosX - point.x, 2) + Math.pow(mousePosY - point.y, 2)
      ) <= 5
    ) {
      let isDragging = true;

      canvas.addEventListener("mousemove", function (event) {
        if (isDragging) {
          const newMousePosX =
            event.clientX - canvas.getBoundingClientRect().left;
          const newMousePosY =
            event.clientY - Math.floor(canvas.getBoundingClientRect().top);

          point.x = newMousePosX;
          point.y = newMousePosY;

          createCircles(event);
        }
      });

      canvas.addEventListener("mouseup", function (event) {
        isDragging = false;
      });

      break;
    }
  }
});

function getInfoAboutCoordinatesOfSelectedPoints() {
  infoAboutCoordinatesOfSelectedPoints.innerHTML =
    "<h2>Інформація про координати виділених точок</h2>";
  if (points.length === 0) {
    infoAboutCoordinatesOfSelectedPoints.innerHTML +=
      "<p>Ви ще не задали ні однієї точки</p>";
  } else {
    const listForCoordinatesOfSelectedPoints = document.createElement("ul");

    for (let i = 0; i < points.length; i++) {
      const listElementForCoordinatesOfSelectedPoints =
        document.createElement("li");
      listElementForCoordinatesOfSelectedPoints.textContent = `${namesOfPoints[i]} (${points[i].x}; ${points[i].y})`;
      listForCoordinatesOfSelectedPoints.appendChild(
        listElementForCoordinatesOfSelectedPoints
      );
    }
    infoAboutCoordinatesOfSelectedPoints.appendChild(
      listForCoordinatesOfSelectedPoints
    );
  }

  getInfoAboutCoordinatesOfIntersectionPointsOfTwoCircles();
}

function getInfoAboutCoordinatesOfIntersectionPointsOfTwoCircles() {
  if (points.length === 4) {
    infoAboutCoordinatesOfIntersectionPointsOfTwoCircles.innerHTML =
      "<h2>Інформація про координати точок перетину двох кіл</h2>";

    if (pointsOfIntersectionOfTwoCircles.length > 0) {
      const listForCirclesIntersection = document.createElement("ul");
      for (const pointOfIntersectionOfTwoCircles of pointsOfIntersectionOfTwoCircles) {
        const listElementForCirclesIntersection = document.createElement("li");
        listElementForCirclesIntersection.textContent = `(${pointOfIntersectionOfTwoCircles.x}; ${pointOfIntersectionOfTwoCircles.y})`;
        listForCirclesIntersection.appendChild(
          listElementForCirclesIntersection
        );
      }
      infoAboutCoordinatesOfIntersectionPointsOfTwoCircles.appendChild(
        listForCirclesIntersection
      );
    } else {
      infoAboutCoordinatesOfIntersectionPointsOfTwoCircles.innerHTML +=
        "<p>Кола не перетинаються</p>";
    }
  } else {
    infoAboutCoordinatesOfIntersectionPointsOfTwoCircles.innerText = "";
  }
}

function createCircles(e) {
  circles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var radiusA = Math.sqrt(
    (points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2
  );
  var radiusC = Math.sqrt(
    (points[3].x - points[2].x) ** 2 + (points[3].y - points[2].y) ** 2
  );

  circles.push({ x: points[0].x, y: points[0].y, radius: radiusA });
  circles.push({ x: points[2].x, y: points[2].y, radius: radiusC });

  ctx.fillStyle = "rgba(0, 77, 255, 0.5)";
  ctx.beginPath();
  ctx.arc(points[0].x, points[0].y, radiusA, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
  ctx.beginPath();
  ctx.arc(points[2].x, points[2].y, radiusC, 0, Math.PI * 2, true);
  ctx.fill();

  checkCircleIntersection();

  drawPoints();
}

function checkCircleIntersection() {
  for (let i = 0; i < circles.length; i++) {
    let circleA = circles[i];

    for (let j = i + 1; j < circles.length; j++) {
      let circleC = circles[j];
      const dx = circleC.x - circleA.x;
      const dy = circleC.y - circleA.y;
      const distance = Math.hypot(dx, dy);

      if (
        distance < circleA.radius + circleC.radius &&
        distance + circleA.radius >= circleC.radius &&
        distance + circleC.radius >= circleA.radius
      ) {
        const a =
          (circleA.radius * circleA.radius -
            circleC.radius * circleC.radius +
            distance * distance) /
          (2 * distance);

        const h = Math.sqrt(circleA.radius * circleA.radius - a * a);

        const intersectionX1 =
          circleA.x + (dx * a) / distance + (dy * h) / distance;
        const intersectionY1 =
          circleA.y + (dy * a) / distance - (dx * h) / distance;
        const intersectionX2 =
          circleA.x + (dx * a) / distance - (dy * h) / distance;
        const intersectionY2 =
          circleA.y + (dy * a) / distance + (dx * h) / distance;

        if (pointsOfIntersectionOfTwoCircles !== 0) {
          pointsOfIntersectionOfTwoCircles = [];
        }

        pointsOfIntersectionOfTwoCircles.push({
          x: Math.floor(intersectionX1),
          y: Math.floor(intersectionY1),
        });
        pointsOfIntersectionOfTwoCircles.push({
          x: Math.floor(intersectionX2),
          y: Math.floor(intersectionY2),
        });
      } else {
        pointsOfIntersectionOfTwoCircles = [];
      }
    }
  }
}

function about() {
  document.getElementById("about").style.display = "block";
}

function hideAbout() {
  document.getElementById("about").style.display = "none";
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  points = [];
  circles = [];
  pointsOfIntersectionOfTwoCircles = [];
  quantityPoints = 0;
  getInfoAboutCoordinatesOfSelectedPoints();
}

drawPoints();
