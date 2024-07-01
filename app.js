const express = require("express");
const fs = require("fs");

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1; // Convert id to a number
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  console.log(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to save data",
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.put("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1; // Convert id to a number
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  const updatedTour = Object.assign(tour, req.body);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to save data",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          tour: updatedTour,
        },
      });
    }
  );
});

app.delete("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1; // Convert id to a number
  const tourIndex = tours.findIndex(el => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  tours.splice(tourIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to save data",
        });
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );
});

const port = 27001;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
