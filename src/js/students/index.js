import { Tabulator } from "tabulator-tables";

import "tabulator-tables/dist/css/tabulator.min.css";

export default function () {
  new Tabulator("#students-table", {
    layout: "fitColumns",
    pagination: "remote",
    paginationSize: 10,
    ajaxURL: "/api/students",
    columns: [
      { title: "Name", field: "name" },
      { title: "Gender", field: "gender" },
      { title: "DOB", field: "dob" },
      { title: "Email", field: "email" },
      { title: "Phone", field: "phone" },
      { title: "City", field: "city" },
      { title: "Address", field: "address" },
      { title: "GPA", field: "gpa" },
      { title: "Major", field: "major" },
      {
        title: "Action",
        field: "id",
        formatter: (cell) => {
          const id = cell.getValue();
          return `<a href="/students/${id}/edit">Edit</a>`;
        },
      },
    ],
  });
}

async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/students"); // Replace with your API URL
    const data = await response.json();
    return data; // Assume the response is an array of student data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
