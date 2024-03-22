import React, { useState, useEffect } from "react";
import axios from "axios";

export const DownloadCSV = () => {
  const [mentees, setMentees] = useState([]);
  const [isFirstTime, setisFirstTime] = useState(true);
  // Function to fetch Mentee list from Django endpoint
  const fetchMenteeList = async () => {
    try {
      // Make an HTTP GET request to your Django endpoint
      const response = await axios.get("http://127.0.0.1:8000/getAllMentees/"); // Replace with your Django API endpoint

      // Update the state with the fetched Mentee list
      setMentees(response.data);
    } catch (error) {
      console.error("Error fetching Mentee list:", error);
    }
  };
  // Call the function to fetch the Mentee list when the component loads
  useEffect(() => {
    if (isFirstTime) {
      setisFirstTime(false);
      fetchMenteeList();
    }
  }, [isFirstTime]);

  const handleDownloadCSV = () => {
    try {
      // Sort the data by mentorId and then by id
      const sortedMentees = [...mentees].sort((a, b) => {
        // First, sort by mentorId
        const mentorIdComparison = a.mentorId.localeCompare(b.mentorId);
        if (mentorIdComparison !== 0) {
          return mentorIdComparison;
        }
        // If mentorId is the same, then sort by id
        return a.id.localeCompare(b.id);
      });

      // Filter out keys you want to exclude from the CSV
      const excludedKeys = ["imgSrc", "mentorImage", "f3"];
      const reorderedKeys = [
        "mentorId",
        "mentorName",
        "mentorEmail",
        "menteeDepartment",
        "mentorContact",
        "id",
        "name",
        "email",
        "department",
        "contact",
      ];

      const filteredData = sortedMentees.map((entry) => {
        const filteredEntry = { ...entry };
        excludedKeys.forEach((key) => delete filteredEntry[key]);
        return filteredEntry;
      });

      const csvData = convertToCSV(filteredData, reorderedKeys);

      // Create a Blob containing the CSV data
      const blob = new Blob([csvData], { type: "text/csv" });

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Mentor-Mentees_AY_.csv";

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error creating CSV and downloading:", error);
    }
  };

  const convertToCSV = (data, orderedKeys) => {
    const rows = data.map((entry) => {
      // Map each entry to an array of values in the specified order
      const orderedValues = orderedKeys.map((key) => entry[key]);
      return orderedValues.join(",");
    });

    // Create header row with ordered keys
    const header = orderedKeys.join(",");

    return `${header}\n${rows.join("\n")}`;
  };

  return (
      <button
        className="btn btn-primary mx-2"
        onClick={handleDownloadCSV}
        data-toggle="tooltip"
        data-placement="bottom"
        title="Download Mentor-Mentee Pairings in CSV format"
      >
        Download Mentor-Mentee Pairings
      </button>
  );
};
